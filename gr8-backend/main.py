"""
gr8 Backend API
Main entry point for the FastAPI application
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, market_data
from app.api import admin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    """
    # Startup: Initialize scheduler
    from app.core.scheduler import lifespan as scheduler_lifespan

    print("Starting gr8 API...")

    # Start scheduler lifespan
    async with scheduler_lifespan():
        yield

    # Shutdown is handled by scheduler_lifespan
    print("Shutting down gr8 API...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="gr8 API",
    description="""# Decentralized Automated Trading Platform API

## 🔐 Authentication

This API uses JWT Bearer token authentication.

### How to Authenticate in Swagger:

1. **Get JWT Token:**
   - Login via frontend: http://localhost:5173
   - Open Web3 Debug panel (🐛 icon top-right)
   - Copy "Bearer Token" value

2. **Authorize in Swagger:**
   - Click 🔒 **Authorize** button (top-right)
   - Paste token (with or without "Bearer " prefix)
   - Click **Authorize**
   - Click **Close**

3. **Test Endpoints:**
   - Look for 🔒 icon (requires auth)
   - Token auto-included in requests

### Direct Header Alternative:

If Swagger auth doesn't work, manually add header:
- Header name: `Authorization`
- Value: `Bearer <your_token>`

## 📚 API Endpoints

- **Market Data**: Historical OHLCV from crypto exchanges
- **Authentication**: Web3 wallet-based login
- **Admin**: User management (admin only)
""",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc UI
    swagger_ui_parameters={
        "persistAuthorization": True,  # Keep auth on refresh
        "displayRequestDuration": True,  # Show timing
        "docExpansion": "list",  # Expand by default
        "filter": True,  # Enable search
        "syntaxHighlight": True,  # Code highlighting
    },
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
app.include_router(market_data.router)


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
