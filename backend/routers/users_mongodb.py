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
    college: Optional[str] = Field(
        default=None, description="College/University name")
    year: Optional[int] = Field(default=None, description="Academic year")
    preferences: Dict[str, Any] = Field(
        default_factory=dict, description="User preferences")


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


class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    year: Optional[int] = None
    preferences: Optional[Dict[str, Any]] = None

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
        raise HTTPException(
            status_code=500, detail=f"Failed to create user: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Failed to get user: {str(e)}")


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    request: UpdateUserRequest,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Update user information"""
    try:
        # Build update data
        update_data = {}
        if request.name is not None:
            update_data["name"] = request.name
        if request.college is not None:
            update_data["college"] = request.college
        if request.year is not None:
            update_data["year"] = request.year
        if request.preferences is not None:
            update_data["preferences"] = request.preferences

        if not update_data:
            raise HTTPException(
                status_code=400, detail="No update data provided")

        # Update user in database
        updated_user = await user_repo.update_user(user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"Updated user: {user_id}")

        return UserResponse(
            user_id=updated_user.user_id,
            name=updated_user.name,
            email=updated_user.email,
            college=updated_user.college,
            year=updated_user.year,
            created_at=updated_user.created_at.isoformat(),
            interview_count=updated_user.interview_count,
            preferences=updated_user.preferences
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update user: {str(e)}")


@router.get("/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_stats(user_id: str, user_repo: UserRepository = Depends(get_user_repository)):
    """Get user interview statistics"""
    try:
        user_doc = await user_repo.get_user_by_id(user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        # TODO: Calculate actual stats from interview sessions
        # For now, returning placeholder data
        total_interviews = user_doc.interview_count
        completed_interviews = user_doc.interview_count
        average_score = 75.0  # Placeholder
        favorite_topics = ["Arrays", "Strings", "Two Pointers"]  # Placeholder
        last_interview = None  # TODO: Get from interview sessions

        return UserStatsResponse(
            user_id=user_doc.user_id,
            name=user_doc.name,
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
        raise HTTPException(
            status_code=500, detail=f"Failed to get user stats: {str(e)}")


@router.get("", response_model=List[UserResponse])
async def list_users(
    limit: int = 100,
    skip: int = 0,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """List all users with pagination"""
    try:
        users = await user_repo.get_all_users(limit=limit, skip=skip)

        return [
            UserResponse(
                user_id=user.user_id,
                name=user.name,
                email=user.email,
                college=user.college,
                year=user.year,
                created_at=user.created_at.isoformat(),
                interview_count=user.interview_count,
                preferences=user.preferences
            )
            for user in users
        ]

    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to list users: {str(e)}")


@router.delete("/{user_id}")
async def delete_user(user_id: str, user_repo: UserRepository = Depends(get_user_repository)):
    """Delete a user"""
    try:
        success = await user_repo.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"Deleted user: {user_id}")
        return {"message": f"User {user_id} deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete user: {str(e)}")


@router.post("/{user_id}/increment-interviews")
async def increment_interview_count(user_id: str, user_repo: UserRepository = Depends(get_user_repository)):
    """Increment user's interview count (called by interview service)"""
    try:
        await user_repo.increment_interview_count(user_id)
        logger.info(f"Incremented interview count for user: {user_id}")
        return {"message": "Interview count incremented successfully"}

    except Exception as e:
        logger.error(
            f"Error incrementing interview count for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to increment interview count: {str(e)}")

# Health and utility endpoints


@router.get("/health/status")
async def user_service_health():
    """Health check for user service"""
    return {
        "service": "user-management",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "mongodb"
    }
