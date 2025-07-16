"""
Interview Session Router

FastAPI router for managing interview sessions.
Integrates with the AI Mock Interview Orchestrator.

Author: AI Mock Interview Platform Team  
Date: July 2025
"""

from app.placement_prep.core.problem_database import ProblemDifficulty, ProblemCategory
from app.placement_prep.workflows.interview_orchestrator import (
    create_interview_orchestrator,
    MainInterviewOrchestrator,
    InterviewSessionConfig,
    InterviewType,
    OrchestratorResponse
)
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import sys
import os

# Add the project root to the Python path to access the app module
project_root = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/interviews", tags=["interviews"])

# Global orchestrator instance (will be properly managed later)
_orchestrator: Optional[MainInterviewOrchestrator] = None


async def get_orchestrator() -> MainInterviewOrchestrator:
    """Dependency to get the interview orchestrator instance"""
    global _orchestrator
    if _orchestrator is None:
        logger.info("Initializing Interview Orchestrator...")
        _orchestrator = create_interview_orchestrator()
        logger.info("Interview Orchestrator initialized successfully")
    return _orchestrator

# Request/Response models


class CreateSessionRequest(BaseModel):
    interview_type: str = Field(
        default="dsa_only", description="Type of interview")
    duration_minutes: int = Field(
        default=30, ge=15, le=120, description="Interview duration in minutes")
    difficulty_levels: List[str] = Field(
        default=["easy", "medium"], description="Difficulty levels to include")
    user_id: Optional[str] = Field(
        default=None, description="Optional user ID")
    user_preferences: Dict[str, Any] = Field(
        default_factory=dict, description="User preferences")


class SessionResponse(BaseModel):
    session_id: str
    status: str
    message: str
    current_phase: str
    suggested_actions: List[str]
    created_at: str


class MessageRequest(BaseModel):
    message: str = Field(..., description="User message to process")


class MessageResponse(BaseModel):
    session_id: str
    ai_message: str
    current_phase: str
    suggested_actions: List[str]
    is_session_complete: bool
    timestamp: str

# Helper functions


def _map_difficulty_levels(difficulty_strings: List[str]) -> List[ProblemDifficulty]:
    """Map string difficulty levels to enum values"""
    mapping = {
        "easy": ProblemDifficulty.EASY,
        "medium": ProblemDifficulty.MEDIUM,
        "hard": ProblemDifficulty.HARD
    }
    return [mapping.get(d.lower(), ProblemDifficulty.MEDIUM) for d in difficulty_strings]


def _map_interview_type(type_string: str) -> InterviewType:
    """Map string interview type to enum value"""
    mapping = {
        "dsa_only": InterviewType.DSA_ONLY,
        "behavioral_only": InterviewType.BEHAVIORAL_ONLY,
        "system_design_only": InterviewType.SYSTEM_DESIGN_ONLY,
        "mixed_dsa_behavioral": InterviewType.MIXED_DSA_BEHAVIORAL,
        "full_technical": InterviewType.FULL_TECHNICAL
    }
    return mapping.get(type_string.lower(), InterviewType.DSA_ONLY)

# Interview session endpoints


@router.post("/create", response_model=SessionResponse)
async def create_interview_session(
    request: CreateSessionRequest,
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """Create a new interview session"""
    try:
        logger.info(
            f"Creating new interview session with type: {request.interview_type}")

        # Create session configuration
        config = InterviewSessionConfig(
            interview_type=_map_interview_type(request.interview_type),
            duration_minutes=request.duration_minutes,
            difficulty_range=_map_difficulty_levels(request.difficulty_levels),
            user_id=request.user_id,
            user_preferences=request.user_preferences
        )

        # Create session through orchestrator
        response = await orchestrator.create_session(config)

        logger.info(
            f"Interview session created successfully: {response.session_id}")

        return SessionResponse(
            session_id=response.session_id,
            status="created",
            message=response.message,
            current_phase=response.current_phase,
            suggested_actions=response.suggested_actions,
            created_at=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Error creating interview session: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create interview session: {str(e)}")


@router.post("/{session_id}/start", response_model=MessageResponse)
async def start_interview_session(
    session_id: str,
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """Start an interview session"""
    try:
        logger.info(f"Starting interview session: {session_id}")

        # Start interview through orchestrator
        response = await orchestrator.start_interview(session_id)

        logger.info(f"Interview session started successfully: {session_id}")

        return MessageResponse(
            session_id=session_id,
            ai_message=response.message,
            current_phase=response.current_phase,
            suggested_actions=response.suggested_actions,
            is_session_complete=response.is_session_complete,
            timestamp=datetime.now().isoformat()
        )

    except ValueError as e:
        logger.warning(f"Session not found: {session_id}")
        raise HTTPException(
            status_code=404, detail=f"Session not found: {session_id}")
    except Exception as e:
        logger.error(
            f"Error starting interview session {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to start interview session: {str(e)}")


@router.post("/{session_id}/message", response_model=MessageResponse)
async def process_message(
    session_id: str,
    request: MessageRequest,
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """Process a user message in an interview session"""
    try:
        logger.info(
            f"Processing message for session {session_id}: {request.message[:50]}...")

        # Process message through orchestrator
        response = await orchestrator.process_message(session_id, request.message)

        logger.info(
            f"Message processed successfully for session: {session_id}")

        return MessageResponse(
            session_id=session_id,
            ai_message=response.message,
            current_phase=response.current_phase,
            suggested_actions=response.suggested_actions,
            is_session_complete=response.is_session_complete,
            timestamp=datetime.now().isoformat()
        )

    except ValueError as e:
        logger.warning(f"Session not found: {session_id}")
        raise HTTPException(
            status_code=404, detail=f"Session not found: {session_id}")
    except Exception as e:
        logger.error(
            f"Error processing message for session {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process message: {str(e)}")


@router.get("/{session_id}/status")
async def get_session_status(
    session_id: str,
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """Get the current status of an interview session"""
    try:
        logger.info(f"Getting status for session: {session_id}")

        # Get session status through orchestrator
        session_state = await orchestrator.get_session_status(session_id)

        return {
            "session_id": session_id,
            "status": session_state.status.value,
            "current_agent": session_state.current_agent,
            "problems_completed": session_state.problems_completed,
            "total_score": session_state.total_score,
            "start_time": session_state.start_time.isoformat(),
            "end_time": session_state.end_time.isoformat() if session_state.end_time else None,
            "config": {
                "interview_type": session_state.config.interview_type.value,
                "duration_minutes": session_state.config.duration_minutes,
                "max_problems": session_state.config.max_problems
            }
        }

    except ValueError as e:
        logger.warning(f"Session not found: {session_id}")
        raise HTTPException(
            status_code=404, detail=f"Session not found: {session_id}")
    except Exception as e:
        logger.error(f"Error getting session status {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to get session status: {str(e)}")


@router.post("/{session_id}/end", response_model=MessageResponse)
async def end_interview_session(
    session_id: str,
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """End an interview session"""
    try:
        logger.info(f"Ending interview session: {session_id}")

        # End session through orchestrator
        response = await orchestrator.end_session(session_id)

        logger.info(f"Interview session ended successfully: {session_id}")

        return MessageResponse(
            session_id=session_id,
            ai_message=response.message,
            current_phase=response.current_phase,
            suggested_actions=response.suggested_actions,
            is_session_complete=True,
            timestamp=datetime.now().isoformat()
        )

    except ValueError as e:
        logger.warning(f"Session not found: {session_id}")
        raise HTTPException(
            status_code=404, detail=f"Session not found: {session_id}")
    except Exception as e:
        logger.error(f"Error ending interview session {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to end interview session: {str(e)}")

# Health check for the interview system


@router.get("/health")
async def interview_system_health(
    orchestrator: MainInterviewOrchestrator = Depends(get_orchestrator)
):
    """Health check for the interview system"""
    try:
        # Check if orchestrator is working
        active_sessions_count = len(orchestrator.active_sessions)

        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "orchestrator_status": "operational",
            "active_sessions": active_sessions_count,
            "message": "Interview system is running successfully"
        }

    except Exception as e:
        logger.error(f"Interview system health check failed: {str(e)}")
        raise HTTPException(
            status_code=503, detail=f"Interview system unhealthy: {str(e)}")
