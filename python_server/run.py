from langgraph.graph import StateGraph, START
from backend import stt_and_parse, AgentState

# Build mini graph
graph = StateGraph(AgentState)
graph.add_node("stt_and_parse", stt_and_parse)
graph.add_edge(START, "stt_and_parse")
app = graph.compile()

if __name__ == "__main__":
    state = {}
    final_state = app.invoke(state)
    print("\n---- FINAL RESULT ----")
    print(final_state)
    print("💬 Response:", final_state.get("final_message"))
