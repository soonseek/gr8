"""
gr8 Backend API
Main entry point for the FastAPI application
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth
from app.api import admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    """
    # Startup
    print("Starting gr8 API...")
    yield
    # Shutdown
    print("Shutting down gr8 API...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="gr8 API",
    description="Decentralized Automated Trading Platform API",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)


@app.get("/", tags=["Root"])
async def root() -> dict[str, str]:
    """
    Root endpoint - health check

    Returns:
        dict: A greeting message
    """
    return {"message": "Hello gr8"}


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """
    Health check endpoint

    Returns:
        dict: API health status
    """
    return {"status": "healthy", "service": "gr8-api"}
