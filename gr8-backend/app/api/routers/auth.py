"""Authentication router for Web3 wallet-based login."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.auth.jwt import create_access_token, verify_token, decode_jwt
from app.auth.web3_auth import verify_web3_signature
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# HTTP Bearer security scheme for Swagger UI
security = HTTPBearer(auto_error=False)


class LoginRequest(BaseModel):
    """Web3 login request schema."""

    wallet_address: str = Field(..., description="Web3 wallet address (0x...)")
    signature: str = Field(..., description="Blockchain signature from wallet")
    message: str = Field(
        default="Sign this message to authenticate with gr8 platform",
        description="Message that was signed"
    )


class LoginResponse(BaseModel):
    """Login response schema."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    wallet_address: str = Field(..., description="Authenticated wallet address")
    role: str = Field(..., description="User role (user/admin)")
    is_first_user: bool = Field(default=False, description="Whether this is the first user (auto-admin)")


class UserResponse(BaseModel):
    """Current user response schema."""

    wallet_address: str = Field(..., description="User's wallet address")
    role: str = Field(..., description="User role (user/admin)")


class RefreshTokenRequest(BaseModel):
    """Token refresh request schema."""

    token: str = Field(..., description="Current JWT token to refresh")


class RefreshTokenResponse(BaseModel):
    """Token refresh response schema."""

    access_token: str = Field(..., description="New JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Web3 wallet login with signature verification.

    Verifies the blockchain signature and returns a JWT token.

    Args:
        request: Login request with wallet_address, signature, and message
        db: Database session

    Returns:
        LoginResponse: JWT token and wallet address

    Raises:
        HTTPException 401: If signature verification fails
    """
    # Log login attempt
    logger.info(f"Login attempt from wallet: {request.wallet_address}")

    # Verify Web3 signature
    is_valid = verify_web3_signature(
        message=request.message,
        signature=request.signature,
        address=request.wallet_address
    )

    if not is_valid:
        logger.warning(
            f"Signature verification failed for wallet: {request.wallet_address}\n"
            f"Message: {request.message}\n"
            f"Signature: {request.signature[:10]}..."
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature or wallet address"
        )

    logger.info(f"Signature verified successfully for wallet: {request.wallet_address}")

    # Check if user exists, create if not
    from sqlalchemy import select, func

    normalized_address = request.wallet_address.lower()

    result = await db.execute(
        select(User).where(User.wallet_address == normalized_address)
    )
    user = result.scalar_one_or_none()

    is_first_user = False

    if not user:
        # Use a nested transaction to prevent race condition
        # This ensures atomic check-and-create operation
        from sqlalchemy import text

        # Begin nested transaction for atomic operation
        nested = await db.begin_nested()

        try:
            # Check user count again within transaction
            count_result = await db.execute(select(func.count(User.id)))
            user_count = count_result.scalar() or 0

            # First user becomes admin automatically
            role = "admin" if user_count == 0 else "user"
            is_first_user = (role == "admin")

            # Create new user
            user = User(
                wallet_address=normalized_address,
                role=role
            )
            db.add(user)

            # Commit nested transaction
            await nested.commit()

            # Commit main transaction
            await db.commit()
            await db.refresh(user)
        except Exception as e:
            # Rollback nested transaction on error
            await nested.rollback()
            raise e

    # Generate JWT token
    access_token = create_access_token(wallet_address=user.wallet_address)

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        wallet_address=user.wallet_address,
        role=user.role,
        is_first_user=is_first_user
    )


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """Get current authenticated user information.

    Requires valid JWT token in Authorization header.

    Args:
        credentials: HTTP Bearer credentials (auto-injected by FastAPI Security)
        db: Database session

    Returns:
        UserResponse: Current user's wallet address and role

    Raises:
        HTTPException 401: If token is missing or invalid
        HTTPException 403: If user is banned
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Verify token and get wallet address
    wallet_address = verify_token(token)

    if not wallet_address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Get user from database
    from sqlalchemy import select

    result = await db.execute(
        select(User).where(User.wallet_address == wallet_address)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if user is banned
    if user.status == 'banned':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="차단된 사용자입니다. 문의하기를 통해 문의해주세요."
        )

    return UserResponse(
        wallet_address=user.wallet_address,
        role=user.role
    )


@router.post("/refresh", response_model=RefreshTokenResponse, status_code=status.HTTP_200_OK)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh JWT token.

    Validates the existing token and issues a new token with extended expiration.

    Args:
        request: Refresh token request with current token
        db: Database session

    Returns:
        RefreshTokenResponse: New JWT token with 24-hour expiration

    Raises:
        HTTPException 401: If token is invalid, expired, or user not found
        HTTPException 403: If user is banned
    """
    # Decode and verify existing token
    payload = decode_jwt(request.token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    wallet_address = payload.get("wallet_address")

    if not wallet_address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    # Verify user still exists in database
    from sqlalchemy import select

    result = await db.execute(
        select(User).where(User.wallet_address == wallet_address)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Check if user is banned
    if user.status == 'banned':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="차단된 사용자입니다. 문의하기를 통해 문의해주세요."
        )

    # Generate new token with 24-hour expiration
    new_token = create_access_token(wallet_address=user.wallet_address)

    return RefreshTokenResponse(
        access_token=new_token,
        token_type="bearer",
        expires_in=86400  # 24 hours in seconds
    )
