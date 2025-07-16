from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from workflow.graph import get_guidance_workflow  # your langgraph workflow builder

router = APIRouter()
graph = get_guidance_workflow()

# Global in-memory state for MVP (shared single user)
state = {
    "messages": [],
    "career_options": None,
    "selected_domain": None,
    "roadmap_text": None,
    "roadmap_mermaid": None,
    "user_selection_pending": True,
    "roadmap_trigger_pending": True
}
current_node = "breadth_research"

class ContinueInput(BaseModel):
    updates: Dict[str, Any]
    resume_node: str  # e.g., "await_user_selection"

@router.post("/guidance/start")
async def start_guidance():
    global state, current_node
    node, updated_state = graph.invoke(state)
    state = updated_state
    current_node = node
    return {
        "paused_at": node,
        "career_options": updated_state.get("career_options", [])
    }

@router.post("/guidance/continue")
async def continue_guidance(data: ContinueInput):
    global state, current_node
    # Apply frontend updates to state
    state.update(data.updates)

    node, updated_state = graph.invoke(state, node=data.resume_node)
    state = updated_state
    current_node = node

    response = {
        "paused_at": node,
        "state": {
            "selected_domain": updated_state.get("selected_domain"),
            "roadmap_text": updated_state.get("roadmap_text"),
            "roadmap_mermaid": updated_state.get("roadmap_mermaid"),
        }
    }

    if node == "await_roadmap_trigger":
        response["in_depth_info"] = updated_state["messages"][-1].content
    elif node == "mermaid_generator":
        response["message"] = "Workflow complete."

    return response

@router.post("/guidance/reset")
async def reset_guidance():
    global state, current_node
    state = {
        "messages": [],
        "career_options": None,
        "selected_domain": None,
        "roadmap_text": None,
        "roadmap_mermaid": None,
        "user_selection_pending": True,
        "roadmap_trigger_pending": True
    }
    current_node = "breadth_research"
    return {"message": "Guidance session reset."}
