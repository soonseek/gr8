"""Unit tests for JWT authentication module."""

import pytest
from datetime import datetime, timedelta
from unittest.mock import patch

from app.auth.jwt import (
    create_access_token,
    decode_jwt,
    verify_token,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)


class TestJWTTokenCreation:
    """Test JWT token creation functionality."""

    def test_create_access_token_success(self):
        """Test successful token creation with valid wallet address."""
        wallet_address = "0x1234567890123456789012345678901234567890"
        token = create_access_token(wallet_address)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_access_token_contains_wallet_address(self):
        """Test that token contains wallet address in payload."""
        wallet_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        token = create_access_token(wallet_address)
        payload = decode_jwt(token)

        assert payload is not None
        assert payload["wallet_address"] == wallet_address.lower()

    def test_create_access_token_normalizes_address(self):
        """Test that wallet address is normalized to lowercase."""
        wallet_address = "0xABCDEFabcdef1234567890ABCDEFabcdef123456"
        token = create_access_token(wallet_address)
        payload = decode_jwt(token)

        assert payload["wallet_address"] == wallet_address.lower()

    def test_create_access_token_includes_expiration(self):
        """Test that token includes expiration claim."""
        wallet_address = "0x1234567890123456789012345678901234567890"
        token = create_access_token(wallet_address)
        payload = decode_jwt(token)

        assert payload is not None
        assert "exp" in payload
        assert "iat" in payload

    def test_create_access_token_expiration_time(self):
        """Test that token expiration is set to 24 hours."""
        wallet_address = "0x1234567890123456789012345678901234567890"
        before_creation = datetime.utcnow()
        token = create_access_token(wallet_address)
        after_creation = datetime.utcnow()

        payload = decode_jwt(token)
        exp_time = datetime.fromtimestamp(payload["exp"])
        iat_time = datetime.fromtimestamp(payload["iat"])

        # Check expiration is approximately 24 hours after issuance
        time_diff = exp_time - iat_time
        assert time_diff == timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        assert time_diff == timedelta(hours=24)


class TestJWTTokenDecoding:
    """Test JWT token decoding functionality."""

    def test_decode_valid_token(self):
        """Test decoding a valid token."""
        wallet_address = "0x1234567890123456789012345678901234567890"
        token = create_access_token(wallet_address)
        payload = decode_jwt(token)

        assert payload is not None
        assert isinstance(payload, dict)

    def test_decode_invalid_token(self):
        """Test decoding an invalid token."""
        invalid_token = "invalid.token.string"
        payload = decode_jwt(invalid_token)

        assert payload is None

    def test_decode_malformed_token(self):
        """Test decoding a malformed token."""
        malformed_token = "not-a-jwt-token"
        payload = decode_jwt(malformed_token)

        assert payload is None

    def test_decode_empty_token(self):
        """Test decoding an empty token."""
        payload = decode_jwt("")

        assert payload is None


class TestJWTTokenVerification:
    """Test JWT token verification functionality."""

    def test_verify_valid_token(self):
        """Test verifying a valid token returns wallet address."""
        wallet_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        token = create_access_token(wallet_address)
        recovered_address = verify_token(token)

        assert recovered_address is not None
        assert recovered_address == wallet_address.lower()

    def test_verify_invalid_token(self):
        """Test verifying an invalid token returns None."""
        invalid_token = "invalid.token.string"
        recovered_address = verify_token(invalid_token)

        assert recovered_address is None

    def test_verify_expired_token(self):
        """Test verifying an expired token returns None."""
        with patch('app.auth.jwt.ACCESS_TOKEN_EXPIRE_MINUTES', -1):
            wallet_address = "0x1234567890123456789012345678901234567890"
            token = create_access_token(wallet_address)
            recovered_address = verify_token(token)

            assert recovered_address is None

    def test_verify_token_case_sensitivity(self):
        """Test that wallet addresses are case-insensitive after tokenization."""
        wallet_address = "0xABCDEFabcdef1234567890ABCDEFabcdef123456"
        token = create_access_token(wallet_address)
        recovered_address = verify_token(token)

        # Token stores lowercase, so retrieval should match lowercase
        assert recovered_address == wallet_address.lower()


class TestJWTConfiguration:
    """Test JWT configuration constants."""

    def test_secret_key_exists(self):
        """Test that SECRET_KEY is configured."""
        assert SECRET_KEY is not None
        assert isinstance(SECRET_KEY, str)
        assert len(SECRET_KEY) > 0

    def test_algorithm_is_hs256(self):
        """Test that ALGORITHM is HS256."""
        assert ALGORITHM == "HS256"

    def test_expiration_is_24_hours(self):
        """Test that ACCESS_TOKEN_EXPIRE_MINUTES is 24 hours."""
        assert ACCESS_TOKEN_EXPIRE_MINUTES == 1440  # 24 * 60
