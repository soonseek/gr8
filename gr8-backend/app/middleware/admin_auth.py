"""Admin authorization middleware for protecting admin endpoints."""

import logging
from typing import Optional

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User
from app.auth.jwt import decode_jwt

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def verify_admin_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    JWT 토큰 검증 및 관리자 권한 확인

    Args:
        request: FastAPI Request 객체
        credentials: HTTP Bearer 토큰
        db: 데이터베이스 세션

    Returns:
        User: 인증된 운영자 사용자 객체

    Raises:
        HTTPException 401: 토큰이 없거나 무효한 경우
        HTTPException 403: 운영자 권한이 없는 경우 또는 차단된 사용자인 경우
    """
    # 1. JWT 토큰 디코딩
    token = credentials.credentials
    payload = decode_jwt(token)

    if payload is None:
        logger.warning("Invalid JWT token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증이 필요합니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. wallet_address 추출
    wallet_address = payload.get("wallet_address")

    if not wallet_address:
        logger.warning("JWT payload missing wallet_address")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다",
        )

    # 3. 데이터베이스에서 사용자 조회
    result = await db.execute(
        select(User).where(User.wallet_address == wallet_address.lower())
    )
    user = result.scalar_one_or_none()

    if not user:
        logger.warning(f"User not found: {wallet_address}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다",
        )

    # 3.5. 차단된 사용자 확인
    if user.status == 'banned':
        logger.warning(f"Banned user attempted access: {wallet_address}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="차단된 사용자입니다. 문의하기를 통해 문의해주세요."
        )

    # 4. admin role 확인
    if user.role != "admin":
        logger.warning(
            f"Non-admin user attempted admin access: "
            f"{wallet_address}, role={user.role}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="운영자만 접근할 수 있습니다",
        )

    # 5. request.state에 user 저장 (다음 핸들러에서 사용 가능)
    request.state.user = user

    logger.info(f"Admin access granted: {wallet_address}")
    return user


async def get_current_admin_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    선택적 Admin 확인 (운영자가 아니면 None 반환)

    Returns:
        User or None: 운영자이면 User 객체, 아니면 None
    """
    try:
        token = credentials.credentials
        payload = decode_jwt(token)

        if payload:
            wallet_address = payload.get("wallet_address")
            result = await db.execute(
                select(User).where(User.wallet_address == wallet_address.lower())
            )
            user = result.scalar_one_or_none()

            if user and user.role == "admin":
                request.state.user = user
                return user

    except Exception as e:
        logger.warning(f"Optional admin check failed: {e}")

    return None


def require_admin(request: Request) -> User:
    """
    데코레이터용 운영자 확인

    Usage:
        @router.get("/admin/endpoint")
        async def admin_endpoint(
            request: Request,
            admin: User = Depends(require_admin)
        ):
            return {"message": f"Hello {admin.wallet_address}"}
    """
    if not hasattr(request.state, "user"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증이 필요합니다",
        )

    user = request.state.user
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="운영자만 접근할 수 있습니다",
        )

    return user
