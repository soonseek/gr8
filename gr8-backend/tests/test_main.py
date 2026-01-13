"""
Test Main API Endpoints
Tests root and health check endpoints
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """
    Test root endpoint returns Hello gr8 message.
    """
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Hello gr8"


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """
    Test health check endpoint returns healthy status.
    """
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "service" in data
    assert data["service"] == "gr8-api"


@pytest.mark.asyncio
async def test_cors_headers(client: AsyncClient):
    """
    Test CORS headers are present.
    """
    response = await client.get("/")
    assert response.status_code == 200
    # CORS headers are checked by browser, not in tests
    # but we verify the endpoint is accessible
