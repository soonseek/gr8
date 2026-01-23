"""Web3 signature verification for wallet-based authentication."""

import logging
from web3 import Web3
from eth_account.messages import encode_defunct

logger = logging.getLogger(__name__)


def verify_web3_signature(message: str, signature: str, address: str) -> bool:
    """Web3 서명 검증

    Args:
        message: 서명된 원본 메시지
        signature: 0x로 시작하는 서명값
        address: 예상되는 지갑 주소

    Returns:
        bool: 서명이 유효하면 True, 아니면 False
    """
    try:
        w3 = Web3()

        logger.info(f"Verifying signature for address: {address}")
        logger.info(f"Message: {message}")
        logger.info(f"Signature: {signature}")

        # 메시지 해싱
        message_hash = encode_defunct(text=message)

        # 서명으로부터 주소 복구
        recovered_address = w3.eth.account.recover_message(message_hash, signature=signature)

        logger.info(f"Recovered address: {recovered_address}")

        # 대소문자 구분 없이 비교
        if recovered_address.lower() != address.lower():
            logger.warning(f"Signature verification failed: expected {address.lower()}, got {recovered_address.lower()}")
            return False

        logger.info(f"✅ Signature verified successfully for {address}")
        return True

    except Exception as e:
        logger.error(f"❌ Signature verification error: {e}", exc_info=True)
        return False
