import os
from typing import TypedDict, Optional
from dotenv import load_dotenv
import speech_recognition as sr
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Literal
from pymongo import MongoClient
from datetime import datetime, timedelta
import dateparser

# LangGraph
from langgraph.graph import StateGraph, START, END

# ------------------ Load ENV ------------------
load_dotenv()

# ------------------ STATE ---------------------
class AgentState(TypedDict):
    audio_file: Optional[str]
    text: Optional[str]
    intent: Optional[dict]
    db_result: Optional[dict]
    final_message: Optional[str]

# ------------------ RECORDING -----------------
def record_until_silence(filename="sample_audio.wav"):
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎙️ Speak now... (auto-stop after silence)")
    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, phrase_time_limit=None)

    with open(filename, "wb") as f:
        f.write(audio.get_wav_data())

    print(f"✅ Saved recording to {filename}")
    return filename

# ------------------ SCHEMA --------------------
class ExpenseSchema(BaseModel):
    action: Literal["add_expense", "query_expense"] = Field(
        description="What user wants: add new expense or query expenses"
    )
    amount: Optional[float] = Field(
        description="Expense amount if mentioned. If not mentioned, leave null."
    )
    category: Optional[str] = Field(description="Category like Food, Travel, Shopping")
    description: Optional[str] = Field(description="Short description of expense")
    date: Optional[str] = Field(description="Date if user mentioned (YYYY-MM-DD or relative)")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(ExpenseSchema)

# ------------------ NODE 1 --------------------
def stt_and_parse(state: AgentState) -> AgentState:
    audio_path = record_until_silence()
    state["audio_file"] = audio_path

    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="en"
        )
    state["text"] = transcription.text
    print(f"📝 Transcribed Text: {state['text']}")

    parsed = structured_llm.invoke(state["text"])
    state["intent"] = parsed.model_dump()  # ✅ fixed pydantic warning

    print("📦 Parsed JSON:", state["intent"])
    return state

# ------------------ DB SETUP ------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["finvoice"]
expenses_collection = db["expenses"]

def resolve_date(date_str: Optional[str]) -> datetime:
    """Parse natural language dates like 'today', 'yesterday' into datetime"""
    if not date_str:
        return datetime.now()
    parsed_date = dateparser.parse(
        date_str,
        settings={
            "PREFER_DATES_FROM": "past",
            "RELATIVE_BASE": datetime.now()  # ✅ ensures 'today' is now
        }
    )
    return parsed_date if parsed_date else datetime.now()

def normalize_category(category: Optional[str]) -> str:
    """Normalize category (lowercase, singular form)"""
    if not category:
        return "miscellaneous"
    return category.lower().rstrip("s")  # ✅ grocery == groceries

# ------------------ NODE 2 --------------------
def db_node(state: AgentState) -> AgentState:
    intent = state.get("intent", {})
    action = intent.get("action")

    if action == "add_expense":
        if not intent.get("amount"):
            state["db_result"] = {"status": "failed", "message": "No amount detected"}
            return state

        expense_doc = {
            "amount": float(intent.get("amount")),
            "category": normalize_category(intent.get("category")),
            "description": intent.get("description") or "",
            "date": resolve_date(intent.get("date")),
            "created_at": datetime.now()
        }
        expenses_collection.insert_one(expense_doc)
        state["db_result"] = {"status": "success", "message": "Expense added", "data": expense_doc}

    elif action == "query_expense":
        query = {}
        if intent.get("category"):
            query["category"] = normalize_category(intent["category"])

        if intent.get("date"):
            start_date = resolve_date(intent["date"])
            if start_date:
                end_date = start_date + timedelta(days=1)
                query["date"] = {"$gte": start_date, "$lt": end_date}

        results = list(expenses_collection.find(query, {"_id": 0}))
        state["db_result"] = {"status": "success", "message": f"Found {len(results)} records", "data": results}

    else:
        state["db_result"] = {"status": "failed", "message": "Unknown action"}

    print("🗂️ DB Result:", state["db_result"])
    return state

# ------------------ NODE 3 --------------------
def response_node(state: AgentState) -> AgentState:
    db_result = state.get("db_result", {})

    if db_result.get("status") == "failed":
        state["final_message"] = f"❌ {db_result.get('message')}"

    elif state["intent"]["action"] == "add_expense":
        d = db_result["data"]
        date_str = d["date"].strftime("%Y-%m-%d") if isinstance(d["date"], datetime) else str(d["date"])
        state["final_message"] = f"✅ Added ₹{d['amount']} for {d['description']} ({d['category']}) on {date_str}."

    elif state["intent"]["action"] == "query_expense":
        results = db_result.get("data", [])
        if not results:
            state["final_message"] = "📭 No expenses found for your query."
        else:
            total = sum(r.get("amount", 0) for r in results)
            categories = {r.get("category", 'miscellaneous') for r in results}
            state["final_message"] = f"💰 You spent ₹{total} on {', '.join(categories)} across {len(results)} record(s)."

    print("💬 Final Response:", state["final_message"])
    return state

# ------------------ GRAPH ---------------------
workflow = StateGraph(AgentState)

workflow.add_node("stt_and_parse", stt_and_parse)
workflow.add_node("db_node", db_node)
workflow.add_node("response_node", response_node)

workflow.add_edge(START, "stt_and_parse")
workflow.add_edge("stt_and_parse", "db_node")
workflow.add_edge("db_node", "response_node")
workflow.add_edge("response_node", END)

app = workflow.compile()

# ------------------ RUN -----------------------
if __name__ == "__main__":
    state = {}
    final_state = app.invoke(state)
    print("\n---- FINAL RESULT ----")
    print(final_state)
    print("💬 Response:", final_state.get("final_message"))
