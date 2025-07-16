"""
User Repository

MongoDB operations for user management in the AI Mock Interview Platform.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection
from pymongo.errors import DuplicateKeyError
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging

from ..models import UserDocument
from ..config import get_database

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for user operations in MongoDB"""

    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection: AsyncIOMotorCollection = database.users

    async def create_indexes(self):
        """Create database indexes for optimal performance"""
        try:
            # Create unique index on email
            await self.collection.create_index("email", unique=True)
            # Create index on user_id for fast lookups
            await self.collection.create_index("user_id", unique=True)
            logger.info("User collection indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating user indexes: {e}")

    async def create_user(self, user_data: Dict[str, Any]) -> UserDocument:
        """Create a new user"""
        try:
            user_doc = UserDocument(**user_data)

            # Convert to dict and handle ObjectId
            # Don't exclude_unset because we need the default user_id
            doc_dict = user_doc.model_dump(by_alias=True)

            # Remove the id field if it's None (MongoDB will generate _id)
            if doc_dict.get('_id') is None:
                doc_dict.pop('_id', None)

            # Insert into MongoDB
            result = await self.collection.insert_one(doc_dict)

            # Return the created user with the assigned ID
            user_doc.id = str(result.inserted_id)

            logger.info(f"Created user: {user_doc.user_id}")
            return user_doc

        except DuplicateKeyError as e:
            # Parse the error to determine which field caused the duplicate
            error_msg = str(e)
            if 'email' in error_msg:
                raise ValueError(
                    f"User with email {user_data.get('email')} already exists")
            elif 'user_id' in error_msg:
                raise ValueError(
                    f"User ID conflict occurred. Please try again.")
            else:
                raise ValueError(
                    f"User with email {user_data.get('email')} already exists")
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise

    async def get_user_by_id(self, user_id: str) -> Optional[UserDocument]:
        """Get user by user_id"""
        try:
            user_data = await self.collection.find_one({"user_id": user_id})
            if user_data:
                # Convert ObjectId to string
                if "_id" in user_data:
                    user_data["_id"] = str(user_data["_id"])
                return UserDocument(**user_data)
            return None
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {e}")
            raise

    async def get_user_by_email(self, email: str) -> Optional[UserDocument]:
        """Get user by email"""
        try:
            user_data = await self.collection.find_one({"email": email})
            if user_data:
                # Convert ObjectId to string
                if "_id" in user_data:
                    user_data["_id"] = str(user_data["_id"])
                return UserDocument(**user_data)
            return None
        except Exception as e:
            logger.error(f"Error getting user by email {email}: {e}")
            raise

    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[UserDocument]:
        """Update user information"""
        try:
            # Add updated_at timestamp
            update_data["updated_at"] = datetime.utcnow()

            result = await self.collection.update_one(
                {"user_id": user_id},
                {"$set": update_data}
            )

            if result.modified_count > 0:
                return await self.get_user_by_id(user_id)
            return None

        except Exception as e:
            logger.error(f"Error updating user {user_id}: {e}")
            raise

    async def increment_interview_count(self, user_id: str) -> None:
        """Increment user's interview count"""
        try:
            await self.collection.update_one(
                {"user_id": user_id},
                {
                    "$inc": {"interview_count": 1},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            logger.info(f"Incremented interview count for user: {user_id}")
        except Exception as e:
            logger.error(
                f"Error incrementing interview count for user {user_id}: {e}")
            raise

    async def get_all_users(self, limit: int = 100, skip: int = 0) -> List[UserDocument]:
        """Get all users with pagination"""
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            users = []
            async for user_data in cursor:
                # Convert ObjectId to string
                if "_id" in user_data:
                    user_data["_id"] = str(user_data["_id"])
                users.append(UserDocument(**user_data))
            return users
        except Exception as e:
            logger.error(f"Error getting all users: {e}")
            raise

    async def delete_user(self, user_id: str) -> bool:
        """Delete user by user_id"""
        try:
            result = await self.collection.delete_one({"user_id": user_id})
            success = result.deleted_count > 0
            if success:
                logger.info(f"Deleted user: {user_id}")
            return success
        except Exception as e:
            logger.error(f"Error deleting user {user_id}: {e}")
            raise

# Dependency to get user repository


async def get_user_repository() -> UserRepository:
    """FastAPI dependency to get user repository instance"""
    database = await get_database()
    return UserRepository(database)
