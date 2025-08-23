# backend.py - Core functionality for FinVoice AI Assistant
import os
from typing import TypedDict, Optional, List, Dict, Any
from dotenv import load_dotenv
import speech_recognition as sr
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from pymongo import MongoClient
from datetime import datetime, timedelta
import dateparser
import json
from openai import OpenAI
import asyncio
import re
from bson.json_util import dumps

# LangGraph
from langgraph.graph import StateGraph, START, END

# ------------------ Load Environment ------------------
load_dotenv()

# ------------------ Centralized LLM Setup ------------------
llm_router = None
llm_advisor = None
llm_intent = None
openai_client = None
structured_llm = None

def initialize_llms():
    global llm_router, llm_advisor, llm_intent, openai_client, structured_llm
    
    if llm_router is None:
        llm_router = ChatOpenAI(
            model="gpt-4o-mini", 
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    if llm_advisor is None:
        llm_advisor = ChatOpenAI(
            model="gpt-3.5-turbo", 
            temperature=0.7,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    if llm_intent is None:
        llm_intent = ChatOpenAI(
            model="gpt-4o-mini", 
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    if openai_client is None:
        openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    if structured_llm is None and llm_intent is not None:
        structured_llm = llm_intent.with_structured_output(ExpenseIntent)

# Currency context
CURRENCY_CONTEXT = "All amounts are in Indian Rupees (₹). Please use ₹ symbol instead of $ and mention rupees instead of dollars. Always use Indian currency format."

# ------------------ Structured Output Models ------------------
class ExpenseIntent(BaseModel):
    action: str = Field(description="The action user wants: 'add_expense' or 'query_expense'")
    amount: Optional[float] = Field(description="Expense amount if mentioned, otherwise null")
    category: Optional[str] = Field(description="Expense category like Food, Transport, etc. or null")
    description: Optional[str] = Field(description="Description of the expense or query")
    date: Optional[str] = Field(description="Date if mentioned, otherwise null")

# ------------------ State Definition ------------------
class AgentState(TypedDict):
    user_id: str
    audio_file_path: Optional[str]
    transcribed_text: Optional[str]
    selected_node: Optional[str]
    db_result: Optional[dict]
    financial_data: Optional[dict]
    final_response: Optional[str]
    should_exit: bool
    conversation_history: List[Dict]

# ------------------ Database Setup ------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = None
db = None
expenses_collection = None
goals_collection = None

def initialize_database():
    global client, db, expenses_collection, goals_collection
    
    if client is None:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        db = client["finvoice"]
        expenses_collection = db["expenses"]
        goals_collection = db["goals"]

def resolve_date(date_str: Optional[str]) -> datetime:
    if not date_str:
        return datetime.now()
    try:
        parsed_date = dateparser.parse(date_str, settings={"PREFER_DATES_FROM": "past"})
        return parsed_date if parsed_date else datetime.now()
    except:
        return datetime.now()

def get_user_expenses_summary(user_id: str, category: Optional[str] = None, time_period: int = 7) -> Dict:
    initialize_database()
    end_date = datetime.now()
    start_date = end_date - timedelta(days=time_period)
    
    pipeline = [
        {"$match": {
            "user_id": user_id,
            "date": {"$gte": start_date, "$lte": end_date}
        }},
        {"$group": {
            "_id": "$category",
            "total_amount": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"total_amount": -1}}
    ]
    
    if category:
        pipeline[0]["$match"]["category"] = {"$regex": f"^{category}$", "$options": "i"}

    results = list(expenses_collection.aggregate(pipeline))
    
    total_amount = sum(r["total_amount"] for r in results)
    transaction_count = sum(r["count"] for r in results)
    
    return {
        "total_amount": total_amount,
        "transaction_count": transaction_count,
        "time_period_days": time_period,
        "category_queried": category or "all",
        "top_categories": [{"category": r["_id"], "total": r["total_amount"]} for r in results]
    }

def get_user_financial_data(user_id: str) -> Dict:
    initialize_database()
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    month_ago = today - timedelta(days=30)
    
    monthly_spending = sum(e["amount"] for e in expenses_collection.find({"user_id": user_id, "date": {"$gte": month_ago}}))
    
    pipeline = [
        {"$match": {"user_id": user_id, "date": {"$gte": month_ago}}},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}}},
        {"$sort": {"total": -1}},
        {"$limit": 3}
    ]
    top_categories = list(expenses_collection.aggregate(pipeline))
    
    goals = list(goals_collection.find({"user_id": user_id}).sort("created_at", -1))
    
    return {
        "monthly_spending": monthly_spending,
        "top_categories": top_categories,
        "goals_count": len(goals)
    }

# ------------------ Utilities ------------------
def fix_currency_formatting(text: str) -> str:
    if not text:
        return text
    text = text.replace('$', '₹')
    text = text.replace('dollars', 'rupees').replace('Dollars', 'Rupees')
    text = text.replace('USD', 'INR').replace('usd', 'inr')
    text = re.sub(r'(\d+)\s*rupees', r'₹\1', text, flags=re.IGNORECASE)
    text = re.sub(r'₹\s*(\d+)', r'₹\1', text)
    text = re.sub(r'(\d+)\s*\$', r'₹\1', text)
    return text

# ------------------ Node 2: Speech-to-Text ------------------
def speech_to_text_node(state: AgentState) -> AgentState:
    if not state.get("audio_file_path"):
        state["final_response"] = "No audio file provided"
        return state

    try:
        initialize_llms()
        with open(state["audio_file_path"], "rb") as audio_file:
            transcription = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="en"
            )
        state["transcribed_text"] = transcription.text
        if os.path.exists(state["audio_file_path"]):
            os.remove(state["audio_file_path"])
    except Exception as e:
        print(f"❌ Transcription failed: {e}")
        state["final_response"] = "Sorry, I couldn't transcribe your audio. Please try again."
    return state

# ------------------ Node 3: Smart Decision Router ------------------
async def decision_router_node(state: AgentState) -> AgentState:
    if not state.get("transcribed_text"):
        state["selected_node"] = "conversation_manager"
        return state
    try:
        initialize_llms()
        router_prompt = f"""
        Analyze the user's request: "{state['transcribed_text']}"
        Choose one specialist to handle the request.
        
        Specialist options:
        - expense_manager: Use if the user wants to **add, track, or query specific expenses or spending**. Keywords: 'spent', 'expense', 'cost', 'bill', 'money on', 'spending', 'how much'.
        - financial_insights: Use for general financial questions or trends that require analysis beyond a single transaction. Keywords: 'spending habits', 'savings rate', 'trends', 'most', 'least'.
        - goal_advisor: Use for questions about financial goals, savings, or investments. Keywords: 'save money', 'budget', 'goals', 'invest'.
        - conversation_manager: Use for small talk, greetings, or when the intent is unclear. Keywords: 'hello', 'hi', 'how are you', 'thank you'.
        - exit_handler: Use when the user wants to end the conversation. Keywords: 'goodbye', 'bye', 'see you later'.

        Provide only the name of the chosen specialist node, with no extra text or explanation.
        """
        response = await llm_router.ainvoke(router_prompt)
        selected_node = response.content.strip().lower()
        valid = ["expense_manager","financial_insights","goal_advisor","conversation_manager","exit_handler"]
        state["selected_node"] = selected_node if selected_node in valid else "conversation_manager"
    except Exception as e:
        print(f"⚠ Router failed: {e}")
        state["selected_node"] = "conversation_manager"
    return state

# ------------------ Node 4: Smart Expense Manager ------------------
async def expense_manager_node(state: AgentState) -> AgentState:
    user_id = state["user_id"]
    user_text = state["transcribed_text"]
    try:
        initialize_llms()
        initialize_database()

        try:
            parsed = await structured_llm.ainvoke(user_text)
            expense_data = {
                "action": parsed.action,
                "amount": parsed.amount,
                "category": parsed.category,
                "description": parsed.description,
                "date": parsed.date
            }
        except Exception as e:
            print(f"❌ Structured parsing failed: {e}. Falling back to default query.")
            expense_data = {
                "action": "query_expense",
                "amount": None,
                "category": None,
                "description": user_text,
                "date": None
            }
        
        action = expense_data.get("action")
        
        if action == "add_expense":
            amount = expense_data.get("amount")
            if amount is None:
                state["final_response"] = "❌ I couldn't understand the amount. Try 'I spent 500 on food'"
                return state
            
            expense_doc = {
                "user_id": user_id,
                "amount": float(amount),
                "category": expense_data.get("category", "Miscellaneous"),
                "description": expense_data.get("description", user_text),
                "date": resolve_date(expense_data.get("date")),
                "created_at": datetime.now()
            }
            expenses_collection.insert_one(expense_doc)
            
            response_prompt = f"""
            {CURRENCY_CONTEXT}
            User added an expense: ₹{amount} for category '{expense_doc['category']}'.
            Create a short confirmation with an emoji.
            """
            response = await llm_advisor.ainvoke(response_prompt)
            state["final_response"] = fix_currency_formatting(response.content)
        
        elif action == "query_expense":
            category = expense_data.get("category")
            time_period = 7
            text_lower = user_text.lower()
            if "today" in text_lower:
                time_period = 1
            elif "last month" in text_lower:
                time_period = 30
            elif "last week" in text_lower:
                time_period = 7

            summary_data = get_user_expenses_summary(user_id, category, time_period)
            
            if summary_data['total_amount'] == 0:
                 state["final_response"] = f"You have not spent any money on {category or 'anything'} in the last {time_period} days. Keep it up! 💸"
                 return state

            query_prompt = f"""
            {CURRENCY_CONTEXT}
            The user wants to know about their spending.
            Summary of financial data:
            - Total amount spent: ₹{summary_data['total_amount']:.2f}
            - Number of transactions: {summary_data['transaction_count']}
            - Time period: last {summary_data['time_period_days']} days
            - Category queried: {summary_data['category_queried']}
            
            Generate a concise, helpful response using this summary. Use emojis.
            """
            response = await llm_advisor.ainvoke(query_prompt)
            state["final_response"] = fix_currency_formatting(response.content)
        
        else:
            state["final_response"] = "🤔 I'm not sure. Try 'add expense' or 'show my spending'."
    except Exception as e:
        print(f"❌ Expense node failed: {e}")
        state["final_response"] = "❌ Sorry, I couldn't process that expense."
    return state

# ------------------ Node 5: Smart Financial Insights ------------------
async def financial_insights_node(state: AgentState) -> AgentState:
    try:
        initialize_llms()
        financial_data = get_user_financial_data(state["user_id"])
        
        prompt = f"""
        {CURRENCY_CONTEXT}
        User said: "{state['transcribed_text']}"
        
        Here is the user's financial data for the last 30 days:
        - Total spending: ₹{financial_data['monthly_spending']:.2f}
        - Top spending categories: {financial_data['top_categories']}

        Provide some insights based on this data. The response should be under 4 sentences, use emojis, and offer trends or advice.
        """
        
        response = await llm_advisor.ainvoke(prompt)
        state["final_response"] = fix_currency_formatting(response.content)
    except Exception as e:
        print(f"❌ Insights failed: {e}")
        state["final_response"] = "❌ Insights generation failed."
    return state

# ------------------ Node 6: Smart Goal Advisor ------------------
async def goal_advisor_node(state: AgentState) -> AgentState:
    try:
        initialize_llms()
        initialize_database()
        financial_data = get_user_financial_data(state["user_id"])
        
        goal_prompt = f"""
        {CURRENCY_CONTEXT}
        User asked: "{state['transcribed_text']}"
        Here is their recent financial data:
        - Monthly spending: ₹{financial_data['monthly_spending']:.2f}
        - Top categories: {financial_data['top_categories']}
        
        Give savings goals, investment advice, or budget tips. Make the response short, encouraging, and with emojis.
        """
        
        response = await llm_advisor.ainvoke(goal_prompt)
        state["final_response"] = fix_currency_formatting(response.content)
        if any(w in state["transcribed_text"].lower() for w in ["save","goal","target"]):
            goals_collection.insert_one({
                "user_id": state["user_id"],
                "goal_text": state["transcribed_text"],
                "advice_given": response.content,
                "created_at": datetime.now()
            })
    except Exception as e:
        print(f"❌ Goal advisor failed: {e}")
        state["final_response"] = "❌ Goal advice failed."
    return state

# ------------------ Node 7: Conversation Manager ------------------
async def conversation_manager_node(state: AgentState) -> AgentState:
    try:
        initialize_llms()
        conv_prompt = f"""
        {CURRENCY_CONTEXT}
        You are FinVoice, a friendly AI financial assistant.
        User said: "{state['transcribed_text']}"
        Reply naturally, under 3 sentences, with emojis. Your goal is to be helpful and direct the user to financial tasks.
        """
        response = await llm_advisor.ainvoke(conv_prompt)
        state["final_response"] = fix_currency_formatting(response.content)
    except Exception as e:
        print(f"❌ Conversation failed: {e}")
        state["final_response"] = "❌ Conversation failed."
    return state

# ------------------ Node 8: Exit Handler ------------------
async def exit_handler_node(state: AgentState) -> AgentState:
    try:
        initialize_llms()
        goodbye_prompt = f"""
        User said: "{state.get('transcribed_text','Goodbye')}"
        Reply warmly with an emoji, and keep it short.
        """
        response = await llm_advisor.ainvoke(goodbye_prompt)
        state["final_response"] = fix_currency_formatting(response.content)
        state["should_exit"] = True
    except Exception:
        state["final_response"] = "👋 Thank you for using FinVoice!"
        state["should_exit"] = True
    return state

# ------------------ Graph ------------------
def build_workflow():
    workflow = StateGraph(AgentState)
    workflow.add_node("speech_to_text", speech_to_text_node)
    workflow.add_node("decision_router", decision_router_node)
    workflow.add_node("expense_manager", expense_manager_node)
    workflow.add_node("financial_insights", financial_insights_node)
    workflow.add_node("goal_advisor", goal_advisor_node)
    workflow.add_node("conversation_manager", conversation_manager_node)
    workflow.add_node("exit_handler", exit_handler_node)

    workflow.add_edge(START, "speech_to_text")
    workflow.add_edge("speech_to_text", "decision_router")

    def route(state: AgentState):
        return state.get("selected_node", "conversation_manager")

    workflow.add_conditional_edges("decision_router", route, {
        "expense_manager":"expense_manager",
        "financial_insights":"financial_insights",
        "goal_advisor":"goal_advisor",
        "conversation_manager":"conversation_manager",
        "exit_handler":"exit_handler"
    })

    for node in ["expense_manager","financial_insights","goal_advisor","conversation_manager","exit_handler"]:
        workflow.add_edge(node, END)

    return workflow.compile()

workflow = None

def initialize_workflow():
    global workflow
    if workflow is None:
        print("🔄 Initializing workflow...")
        workflow = build_workflow()
        print("✅ Workflow initialized")
    return workflow

# ✅ Async wrapper for FastAPI
async def initialize_workflow_async():
    initialize_workflow()

# ------------------ FastAPI Integration Helpers ------------------
async def process_message(user_id: str, message: str) -> Dict[str, Any]:
    try:
        if workflow is None:
            initialize_workflow()
        initial_state = AgentState(
            user_id=user_id,
            audio_file_path=None,
            transcribed_text=message,
            selected_node=None, # Let the router decide
            db_result=None,
            financial_data={},
            final_response=None,
            should_exit=False,
            conversation_history=[]
        )
        final_state = await workflow.ainvoke(initial_state)
        return {"success": True, "response": final_state.get("final_response","No response"), "user_id": user_id}
    except Exception as e:
        return {"success": False, "response": f"Error: {str(e)}", "user_id": user_id}

# ✅ Renamed for clarity
async def process_message_async(user_id: str, message: str) -> Dict[str, Any]:
    return await process_message(user_id, message)

def process_message_sync(user_id: str, message: str) -> Dict[str, Any]:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(process_message_async(user_id, message))
    finally:
        loop.close()

# ------------------ Audio Processing (Fixed async) ------------------
async def process_audio_file_async(audio_path: str):
    """Run full pipeline for an uploaded audio file asynchronously."""
    try:
        if workflow is None:
            initialize_workflow()
        initial_state = AgentState(
            user_id="default_user",
            audio_file_path=audio_path,
            transcribed_text=None,
            selected_node=None,
            db_result=None,
            financial_data={},
            final_response=None,
            should_exit=False,
            conversation_history=[]
        )
        final_state = await workflow.ainvoke(initial_state)
        return final_state
    except Exception as e:
        print(f"❌ Error processing audio: {e}")
        return {"final_response": "Sorry, I couldn't process your audio."}

def process_audio_file(audio_path: str):
    """Sync wrapper for FastAPI endpoints"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(process_audio_file_async(audio_path))
    finally:
        loop.close()