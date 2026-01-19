"""Simple in-memory cache for dashboard data."""

import asyncio
from typing import Any, Dict, Optional


class SimpleCache:
    """간단한 인메모리 캐시."""

    def __init__(self) -> None:
        self._cache: Dict[str, Any] = {}
        self._timers: Dict[str, asyncio.Task] = {}

    async def get(self, key: str) -> Optional[Any]:
        """
        캐시 조회.

        Args:
            key: 캐시 키

        Returns:
            캐시된 값 또는 None
        """
        return self._cache.get(key)

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """
        캐시 저장 (기본 TTL: 5분).

        Args:
            key: 캐시 키
            value: 저장할 값
            ttl: Time-to-live (초 단위)
        """
        self._cache[key] = value

        # 기존 타이머 취소
        if key in self._timers:
            self._timers[key].cancel()

        # TTL 만료 타이머
        async def expire() -> None:
            await asyncio.sleep(ttl)
            self._cache.pop(key, None)
            self._timers.pop(key, None)

        self._timers[key] = asyncio.create_task(expire())

    async def delete(self, key: str) -> None:
        """
        캐시 삭제.

        Args:
            key: 캐시 키
        """
        self._cache.pop(key, None)
        if key in self._timers:
            self._timers[key].cancel()
            self._timers.pop(key, None)

    async def clear(self) -> None:
        """모든 캐시 삭제."""
        for key in self._timers:
            self._timers[key].cancel()
        self._cache.clear()
        self._timers.clear()


# 전역 캐시 인스턴스
cache = SimpleCache()
