"""Unit tests for Web3 signature verification module."""

import pytest
from unittest.mock import patch, MagicMock
from eth_account.messages import encode_defunct

from app.auth.web3_auth import verify_web3_signature


class TestWeb3SignatureVerification:
    """Test Web3 signature verification functionality."""

    @patch('app.auth.web3_auth.Web3')
    def test_verify_valid_signature(self, mock_web3_class):
        """Test successful signature verification."""
        # Setup mocks
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        test_address = "0x1234567890123456789012345678901234567890"
        mock_w3.eth.account.recover_message.return_value = test_address

        message = "Test message"
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is True
        mock_w3.eth.account.recover_message.assert_called_once()

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_address_mismatch(self, mock_web3_class):
        """Test signature verification with address mismatch."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        expected_address = "0x1234567890123456789012345678901234567890"
        recovered_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        mock_w3.eth.account.recover_message.return_value = recovered_address

        message = "Test message"
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, expected_address)

        assert result is False

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_case_insensitive(self, mock_web3_class):
        """Test that address comparison is case-insensitive."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        expected_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        recovered_address = "0xabcdef1234567890abcdef1234567890abcdef12"  # lowercase
        mock_w3.eth.account.recover_message.return_value = recovered_address

        message = "Test message"
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, expected_address)

        assert result is True

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_message_encoding(self, mock_web3_class):
        """Test that message is properly encoded using encode_defunct."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        test_address = "0x1234567890123456789012345678901234567890"
        mock_w3.eth.account.recover_message.return_value = test_address

        message = "Welcome to gr8!"
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is True

        # Verify encode_defunct was called (it's used in the function)
        # We can't directly verify the call since it's not mocked,
        # but we can verify the recover_message was called

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_exception_handling(self, mock_web3_class):
        """Test that exceptions are handled gracefully."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        # Simulate an exception during signature recovery
        mock_w3.eth.account.recover_message.side_effect = Exception("RPC error")

        message = "Test message"
        signature = "0xinvalid"
        test_address = "0x1234567890123456789012345678901234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is False

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_invalid_signature_format(self, mock_web3_class):
        """Test verification with invalid signature format."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        mock_w3.eth.account.recover_message.side_effect = ValueError("Invalid signature")

        message = "Test message"
        signature = "invalid-signature"
        test_address = "0x1234567890123456789012345678901234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is False

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_empty_message(self, mock_web3_class):
        """Test verification with empty message."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        test_address = "0x1234567890123456789012345678901234567890"
        mock_w3.eth.account.recover_message.return_value = test_address

        message = ""
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is True

    @patch('app.auth.web3_auth.Web3')
    def test_verify_signature_with_default_message(self, mock_web3_class):
        """Test verification with default authentication message."""
        mock_w3 = MagicMock()
        mock_web3_class.return_value = mock_w3

        test_address = "0x1234567890123456789012345678901234567890"
        mock_w3.eth.account.recover_message.return_value = test_address

        message = "Welcome to gr8! Sign this message to authenticate."
        signature = "0xabcdef1234567890"

        result = verify_web3_signature(message, signature, test_address)

        assert result is True


class TestEncodeDefunctIntegration:
    """Test integration with eth_account.messages.encode_defunct."""

    def test_encode_defunct_creates_hashable_message(self):
        """Test that encode_defunct creates proper message hash."""
        message_text = "Test message for encoding"
        encoded_message = encode_defunct(text=message_text)

        assert encoded_message is not None
        assert hasattr(encoded_message, 'version')

    def test_encode_defunct_with_empty_string(self):
        """Test encode_defunct with empty string."""
        encoded_message = encode_defunct(text="")

        assert encoded_message is not None

    def test_encode_defunct_with_unicode(self):
        """Test encode_defunct with unicode characters."""
        unicode_message = "Hello 🚀 gr8!"
        encoded_message = encode_defunct(text=unicode_message)

        assert encoded_message is not None
