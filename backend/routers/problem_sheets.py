"""
Problem Sheets API Routes

API endpoints for managing LeetCode and CodeForces problem sheets,
including user progress tracking and search functionality.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
import logging

from database.repositories.problem_sheets import ProblemSheetsRepository
from auth import get_current_user_token, TokenData

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/problem-sheets", tags=["Problem Sheets"])

# Pydantic models for request/response


class ProblemStatusUpdate(BaseModel):
    problem_id: str = Field(..., description="ID of the problem")
    completed: bool = Field(...,
                            description="Whether the problem is completed")


class ProblemSearchQuery(BaseModel):
    query: Optional[str] = Field(
        None, description="Search query for problem name or tags")
    difficulty: Optional[str] = Field(
        None, description="Filter by difficulty (LeetCode only)")
    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(50, ge=1, le=100, description="Items per page")


# Initialize repository
problem_sheets_repo = ProblemSheetsRepository()


@router.get("/leetcode")
async def get_leetcode_problems(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    current_user: TokenData = Depends(get_current_user_token)
):
    """
    Get LeetCode problems with pagination

    🔍 Returns paginated list of LeetCode problems with metadata
    """
    try:
        logger.info(
            f"📚 User {current_user.user_id} requesting LeetCode problems (page {page})")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        result = await problem_sheets_repo.get_leetcode_problems(page=page, limit=limit)

        logger.info(
            f"✅ Successfully retrieved LeetCode problems for user {current_user.user_id}")
        return {
            "success": True,
            "data": result,
            "message": f"Retrieved {len(result['problems'])} LeetCode problems"
        }

    except Exception as e:
        logger.error(
            f"❌ Error fetching LeetCode problems for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch LeetCode problems: {str(e)}")


@router.get("/codeforces")
async def get_codeforces_problems(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    current_user: TokenData = Depends(get_current_user_token)
):
    """
    Get CodeForces problems with pagination

    🔍 Returns paginated list of CodeForces problems with metadata
    """
    try:
        logger.info(
            f"📚 User {current_user.user_id} requesting CodeForces problems (page {page})")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        result = await problem_sheets_repo.get_codeforces_problems(page=page, limit=limit)

        logger.info(
            f"✅ Successfully retrieved CodeForces problems for user {current_user.user_id}")
        return {
            "success": True,
            "data": result,
            "message": f"Retrieved {len(result['problems'])} CodeForces problems"
        }

    except Exception as e:
        logger.error(
            f"❌ Error fetching CodeForces problems for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch CodeForces problems: {str(e)}")


@router.get("/progress/{platform}")
async def get_user_progress(
    platform: str,
    current_user: TokenData = Depends(get_current_user_token)
):
    """
    Get user's problem completion progress for a specific platform

    📊 Returns user's completed problems for LeetCode or CodeForces
    """
    try:
        if platform.lower() not in ["leetcode", "codeforces"]:
            raise HTTPException(
                status_code=400, detail="Platform must be 'leetcode' or 'codeforces'")

        logger.info(
            f"📊 User {current_user.user_id} requesting {platform} progress")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        progress = await problem_sheets_repo.get_user_progress(current_user.user_id, platform)

        logger.info(
            f"✅ Retrieved {platform} progress for user {current_user.user_id}")
        return {
            "success": True,
            "data": progress,
            "message": f"Retrieved {platform} progress for user"
        }

    except Exception as e:
        logger.error(
            f"❌ Error fetching progress for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch progress: {str(e)}")


@router.put("/progress/{platform}")
async def update_problem_status(
    platform: str,
    status_update: ProblemStatusUpdate,
    current_user: TokenData = Depends(get_current_user_token)
):
    """
    Update completion status of a problem for the current user

    ✅ Mark a problem as completed or incomplete
    """
    try:
        if platform.lower() not in ["leetcode", "codeforces"]:
            raise HTTPException(
                status_code=400, detail="Platform must be 'leetcode' or 'codeforces'")

        logger.info(
            f"📝 User {current_user.user_id} updating {platform} problem {status_update.problem_id}")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        success = await problem_sheets_repo.update_problem_status(
            user_id=current_user.user_id,
            platform=platform,
            problem_id=status_update.problem_id,
            completed=status_update.completed
        )

        if success:
            action = "completed" if status_update.completed else "unmarked"
            logger.info(
                f"✅ Problem {status_update.problem_id} {action} for user {current_user.user_id}")
            return {
                "success": True,
                "message": f"Problem {action} successfully"
            }
        else:
            raise HTTPException(
                status_code=500, detail="Failed to update problem status")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"❌ Error updating problem status for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update problem status: {str(e)}")


@router.get("/stats")
async def get_user_stats(current_user: TokenData = Depends(get_current_user_token)):
    """
    Get user's overall problem-solving statistics

    📈 Returns completion stats for both LeetCode and CodeForces
    """
    try:
        logger.info(f"📈 User {current_user.user_id} requesting problem stats")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        stats = await problem_sheets_repo.get_user_stats(current_user.user_id)

        logger.info(f"✅ Retrieved stats for user {current_user.user_id}")
        return {
            "success": True,
            "data": stats,
            "message": "Retrieved user statistics successfully"
        }

    except Exception as e:
        logger.error(
            f"❌ Error fetching stats for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch statistics: {str(e)}")


@router.get("/search/{platform}")
async def search_problems(
    platform: str,
    query: Optional[str] = Query(None, description="Search query"),
    difficulty: Optional[str] = Query(
        None, description="Filter by difficulty"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    current_user: TokenData = Depends(get_current_user_token)
):
    """
    Search problems by name, tags, or difficulty

    🔍 Advanced search functionality for problems
    """
    try:
        if platform.lower() not in ["leetcode", "codeforces"]:
            raise HTTPException(
                status_code=400, detail="Platform must be 'leetcode' or 'codeforces'")

        logger.info(
            f"🔍 User {current_user.user_id} searching {platform} problems: '{query}'")

        if not current_user.user_id:
            raise HTTPException(
                status_code=401, detail="Invalid user authentication")

        result = await problem_sheets_repo.search_problems(
            platform=platform,
            query=query or "",
            difficulty=difficulty,
            page=page,
            limit=limit
        )

        logger.info(f"✅ Search completed for user {current_user.user_id}")
        return {
            "success": True,
            "data": result,
            "message": f"Found {len(result['problems'])} matching problems"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"❌ Error searching problems for user {current_user.user_id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to search problems: {str(e)}")
