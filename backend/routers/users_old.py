"""
User Management Router

MongoDB-based user management endpoints for the AI Mock Interview Platform.
Provides user operations for interview tracking with persistent storage.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import uuid

# Import database dependencies
from database.repositories import UserRepository, get_user_repository
from database.models import UserDocument

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/users", tags=["users"])

# Request/Response models
class CreateUserRequest(BaseModel):
    name: str = Field(..., description="User's full name")
    email: str = Field(..., description="User's email address")
    college: Optional[str] = Field(default=None, description="College/University name")
    year: Optional[int] = Field(default=None, description="Academic year")
    preferences: Dict[str, Any] = Field(default_factory=dict, description="User preferences")

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    college: Optional[str]
    year: Optional[int]
    created_at: str
    interview_count: int
    preferences: Dict[str, Any]

class UserStatsResponse(BaseModel):
    user_id: str
    name: str
    total_interviews: int
    completed_interviews: int
    average_score: float
    favorite_topics: List[str]
    last_interview: Optional[str]

# User management endpoints
@router.post("/create", response_model=UserResponse)
async def create_user(request: CreateUserRequest, user_repo: UserRepository = Depends(get_user_repository)):
    """Create a new user in MongoDB"""
    try:
        # Check if email already exists
        existing_user = await user_repo.get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Create user data
        user_data = {
            "name": request.name,
            "email": request.email,
            "college": request.college,
            "year": request.year,
            "preferences": request.preferences
        }
        
        # Create user in database
        user_doc = await user_repo.create_user(user_data)
        
        logger.info(f"Created new user: {user_doc.user_id} ({request.email})")
        
        return UserResponse(
            user_id=user_doc.user_id,
            name=user_doc.name,
            email=user_doc.email,
            college=user_doc.college,
            year=user_doc.year,
            created_at=user_doc.created_at.isoformat(),
            interview_count=user_doc.interview_count,
            preferences=user_doc.preferences
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, user_repo: UserRepository = Depends(get_user_repository)):
    """Get user information from MongoDB"""
    try:
        user_doc = await user_repo.get_user_by_id(user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            user_id=user_doc.user_id,
            name=user_doc.name,
            email=user_doc.email,
            college=user_doc.college,
            year=user_doc.year,
            created_at=user_doc.created_at.isoformat(),
            interview_count=user_doc.interview_count,
            preferences=user_doc.preferences
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get user: {str(e)}")

@router.get("/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_stats(user_id: str):
    """Get user interview statistics"""
    try:
        if user_id not in _users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = _users[user_id]
        interviews = user_data.get("interviews", [])
        
        # Calculate stats (simplified for now)
        total_interviews = len(interviews)
        completed_interviews = total_interviews  # Simplified
        average_score = 75.0  # Placeholder
        favorite_topics = ["Arrays", "Strings", "Two Pointers"]  # Placeholder
        last_interview = interviews[-1] if interviews else None
        
        return UserStatsResponse(
            user_id=user_id,
            name=user_data["name"],
            total_interviews=total_interviews,
            completed_interviews=completed_interviews,
            average_score=average_score,
            favorite_topics=favorite_topics,
            last_interview=last_interview
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user stats {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get user stats: {str(e)}")

@router.post("/{user_id}/interviews/{session_id}")
async def add_interview_to_user(user_id: str, session_id: str):
    """Add an interview session to a user's history"""
    try:
        if user_id not in _users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = _users[user_id]
        
        # Add interview to user's history
        if session_id not in user_data["interviews"]:
            user_data["interviews"].append(session_id)
            user_data["interview_count"] = len(user_data["interviews"])
        
        logger.info(f"Added interview {session_id} to user {user_id}")
        
        return {"message": "Interview added to user history", "interview_count": user_data["interview_count"]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding interview to user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add interview: {str(e)}")

@router.get("/")
async def list_users():
    """List all users (for development/testing)"""
    try:
        users_list = []
        for user_id, user_data in _users.items():
            users_list.append({
                "user_id": user_id,
                "name": user_data["name"],
                "email": user_data["email"],
                "interview_count": user_data["interview_count"],
                "created_at": user_data["created_at"]
            })
        
        return {
            "total_users": len(users_list),
            "users": users_list
        }
        
    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to list users: {str(e)}")

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete a user (for development/testing)"""
    try:
        if user_id not in _users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_name = _users[user_id]["name"]
        del _users[user_id]
        
        logger.info(f"Deleted user: {user_id} ({user_name})")
        
        return {"message": f"User {user_name} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

# Health check for user system
@router.get("/system/health")
async def user_system_health():
    """Health check for the user management system"""
    try:
        total_users = len(_users)
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "total_users": total_users,
            "message": "User management system is running successfully"
        }
        
    except Exception as e:
        logger.error(f"User system health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail=f"User system unhealthy: {str(e)}")
