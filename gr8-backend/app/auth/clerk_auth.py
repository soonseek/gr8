"""
Clerk Authentication Dependency

Validates Clerk JWT tokens and extracts user information
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredential
from typing import Dict, Any, Optional
import os
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import authenticate_request

# Initialize Clerk client
CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY')
if not CLERK_SECRET_KEY:
    print("Warning: CLERK_SECRET_KEY not set. Authentication will be disabled.")

clerk_client = Clerk(bearer_auth=CLERK_SECRET_KEY) if CLERK_SECRET_KEY else None

# HTTP Bearer security scheme
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthCredential] = Depends(security)
) -> Dict[str, Any]:
    """
    Extract and validate Clerk JWT token
    
    Returns user information from Clerk token
    Falls back to anonymous user if no token provided
    """
    # If no credentials, return anonymous user (for open endpoints)
    if not credentials or not clerk_client:
        return {
            'user_id': 'anonymous',
            'wallet_address': 'anonymous',
            'role': 'user',
            'is_authenticated': False,
        }

    token = credentials.credentials

    try:
        # Verify JWT token with Clerk
        request_state = authenticate_request(
            request={'headers': {'authorization': f'Bearer {token}'}},
            options={},
        )

        if not request_state.is_signed_in:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        # Extract user info from token claims
        claims = request_state.to_auth.claims
        
        return {
            'user_id': claims.get('sub'),
            'wallet_address': claims.get('public_metadata', {}).get('wallet_address', 'unknown'),
            'role': claims.get('public_metadata', {}).get('role', 'user'),
            'email': claims.get('email'),
            'is_authenticated': True,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


async def require_auth(
    user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Require authenticated user
    Raises 401 if not authenticated
    """
    if not user.get('is_authenticated'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user


async def require_admin(
    user: Dict[str, Any] = Depends(require_auth)
) -> Dict[str, Any]:
    """
    Require admin user
    Raises 403 if not admin
    """
    if user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
