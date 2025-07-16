"""
Database Configuration

MongoDB connection and configuration for the AI Mock Interview Platform.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure
import logging
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from the project root
load_dotenv(dotenv_path=os.path.join(
    os.path.dirname(__file__),  '..', '..', '.env'))

logger = logging.getLogger(__name__)


class DatabaseConfig:
    """Database configuration and connection management"""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.database: Optional[AsyncIOMotorDatabase] = None
        self.connection_url = os.getenv("MONGODB_URL")
        self.database_name = "ai_mock_interview"

        if not self.connection_url:
            raise ValueError("MONGODB_URL environment variable is required")

    async def connect(self) -> None:
        """Establish connection to MongoDB"""
        try:
            logger.info("Connecting to MongoDB...")
            self.client = AsyncIOMotorClient(self.connection_url)

            # Test the connection
            if self.client:
                await self.client.admin.command('ping')
                self.database = self.client[self.database_name]
                logger.info(
                    f"Successfully connected to MongoDB database: {self.database_name}")

        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error connecting to MongoDB: {e}")
            raise

    async def disconnect(self) -> None:
        """Close MongoDB connection"""
        if self.client:
            logger.info("Disconnecting from MongoDB...")
            self.client.close()
            logger.info("MongoDB connection closed")

    def get_database(self) -> AsyncIOMotorDatabase:
        """Get the database instance"""
        if self.database is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.database


# Global database instance
db_config = DatabaseConfig()


async def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to get database instance"""
    return db_config.get_database()
