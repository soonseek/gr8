"""JWT token creation and verification for Web3 authentication."""

from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from typing import Optional

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production-min-32-chars")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24시간


def create_access_token(data: dict) -> str:
    """JWT 토큰 생성
    
    Args:
        data: Token payload data (dict with wallet_address, role, etc.)
    
    Returns:
        str: JWT access token
    """
    # Handle both string and dict input for backward compatibility
    if isinstance(data, str):
        wallet_address = data
        payload = {
            "wallet_address": wallet_address.lower(),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": datetime.utcnow()
        }
    else:
        # Dict input (new MongoDB version)
        payload = {
            "wallet_address": data.get("sub", "").lower() if isinstance(data.get("sub"), str) else "",
            "role": data.get("role", "user"),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": datetime.utcnow()
        }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def decode_jwt(token: str) -> Optional[dict]:
    """JWT 토큰 디코딩

    Args:
        token: JWT 토큰

    Returns:
        Optional[dict]: 토큰 payload (디코딩 실패 시 None)
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_token(token: str) -> Optional[str]:
    """토큰 검증 및 지갑 주소 반환

    Args:
        token: JWT 토큰

    Returns:
        Optional[str]: 지갑 주소 (검증 실패 시 None)
    """
    payload = decode_jwt(token)
    if payload:
        return payload.get("wallet_address")
    return None
