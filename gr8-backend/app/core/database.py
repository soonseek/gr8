"""
Database configuration - MongoDB
Uses Motor (async MongoDB driver)
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os

# MongoDB connection URL
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DATABASE_NAME = os.getenv('MONGO_DATABASE', 'gr8')

# Global MongoDB client and database
_client: Optional[AsyncIOMotorClient] = None
_database: Optional[AsyncIOMotorDatabase] = None


def get_mongodb_client() -> AsyncIOMotorClient:
    """
    Get MongoDB client instance (singleton)
    """
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URL)
    return _client


def get_database() -> AsyncIOMotorDatabase:
    """
    Get MongoDB database instance
    """
    global _database
    if _database is None:
        client = get_mongodb_client()
        _database = client[DATABASE_NAME]
    return _database


async def get_db() -> AsyncIOMotorDatabase:
    """
    Dependency function for FastAPI to get database
    
    Usage:
        @router.get("/users")
        async def get_users(db: AsyncIOMotorDatabase = Depends(get_db)):
            users = await db.users.find().to_list(100)
            return users
    """
    return get_database()


async def close_mongodb_connection():
    """
    Close MongoDB connection
    Call this on application shutdown
    """
    global _client
    if _client is not None:
        _client.close()
        _client = None


# Legacy compatibility: Keep Base for now (will be removed)
class Base:
    """Placeholder for SQLAlchemy Base - not used in MongoDB"""
    pass
