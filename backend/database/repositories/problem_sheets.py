"""
Problem Sheets Repository

Handles database operations for LeetCode and CodeForces problem sheets,
including tracking user progress on individual problems.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from typing import List, Dict, Optional, Any
from pymongo.collection import Collection
from pymongo import MongoClient
from bson import ObjectId
import logging
from datetime import datetime
import os

logger = logging.getLogger(__name__)


class ProblemSheetsRepository:
    """Repository for managing problem sheets and user progress"""

    def __init__(self, db_url: Optional[str] = None):
        """Initialize the repository with database connection"""
        self.db_url = db_url or os.getenv("MONGODB_URL")
        if not self.db_url:
            raise ValueError("MongoDB URL not provided")

        self.client = MongoClient(self.db_url)

        # Connect to DSA_Problems database for problem data
        self.problems_db = self.client["DSA_Problems"]
        self.leetcode_collection = self.problems_db["Leetcode"]
        self.codeforces_collection = self.problems_db["Codeforces"]

        # Connect to main database for user progress tracking
        self.main_db = self.client["ai_mock_interview"]
        self.user_progress_collection = self.main_db["user_problem_progress"]

        logger.info("🗄️ Problem sheets repository initialized")

    async def get_leetcode_problems(self, page: int = 1, limit: int = 50) -> Dict[str, Any]:
        """Get LeetCode problems with pagination"""
        try:
            skip = (page - 1) * limit

            # Get total count
            total_count = self.leetcode_collection.count_documents({})

            # Get paginated problems
            problems_cursor = self.leetcode_collection.find(
                {}).skip(skip).limit(limit)
            problems = []

            for problem in problems_cursor:
                # Convert ObjectId to string for JSON serialization
                problem["_id"] = str(problem["_id"])
                problems.append(problem)

            total_pages = (total_count + limit - 1) // limit

            logger.info(
                f"📚 Retrieved {len(problems)} LeetCode problems (page {page}/{total_pages})")

            return {
                "problems": problems,
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_count": total_count,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }

        except Exception as e:
            logger.error(f"❌ Error fetching LeetCode problems: {e}")
            raise e

    async def get_codeforces_problems(self, page: int = 1, limit: int = 50) -> Dict[str, Any]:
        """Get CodeForces problems with pagination"""
        try:
            skip = (page - 1) * limit

            # Get total count
            total_count = self.codeforces_collection.count_documents({})

            # Get paginated problems
            problems_cursor = self.codeforces_collection.find(
                {}).skip(skip).limit(limit)
            problems = []

            for problem in problems_cursor:
                # Convert ObjectId to string for JSON serialization
                problem["_id"] = str(problem["_id"])

                # Generate CodeForces URL
                contest_id = problem.get("contestId")
                index = problem.get("index")
                if contest_id and index:
                    problem["url"] = f"https://codeforces.com/problemset/problem/{contest_id}/{index}"

                problems.append(problem)

            total_pages = (total_count + limit - 1) // limit

            logger.info(
                f"📚 Retrieved {len(problems)} CodeForces problems (page {page}/{total_pages})")

            return {
                "problems": problems,
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_count": total_count,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }

        except Exception as e:
            logger.error(f"❌ Error fetching CodeForces problems: {e}")
            raise e

    async def get_user_progress(self, user_id: str, platform: str) -> Dict[str, bool]:
        """Get user's problem completion progress for a platform"""
        try:
            progress_doc = self.user_progress_collection.find_one({
                "user_id": user_id,
                "platform": platform.lower()
            })

            if progress_doc:
                logger.info(
                    f"✅ Retrieved {platform} progress for user {user_id}")
                return progress_doc.get("completed_problems", {})
            else:
                logger.info(
                    f"📝 No {platform} progress found for user {user_id}")
                return {}

        except Exception as e:
            logger.error(f"❌ Error fetching user progress: {e}")
            raise e

    async def update_problem_status(self, user_id: str, platform: str, problem_id: str, completed: bool) -> bool:
        """Update completion status of a problem for a user"""
        try:
            # Upsert user progress document
            filter_query = {"user_id": user_id, "platform": platform.lower()}

            if completed:
                update_query = {
                    "$set": {
                        f"completed_problems.{problem_id}": True,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "user_id": user_id,
                        "platform": platform.lower(),
                        "created_at": datetime.utcnow()
                    }
                }
            else:
                update_query = {
                    "$unset": {f"completed_problems.{problem_id}": ""},
                    "$set": {"updated_at": datetime.utcnow()}
                }

            result = self.user_progress_collection.update_one(
                filter_query,
                update_query,
                upsert=True
            )

            action = "marked as completed" if completed else "marked as incomplete"
            logger.info(
                f"✅ Problem {problem_id} {action} for user {user_id} on {platform}")

            return True

        except Exception as e:
            logger.error(f"❌ Error updating problem status: {e}")
            raise e

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get user's overall problem-solving statistics"""
        try:
            stats = {}

            for platform in ["leetcode", "codeforces"]:
                progress = await self.get_user_progress(user_id, platform)
                completed_count = len([p for p in progress.values() if p])

                # Get total problems count
                if platform == "leetcode":
                    total_count = self.leetcode_collection.count_documents({})
                else:
                    total_count = self.codeforces_collection.count_documents({
                    })

                stats[platform] = {
                    "completed": completed_count,
                    "total": total_count,
                    "percentage": round((completed_count / total_count * 100), 2) if total_count > 0 else 0
                }

            logger.info(f"📊 Retrieved stats for user {user_id}")
            return stats

        except Exception as e:
            logger.error(f"❌ Error fetching user stats: {e}")
            raise e

    async def search_problems(self, platform: str, query: str, difficulty: Optional[str] = None, page: int = 1, limit: int = 50) -> Dict[str, Any]:
        """Search problems by name, tags, or difficulty"""
        try:
            collection = self.leetcode_collection if platform.lower(
            ) == "leetcode" else self.codeforces_collection

            # Build search filter
            search_filter = {}

            if query:
                search_filter["$or"] = [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"tags": {"$regex": query, "$options": "i"}} if platform.lower(
                    ) == "codeforces" else {"main_tag": {"$regex": query, "$options": "i"}}
                ]

            if difficulty and platform.lower() == "leetcode":
                search_filter["difficulty"] = {
                    "$regex": difficulty, "$options": "i"}

            skip = (page - 1) * limit

            # Get total count with filter
            total_count = collection.count_documents(search_filter)

            # Get filtered problems
            problems_cursor = collection.find(
                search_filter).skip(skip).limit(limit)
            problems = []

            for problem in problems_cursor:
                problem["_id"] = str(problem["_id"])

                # Add URL for CodeForces
                if platform.lower() == "codeforces":
                    contest_id = problem.get("contestId")
                    index = problem.get("index")
                    if contest_id and index:
                        problem["url"] = f"https://codeforces.com/problemset/problem/{contest_id}/{index}"

                problems.append(problem)

            total_pages = (total_count + limit - 1) // limit

            logger.info(
                f"🔍 Found {len(problems)} {platform} problems matching '{query}'")

            return {
                "problems": problems,
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_count": total_count,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }

        except Exception as e:
            logger.error(f"❌ Error searching {platform} problems: {e}")
            raise e
