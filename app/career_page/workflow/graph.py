from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict, Optional, List, Annotated
import json
from models.hf_models import MODEL_REGISTRY 
from tools.web_search import web_search
from prompts.dynamic_prompts import get_breadth_prompt, get_in_depth_prompt, get_mermaid_prompt, get_roadmap_prompt

class GuidanceState(TypedDict):
    messages: List
    career_options: Optional[List[dict]]
    selected_domain: Optional[str]
    roadmap_text: Optional[str]
    roadmap_mermaid: Optional[str]
    user_selection_pending: Optional[bool]
    roadmap_trigger_pending: Optional[bool]

breadth_llm = MODEL_REGISTRY["mistral"]
depth_llm = MODEL_REGISTRY["llama"]
code_llm = MODEL_REGISTRY["codellama"]
roadmap_llm = MODEL_REGISTRY["mistral"]

def breadth_researcher_node(state: GuidanceState) -> GuidanceState:
    print("🔎 Performing breadth search...")

    queries = [
        "top tech careers in 2025",
        "most in-demand computer science jobs",
        "emerging CS domains for students"
    ]
    search_results = "\n\n".join([web_search.invoke(q) for q in queries])

    prompt = get_breadth_prompt(search_results)
    print("Prompt being sent to breadth_llm")
    try:
        result = breadth_llm.invoke([SystemMessage(content=prompt)])
    except Exception as e:
        print("Error during breadth_llm.invoke:", e)
        raise

    try:
        options = json.loads(result.content)
    except json.JSONDecodeError:
        options = [{"title": "Parsing Error", "description": result.content[:200]}]

    return {
        **state,
        "career_options": options,
        "user_selection_pending": True,
        "messages": state["messages"] + [SystemMessage(content="Top career domains generated.")]
    }

def check_user_selection(state: GuidanceState) -> Annotated[str, "next_node"]:
    """Conditional function to check if user has made a selection"""
    print(f"🔍 Checking user selection. Selected domain: {state.get('selected_domain')}")
    print(f"🔍 User selection pending: {state.get('user_selection_pending')}")
    
    if state.get("selected_domain") and not state.get("user_selection_pending", True):
        print("✅ User selection found, proceeding to in-depth research...")
        return "in_depth_research"
    else:
        print("⏸️ Still waiting for user selection...")
        return "await_user_selection"

def await_user_selection_node(state: GuidanceState) -> GuidanceState:
    """This node will cause an interrupt, waiting for user input"""
    print("⏸️ Waiting for user selection...")
    return {
        **state,
        "user_selection_pending": True
    }

def in_depth_research_node(state: GuidanceState):
    print(f"🔬 In-depth search for: {state['selected_domain']}")

    domain = state["selected_domain"]
    queries = [
        f"What is {domain} and why is it important",
        f"{domain} required skills and tools",
        f"{domain} salary trends and job scope"
    ]
    web_data = "\n\n".join([web_search.invoke(q) for q in queries])

    prompt = get_in_depth_prompt(domain, web_data)
    print("Prompt being sent to depth_llm")
    try:
        result = depth_llm.invoke([SystemMessage(content=prompt)])
    except Exception as e:
        print("Error during depth_llm.invoke:", e)
        raise

    return {
        **state,
        "user_selection_pending": False,
        "roadmap_trigger_pending": True,
        "messages": state["messages"] + [SystemMessage(content=result.content)]
    }

def check_roadmap_trigger(state: GuidanceState):
    """Conditional function to check if user wants to generate roadmap"""
    print(f"🔍 Checking roadmap trigger. Pending: {state.get('roadmap_trigger_pending')}")
    
    if state.get("roadmap_trigger_pending", True):  # Default to True if not set
        print("⏸️ Still waiting for roadmap trigger...")
        return "await_roadmap_trigger"
    else:
        print("✅ Roadmap trigger activated, proceeding to roadmap generation...")
        return "roadmap_generator"

def await_roadmap_trigger_node(state: GuidanceState):
    """This node will cause an interrupt, waiting for user to trigger roadmap generation"""
    print("⏸️ Waiting for roadmap generation trigger...")
    return {
        **state,
        "roadmap_trigger_pending": True
    }

def roadmap_generator_node(state: GuidanceState):
    role = None  
    prompt = get_roadmap_prompt(state["selected_domain"], role)
    print("Prompt being sent to roadmap_llm")
    try:
        result = roadmap_llm.invoke([SystemMessage(content=prompt)])
    except Exception as e:
        print("Error during roadmap_llm.invoke:", e)
        raise
    return {
        **state,
        "roadmap_text": result.content,
        "roadmap_trigger_pending": False,
        "messages": state["messages"] + [SystemMessage(content="Roadmap generated.")]
    }

def mermaid_generator_node(state: GuidanceState):
    prompt = get_mermaid_prompt(state["roadmap_text"])
    print("Prompt being sent to code_llm")
    try:
        result = code_llm.invoke([SystemMessage(content=prompt)])
    except Exception as e:
        print("Error during code_llm.invoke:", e)
        raise
    return {
        **state,
        "roadmap_mermaid": result.content,
        "messages": state["messages"] + [SystemMessage(content="Mermaid chart generated.")]
    }

# --- LangGraph Workflow ---
def get_guidance_workflow():
    builder = StateGraph(GuidanceState)

    builder.add_node("breadth_research", breadth_researcher_node)
    builder.add_node("await_user_selection", await_user_selection_node)
    builder.add_node("in_depth_research", in_depth_research_node)
    builder.add_node("await_roadmap_trigger", await_roadmap_trigger_node)
    builder.add_node("roadmap_generator", roadmap_generator_node)
    builder.add_node("mermaid_generator", mermaid_generator_node)

    builder.set_entry_point("breadth_research")
    
    builder.add_edge("breadth_research", "await_user_selection")
    
    builder.add_conditional_edges(
        "await_user_selection",
        check_user_selection,
        {
            "await_user_selection": "await_user_selection", 
            "in_depth_research": "in_depth_research" 
        }
    )
    
    builder.add_edge("in_depth_research", "await_roadmap_trigger")
    builder.add_conditional_edges(
        "await_roadmap_trigger",
        check_roadmap_trigger,
        {
            "await_roadmap_trigger": "await_roadmap_trigger",
            "roadmap_generator": "roadmap_generator"
        }
    )
    builder.add_edge("roadmap_generator", "mermaid_generator")
    builder.add_edge("mermaid_generator", END)
    
    memory = MemorySaver()
    workflow = builder.compile(
        interrupt_before=["await_user_selection", "await_roadmap_trigger"],
        checkpointer=memory
    )
    
    print("Workflow compiled with interrupts at: await_user_selection, await_roadmap_trigger")
    return workflow