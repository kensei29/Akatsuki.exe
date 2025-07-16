"""
FastAPI Application for AI Mock Interview Platform

Main FastAPI application that serves the interview platform backend.
Integrates with AI agents through routers.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from database.repositories import UserRepository
from database import db_config
from routers.users import router as users_router
from routers.interviews import router as interviews_router
from routers.problem_sheets import router as problem_sheets_router
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn
import logging
from datetime import datetime
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables at the very beginning
load_dotenv(dotenv_path=os.path.join(
    os.path.dirname(__file__), '..', '.env'))


# Import routers

# Import database configuration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events"""
    # Startup
    logger.info("🚀 AI Mock Interview Platform API starting up...")

    # Initialize database connection
    try:
        await db_config.connect()

        # Create database indexes
        user_repo = UserRepository(db_config.get_database())
        await user_repo.create_indexes()

        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise

    yield

    # Shutdown
    logger.info("🛑 AI Mock Interview Platform API shutting down...")
    await db_config.disconnect()

# Create FastAPI app instance with lifespan
app = FastAPI(
    title="AI Mock Interview Platform API",
    description="Backend API for conducting AI-powered mock interviews",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://localhost:8080"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(interviews_router)
app.include_router(users_router)
app.include_router(problem_sheets_router, prefix="/api/v1")

# Basic response models


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    message: str


class ApiInfo(BaseModel):
    title: str
    description: str
    version: str
    endpoints: Dict[str, str]

# Basic endpoints for testing


@app.get("/", response_model=ApiInfo)
async def root():
    """Root endpoint providing API information"""
    return ApiInfo(
        title="AI Mock Interview Platform API",
        description="Backend API for conducting AI-powered mock interviews",
        version="1.0.0",
        endpoints={
            "/": "API information",
            "/health": "Health check",
            "/api/v1/interviews": "Interview management endpoints",
            "/api/v1/users": "User management endpoints",
            "/docs": "API documentation",
            "/redoc": "Alternative API documentation"
        }
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        message="AI Mock Interview Platform API is running successfully"
    )

# Error handlers


@app.exception_handler(404)
async def not_found_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "detail": str(exc)}
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    from fastapi.responses import JSONResponse
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error",
                 "detail": "Something went wrong"}
    )

if __name__ == "__main__":
    # Run the application with uvicorn
    logger.info("Starting FastAPI development server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
