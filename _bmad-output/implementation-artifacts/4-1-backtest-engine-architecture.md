# Story 4.1: 백테스팅 엔진 아키텍처 설계

Status: ready-for-dev

---

## Story

**As a** 백엔드 개발자 (Backend Developer),
**I want** 확장 가능한 백테스팅 엔진 아키텍처를 설계하고 폴더 구조를 생성한다,
**so that** 다양한 전략을 효율적으로 실행하는 백테스팅 시스템을 구축할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1.2에서 백엔드 스타터 템플릿 완료 ✅ (FastAPI, PostgreSQL, Alembic)
- Story 4.2에서 과거 시장 데이터 수집 완료 ✅ (ccxt 기반, market_data 테이블)
- Story 3.2에서 노드 타입 정의 완료 ✅ (전략 JSON 구조 확정)

**문제:**
- 백테스팅 엔진 아키텍처가 정의되지 않음
- 전략 실행 레이어, 데이터 Fetch 레이어, 결과 저장 레이어가 분리되지 않음
- 비동기 실행 인프라가 없음 (Celery/BackgroundTasks)
- 백테스팅 엔진의 성능 목표 (NFR14: <2분)를 충족할 최적화 계획이 없음

**해결:**
확장 가능한 계층형 아키텍처 설계 및 폴더 구조 생성

**중요:**
- 이 Story는 **아키텍처 설계 + 폴더 구조 생성**만 수행
- 실제 백테스팅 엔진 구현은 Story 4.3 (전략 실행 엔진)
- 이 Story에서 생성하는 **인터페이스/추상화 계층**이 후속 Stories의 기반

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 백테스팅 엔진 폴더 구조 생성

**Given** 백엔드 스타터 템플릿이 설정되었다 (Story 1.2)
**When** 개발자가 백테스팅 엔진 폴더 구조를 생성한다
**Then** 다음 구조가 생성된다:
```
gr8-backend/
  app/
    backtest/
      __init__.py
      engine.py         # 백테스팅 엔진 코어 (BacktestEngine 클래스)
      executor.py       # 전략 실행기 (StrategyExecutor 클래스)
      data_fetcher.py   # 과거 데이터 가져오기 (DataFetcher 클래스)
      metrics.py        # 성과 지표 계산 (MetricsCalculator 클래스)
      storage.py        # 결과 저장 (BacktestStorage 클래스)
      api.py           # FastAPI 라우터 (백테스트 CRUD/실행 엔드포인트)
```
**And** 모든 파이썬 파일에 빈 클래스/함수 스켈레톤이 생성된다
**And** `app/backtest/__init__.py`에 모든 주요 클래스가 export된다
```python
# app/backtest/__init__.py
from .engine import BacktestEngine
from .executor import StrategyExecutor
from .data_fetcher import DataFetcher
from .metrics import MetricsCalculator
from .storage import BacktestStorage

__all__ = [
    "BacktestEngine",
    "StrategyExecutor",
    "DataFetcher",
    "MetricsCalculator",
    "BacktestStorage",
]
```

### AC 2: FastAPI 기반 백테스팅 API 정의

**Given** 백테스팅 엔진 폴더 구조가 생성되었다
**When** 개발자가 `app/backtest/api.py`를 생성한다
**Then** FastAPI router가 정의된다:
```python
# app/backtest/api.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/backtest", tags=["backtest"])

@router.post("/run")
async def run_backtest(
    strategy_id: str,
    start_date: str,  # ISO 8601
    end_date: str,    # ISO 8601
    initial_capital: float = 10000.0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    백테스트 실행 (비동기)

    - BackgroundTasks로 비동기 실행
    - 즉시 backtest_id 반환
    - WebSocket으로 진행 상태 전송 (Story 4.8)
    """
    pass

@router.get("/results/{backtest_id}")
async def get_backtest_result(
    backtest_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """백테스트 결과 조회"""
    pass

@router.get("/history")
async def get_backtest_history(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """사용자의 백테스트 기록 조회"""
    pass
```
**And** `app/main.py`에 router가 등록된다:
```python
from app.backtest import api as backtest_api

app.include_router(backtest_api.router)
```

### AC 3: 전략 실행 레이어 분리 (StrategyExecutor)

**Given** `app/backtest/executor.py`가 생성되었다
**When** 개발자가 `StrategyExecutor` 클래스 스켈레톤을 생성한다
**Then** 다음 인터페이스가 정의된다:
```python
# app/backtest/executor.py
from typing import Dict, Any, List
from pandas import DataFrame

class StrategyExecutor:
    """
    전략 실행기 (Strategy Execution Layer)

    역할:
    - 노드 기반 전략 JSON을 파싱
    - 실행 가능한 노드 그래프로 변환
    - 각 캔들마다 노드를 순차적으로 실행
    - 매수/매도 액션을 트리거

    의존성:
    - DataFetcher: 시장 데이터 제공
    - BacktestEngine: 포지션 관리, 거래 기록

    Story 4.3에서 구현 예정
    """

    def __init__(self, strategy_json: Dict[str, Any]):
        """
        Args:
            strategy_json: 노드 기반 전략 JSON
                {
                    "nodes": [...],
                    "edges": [...]
                }
        """
        self.strategy_json = strategy_json
        self.nodes = []
        self.edges = []

    def parse_strategy(self) -> None:
        """
        전략 JSON을 파싱하여 nodes, edges로 변환

        Raises:
            ValueError: 전략 JSON 형식이 올바르지 않을 때
        """
        pass

    def execute_on_candle(
        self,
        candle: Dict[str, Any],
        index: int,
        context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        단일 캔들에 대해 전략 실행

        Args:
            candle: OHLCV 데이터
            index: 캔들 인덱스
            context: 실행 컨텍스트 (포지션, 현재 자본 등)

        Returns:
            액션 리스트 (예: [{"type": "buy", "amount": 0.1, "price": 50000}])

        Story 4.3에서 구현 예정
        """
        pass
```
**And** **구현은 하지 않음** (Story 4.3에서 구현)

### AC 4: 데이터 Fetch 레이어 독립 (DataFetcher)

**Given** `app/backtest/data_fetcher.py`가 생성되었다
**When** 개발자가 `DataFetcher` 클래스 스켈레톤을 생성한다
**Then** 다음 인터페이스가 정의된다:
```python
# app/backtest/data_fetcher.py
from datetime import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from pandas import DataFrame

class DataFetcher:
    """
    데이터 Fetch 레이어 (Data Fetch Layer)

    역할:
    - DB에서 과거 시장 데이터 조회 (market_data 테이블)
    - DataFrame 형태로 변환
    - 데이터 갭(Gap) 감지
    - 캐싱 전략 적용 (Redis는 Story 4.6 이후)

    의존성:
    - MarketData 모델 (Story 4.2)
    - SQLAlchemy AsyncSession

    Story 4.2에서 이미 구현된 MarketData 활용
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: SQLAlchemy AsyncSession
        """
        self.db = db

    async def fetch_data(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
        exchange: str = "binance"
    ) -> DataFrame:
        """
        시장 데이터를 DB에서 조회하여 DataFrame으로 반환

        Args:
            symbol: 심볼 (예: BTCUSDT)
            timeframe: 시간프레임 (1m, 5m, 1h, 1d)
            start_date: 시작일
            end_date: 종료일
            exchange: 거래소 (기본값: binance)

        Returns:
            pandas DataFrame:
                columns: [timestamp, open, high, low, close, volume]
                index: timestamp

        Raises:
            ValueError: 데이터가 부족할 때

        Story 4.2의 MarketData 모델 활용
        """
        pass

    def detect_gaps(self, df: DataFrame, timeframe: str) -> List[Dict[str, Any]]:
        """
        데이터 갭 감지

        Args:
            df: 시장 데이터 DataFrame
            timeframe: 시간프레임

        Returns:
            갭 리스트: [{"start": timestamp, "end": timestamp}, ...]

        Story 4.2의 detect_and_fill_gaps 참고
        """
        pass
```
**And** **구현은 하지 않음** (Story 4.3에서 DataFetcher 활용)

### AC 5: 결과 저장 레이어 추상화 (BacktestStorage)

**Given** `app/backtest/storage.py`가 생성되었다
**When** 개발자가 `BacktestStorage` 클래스 스켈레톤을 생성한다
**Then** 다음 인터페이스가 정의된다:
```python
# app/backtest/storage.py
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession

class BacktestStorage:
    """
    결과 저장 레이어 (Storage Layer)

    역할:
    - 백테스트 결과를 DB에 저장 (backtest_results 테이블)
    - 거래 내역 저장 (backtest_trades 테이블)
    - 결과 조회 및 삭제
    - 사용자별 백테스트 기록 조회

    의존성:
    - BacktestResult 모델 (Story 4.6에서 생성)
    - BacktestTrade 모델 (Story 4.6에서 생성)

    Story 4.6에서 구현 예정
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: SQLAlchemy AsyncSession
        """
        self.db = db

    async def save_result(
        self,
        user_id: str,
        strategy_id: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        trades: List[Dict[str, Any]]
    ) -> int:
        """
        백테스트 결과 저장

        Args:
            user_id: 사용자 지갑 주소
            strategy_id: 전략 ID
            config: 백테스트 설정 (기간, 초기 자본 등)
            result: 성과 지표 (ROI, MDD, 승률 등)
            trades: 거래 내역

        Returns:
            backtest_id (PK)

        Story 4.6에서 구현 예정
        """
        pass

    async def get_result(self, backtest_id: int) -> Dict[str, Any]:
        """
        백테스트 결과 조회

        Args:
            backtest_id: 백테스트 ID

        Returns:
            결과 딕셔너리 (성과 지표 + 거래 내역)

        Story 4.6에서 구현 예정
        """
        pass

    async def list_user_results(
        self,
        user_id: str,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        사용자의 백테스트 기록 조회

        Args:
            user_id: 사용자 지갑 주소
            limit: 반환 개수
            offset: 오프셋

        Returns:
            백테스트 결과 리스트

        Story 4.6에서 구현 예정
        """
        pass
```
**And** **구현은 하지 않음** (Story 4.6에서 구현)

### AC 6: 성과 지표 계산 레이어 정의 (MetricsCalculator)

**Given** `app/backtest/metrics.py`가 생성되었다
**When** 개발자가 `MetricsCalculator` 클래스 스켈레톤을 생성한다
**Then** 다음 인터페이스가 정의된다:
```python
# app/backtest/metrics.py
from typing import Dict, Any, List
import pandas as pd
import numpy as np

class MetricsCalculator:
    """
    성과 지표 계산 (Metrics Calculation Layer)

    역할:
    - 거래 내역 기반 성과 지표 계산
    - ROI, MDD, 승률, 손익비, 샤프 비율 등

    의존성:
    - pandas, numpy

    Story 4.4에서 구현 예정
    """

    def calculate_all_metrics(
        self,
        trades: List[Dict[str, Any]],
        initial_capital: float,
        equity_curve: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        모든 성과 지표 계산

        Args:
            trades: 거래 내역
            initial_capital: 초기 자본
            equity_curve: 자본 곡선 [{"timestamp": ..., "value": ...}]

        Returns:
            성과 지표 딕셔너리:
                {
                    "roi": float,              # 총 수익률 (%)
                    "mdd": float,              # 최대 낙폭 (%)
                    "win_rate": float,         # 승률 (%)
                    "profit_factor": float,    # 손익비
                    "sharpe_ratio": float,     # 샤프 비율
                    "total_trades": int,       # 총 거래 횟수
                    "final_capital": float     # 최종 자본
                }

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_roi(self, trades: List[Dict], initial_capital: float) -> float:
        """
        ROI 계산: (최종 자본 - 초기 자본) / 초기 자본 × 100%

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_mdd(self, equity_curve: List[Dict]) -> float:
        """
        MDD (Maximum Drawdown) 계산

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_win_rate(self, trades: List[Dict]) -> float:
        """
        승률 계산: 수익성 거래 / 전체 거래 × 100%

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_sharpe_ratio(self, equity_curve: List[Dict]) -> float:
        """
        샤프 비율 계산: (수익률 - 무위험 이자율) / 수익률 표준편차

        Story 4.4에서 구현 예정
        """
        pass
```
**And** **구현은 하지 않음** (Story 4.4에서 구현)

### AC 7: 백테스팅 엔진 코어 정의 (BacktestEngine)

**Given** `app/backtest/engine.py`가 생성되었다
**When** 개발자가 `BacktestEngine` 클래스 스켈레톤을 생성한다
**Then** 다음 인터페이스가 정의된다:
```python
# app/backtest/engine.py
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

class BacktestEngine:
    """
    백테스팅 엔진 코어 (Core Engine)

    역할:
    - 전체 백테스트 실행 오케스트레이션
    - DataFetcher, StrategyExecutor, MetricsCalculator, BacktestStorage 조합
    - 포지션 관리 (자본, 잔고, 평가 손익)
    - 거래 실행 시뮬레이션 (수수료, 슬리피지 적용)

    의존성:
    - DataFetcher: 시장 데이터 제공
    - StrategyExecutor: 전략 실행
    - MetricsCalculator: 성과 지표 계산
    - BacktestStorage: 결과 저장

    Story 4.3에서 구현 예정
    """

    def __init__(
        self,
        db: AsyncSession,
        strategy_json: Dict[str, Any],
        config: Dict[str, Any]
    ):
        """
        Args:
            db: SQLAlchemy AsyncSession
            strategy_json: 노드 기반 전략 JSON
            config: 백테스트 설정
                {
                    "symbol": "BTCUSDT",
                    "timeframe": "1h",
                    "start_date": "2024-01-01T00:00:00Z",
                    "end_date": "2024-12-31T23:59:59Z",
                    "initial_capital": 10000.0,
                    "commission": 0.001,  # 0.1%
                    "slippage": 0.0005    # 0.05%
                }
        """
        self.db = db
        self.strategy_json = strategy_json
        self.config = config

        # 초기 자본
        self.initial_capital = config["initial_capital"]
        self.current_capital = self.initial_capital

        # 포지션 관리
        self.position = {}  # {"BTCUSDT": {"quantity": 0.1, "avg_price": 50000}}

        # 거래 기록
        self.trades = []

        # 자본 곡선 (MDD, 샤프 비율 계산용)
        self.equity_curve = []

    async def run(self) -> Dict[str, Any]:
        """
        백테스트 실행

        Returns:
            결과 딕셔너리:
                {
                    "backtest_id": int,
                    "metrics": {...},
                    "trades": [...],
                    "equity_curve": [...]
                }

        Raises:
            ValueError: 데이터 부족, 전략 오류
            Exception: 백테스트 실행 실패

        Story 4.3에서 구현 예정
        """
        pass

    def _handle_buy_action(self, action: Dict[str, Any]) -> None:
        """
        매수 액션 처리

        - 수수료 계산 (0.1%)
        - 슬리피지 적용 (0.05%)
        - 포지션 업데이트
        - 거래 기록

        Story 4.3에서 구현 예정
        """
        pass

    def _handle_sell_action(self, action: Dict[str, Any]) -> None:
        """
        매도 액션 처리

        - 수수료 계산
        - 슬리피지 적용
        - 포지션 종료
        - 거래 기록
        - PnL 계산

        Story 4.3에서 구현 예정
        """
        pass

    def _update_equity_curve(self, timestamp: int) -> None:
        """
        자본 곡선 업데이트

        현재 자본 = 현금 + 포지션 평가가

        Story 4.3에서 구현 예정
        """
        pass
```
**And** **구현은 하지 않음** (Story 4.3에서 구현)

### AC 8: 비동기 실행 지원 (FastAPI BackgroundTasks)

**Given** `app/backtest/api.py`가 생성되었다
**When** 개발자가 `/run` 엔드포인트를 정의한다
**Then** FastAPI BackgroundTasks가 사용된다:
```python
# app/backtest/api.py (AC 2에서 생성한 파일)
from fastapi import BackgroundTasks

@router.post("/run")
async def run_backtest(
    strategy_id: str,
    start_date: str,
    end_date: str,
    initial_capital: float = 10000.0,
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    백테스트 실행 (비동기)

    1. 백테스트 작업을 백그라운드 큐에 추가
    2. 즉시 backtest_id 반환 (생성된 backtest_results 레코드의 ID)
    3. 백그라운드에서 BacktestEngine.run() 실행
    4. 완료 시 DB 업데이트 (status: "completed")
    """
    # 1. backtest_results 레코드 생성 (status: "pending")
    # 2. background_tasks.add_task()로 백테스트 실행
    # 3. 즉시 backtest_id 반환

    pass
```
**And** **BackgroundTasks만 사용** (Celery는 Story 4.3 이후 고려)
**And** **실제 구현은 하지 않음** (Story 4.3에서 구현)

### AC 9: NFR6: API 응답시간 < 200ms 캐싱 전략

**Given** 백테스팅 엔진 아키텍처가 설계되었다
**When** 개발자가 캐싱 전략을 정의한다
**Then** 다음 캐싱 계획이 문서화된다 (이 Story의 README.md 또는 Dev Notes):
```markdown
## 캐싱 전략 (NFR6: API 응답시간 < 200ms)

### 1. 시장 데이터 캐싱
- **대상**: market_data 테이블 조회
- **캐시**: Redis (Phase 2: Story 4.6 이후)
- **Key**: `market_data:{symbol}:{timeframe}:{start_date}:{end_date}`
- **TTL**: 1시간
- **목표**: 중복 조회 방지 (동일 기간 백테스트 시)

### 2. 백테스트 결과 캐싱
- **대상**: backtest_results 테이블 조회
- **캐시**: Redis (Phase 2)
- **Key**: `backtest_result:{backtest_id}`
- **TTL**: 24시간
- **목표**: 결과 페이지 로딩 < 200ms

### 3. 전략 JSON 캐싱
- **대상**: strategies 테이블 (Epic 3)
- **캐시**: Redis 또는 메모리
- **Key**: `strategy:{strategy_id}`
- **TTL**: 1시간
- **목표**: 백테스트 실행 시 전략 로딩 < 50ms

### MVP (Phase 1)
- Redis 미사용
- DB 인덱싱으로만 최적화
- Story 4.2의 인덱스 활용: idx_market_data_lookup

### Phase 2 (Story 4.6 이후)
- Redis 캐싱 도입
- FastAPI CacheResponse 헤더 활용
```
**And** `app/backtest/README.md`에 캐싱 전략이 문서화된다

### AC 10: NFR14: 백테스트 1회 실행 < 2분 최적화 계획

**Given** 백테스팅 엔진 아키텍처가 설계되었다
**When** 개발자가 최적화 계획을 정의한다
**Then** 다음 최적화 계획이 문서화된다 (`app/backtest/README.md`):
```markdown
## 성능 최적화 계획 (NFR14: 백테스트 1회 실행 < 2분)

### 1. 데이터 로딩 최적화
- **현재**: DB에서 1년치 1h 캔들 = 8,760 rows
- **최적화**: Chunked loading (1000 rows 단위)
- **예상 시간**: < 5초

### 2. 전략 실행 최적화
- **현재**: Python 순차 실행 (단일 스레드)
- **병목**: 노드 그래프 실행 (Indicator 계산)
- **최적화 (Phase 2)**:
  - Numba JIT 컴파일 (지표 계산 10x 빠름)
  - Cython으로 핵심 로직 컴파일
  - 병렬 처리 (multiprocessing) - 여러 백테스트 동시 실행
- **MVP**: Python 순차 실행 (최적화 없음)
- **목표 시간**: < 90초 (1년치 1h 캔들)

### 3. DB 저장 최적화
- **현재**: 개별 INSERT (거래마다 1번 쿼리)
- **최적화**: Bulk insert (Story 4.2 참고)
- **예상 시간**: < 1초 (1000 거래 기준)

### 4. 메모리 관리
- **현재**: 전체 DataFrame을 메모리에 로드
- **최적화**: Generator pattern (캔들을 순회하며 처리)
- **목표**: 메모리 사용량 < 500MB

### 성능 목표 (1년치 1h 캔들, 간단한 전략)
- 데이터 로딩: < 5초
- 전략 실행: < 90초
- 지표 계산: < 10초
- 결과 저장: < 5초
- **총계: < 110초 (여유 있게 2분 이내)**

### 측정 방법
- time.perf_counter()로 각 단계 시간 측정
- CloudWatch metric: BacktestExecutionTime
- CloudWatch Alarm: 실행 시간 > 120초 시 경보
```
**And** `app/backtest/README.md`에 최적화 계획이 문서화된다

### AC 11: 백테스팅 엔진 아키텍처 다이어그램

**Given** 모든 클래스가 정의되었다
**When** 개발자가 `app/backtest/README.md`를 생성한다
**Then** 다음 아키텍처 다이어그램이 포함된다:
```markdown
# 백테스팅 엔진 아키텍처

## 계층 구조 (Layered Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  FastAPI Router (app/backtest/api.py)                   │
│  - POST /api/v1/backtest/run                             │
│  - GET /api/v1/backtest/results/{id}                     │
│  - GET /api/v1/backtest/history                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Core Engine Layer                        │
│  BacktestEngine (app/backtest/engine.py)                │
│  - 오케스트레이션: 전체 백테스트 실행 흐름 제어          │
│  - 포지션 관리: 자본, 잔고, 평가 손익                    │
│  - 거래 실행: 수수료, 슬리피지 적용                       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
│  Data Layer  │  │ Execution Layer  │  │ Metrics Layer│
│ DataFetcher  │  │StrategyExecutor  │  │MetricsCalc   │
│              │  │                  │  │              │
│ - DB 조회    │  │ - 노드 그래프 실행│  │ - ROI 계산   │
│ - DataFrame  │  │ - 액션 트리거    │  │ - MDD 계산   │
│ - 갭 감지    │  │ - Indicator 계산 │  │ - 승률 계산  │
└──────────────┘  └──────────────────┘  └──────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │   Storage Layer      │
                │  BacktestStorage     │
                │                      │
                │  - 결과 저장         │
                │  - 거래 내역 저장    │
                │  - 결과 조회         │
                └──────────────────────┘
```

## 데이터 흐름 (Data Flow)

```
1. 사용자가 POST /api/v1/backtest/run 요청
   - strategy_id, start_date, end_date, initial_capital

2. API Layer가 BacktestEngine 초기화
   - DataFetcher: 시장 데이터 로드
   - StrategyExecutor: 전략 파싱

3. BacktestEngine.run() 실행 (백그라운드)
   - For each candle in data:
     a. DataFetcher가 캔들 제공
     b. StrategyExecutor.execute_on_candle()
     c. 액션 발생 시 BacktestEngine._handle_buy/sell_action()
     d. 포지션 업데이트, 거래 기록
     e. 자본 곡선 업데이트

4. MetricsCalculator로 성과 지표 계산
   - ROI, MDD, 승률, 샤프 비율 등

5. BacktestStorage로 결과 저장
   - backtest_results 테이블
   - backtest_trades 테이블

6. 사용자가 GET /api/v1/backtest/results/{id}로 조회
```

## 의존성 그래프

```
BacktestEngine (Core)
    ├── DataFetcher (Data Layer)
    │   └── MarketData 모델 (Story 4.2)
    ├── StrategyExecutor (Execution Layer)
    │   └── 노드 타입 정의 (Story 3.2)
    ├── MetricsCalculator (Metrics Layer)
    │   └── pandas, numpy
    └── BacktestStorage (Storage Layer)
        └── BacktestResult, BacktestTrade 모델 (Story 4.6)
```
```
**And** README.md가 `app/backtest/` 폴더에 생성된다

---

## Tasks / Subtasks

### Task 1: 백테스팅 엔진 폴더 구조 생성 (AC: #1)
- [ ] Subtask 1.1: `app/backtest/` 폴더 생성
- [ ] Subtask 1.2: `app/backtest/__init__.py` 생성 (모든 클래스 export)
- [ ] Subtask 1.3: `app/backtest/engine.py` 생성 (BacktestEngine 스켈레톤)
- [ ] Subtask 1.4: `app/backtest/executor.py` 생성 (StrategyExecutor 스켈레톤)
- [ ] Subtask 1.5: `app/backtest/data_fetcher.py` 생성 (DataFetcher 스켈레톤)
- [ ] Subtask 1.6: `app/backtest/metrics.py` 생성 (MetricsCalculator 스켈레톤)
- [ ] Subtask 1.7: `app/backtest/storage.py` 생성 (BacktestStorage 스켈레톤)
- [ ] Subtask 1.8: `app/backtest/api.py` 생성 (FastAPI router 스켈레톤)

### Task 2: FastAPI 기반 백테스팅 API 정의 (AC: #2, #8)
- [ ] Subtask 2.1: FastAPI router 생성 (`app/backtest/api.py`)
- [ ] Subtask 2.2: `POST /api/v1/backtest/run` 엔드포인트 정의 (BackgroundTasks 사용)
- [ ] Subtask 2.3: `GET /api/v1/backtest/results/{backtest_id}` 엔드포인트 정의
- [ ] Subtask 2.4: `GET /api/v1/backtest/history` 엔드포인트 정의
- [ ] Subtask 2.5: `app/main.py`에 router 등록

### Task 3: 전략 실행 레이어 분리 정의 (AC: #3)
- [ ] Subtask 3.1: `StrategyExecutor` 클래스 스켈레톤 생성
- [ ] Subtask 3.2: `parse_strategy()` 메서드 시그니처 정의
- [ ] Subtask 3.3: `execute_on_candle()` 메서드 시그니처 정의
- [ ] Subtask 3.4: Docstring 추가 (역할, 의존성, Story 참조)

### Task 4: 데이터 Fetch 레이어 독립 정의 (AC: #4)
- [ ] Subtask 4.1: `DataFetcher` 클래스 스켈레톤 생성
- [ ] Subtask 4.2: `fetch_data()` 메서드 시그니처 정의
- [ ] Subtask 4.3: `detect_gaps()` 메서드 시그니처 정의
- [ ] Subtask 4.4: Docstring 추가 (Story 4.2의 MarketData 참조)

### Task 5: 결과 저장 레이어 추상화 정의 (AC: #5)
- [ ] Subtask 5.1: `BacktestStorage` 클래스 스켈레톤 생성
- [ ] Subtask 5.2: `save_result()` 메서드 시그니처 정의
- [ ] Subtask 5.3: `get_result()` 메서드 시그니처 정의
- [ ] Subtask 5.4: `list_user_results()` 메서드 시그니처 정의
- [ ] Subtask 5.5: Docstring 추가 (Story 4.6 참조)

### Task 6: 성과 지표 계산 레이어 정의 (AC: #6)
- [ ] Subtask 6.1: `MetricsCalculator` 클래스 스켈레톤 생성
- [ ] Subtask 6.2: `calculate_all_metrics()` 메서드 시그니처 정의
- [ ] Subtask 6.3: `calculate_roi()` 메서드 시그니처 정의
- [ ] Subtask 6.4: `calculate_mdd()` 메서드 시그니처 정의
- [ ] Subtask 6.5: `calculate_win_rate()` 메서드 시그니처 정의
- [ ] Subtask 6.6: `calculate_sharpe_ratio()` 메서드 시그니처 정의
- [ ] Subtask 6.7: Docstring 추가 (Story 4.4 참조)

### Task 7: 백테스팅 엔진 코어 정의 (AC: #7)
- [ ] Subtask 7.1: `BacktestEngine` 클래스 스켈레톤 생성
- [ ] Subtask 7.2: `__init__()` 메서드 정의 (초기 자본, 포지션, 거래 기록 초기화)
- [ ] Subtask 7.3: `run()` 메서드 시그니처 정의
- [ ] Subtask 7.4: `_handle_buy_action()` 메서드 시그니처 정의
- [ ] Subtask 7.5: `_handle_sell_action()` 메서드 시그니처 정의
- [ ] Subtask 7.6: `_update_equity_curve()` 메서드 시그니처 정의
- [ ] Subtask 7.7: Docstring 추가 (의존성, 오케스트레이션 흐름 설명)

### Task 8: README.md 생성 (AC: #9, #10, #11)
- [ ] Subtask 8.1: `app/backtest/README.md` 생성
- [ ] Subtask 8.2: 캐싱 전략 문서화 (NFR6: < 200ms)
- [ ] Subtask 8.3: 성능 최적화 계획 문서화 (NFR14: < 2분)
- [ ] Subtask 8.4: 아키텍처 다이어그램 추가 (계층 구조, 데이터 흐름)
- [ ] Subtask 8.5: 의존성 그래프 추가

### Task 9: 단위 테스트 스켈레톤 생성 (AC: #1-#7 검증)
- [ ] Subtask 9.1: `tests/unit/test_backtest_engine.py` 생성
- [ ] Subtask 9.2: BacktestEngine 초기화 테스트 (skipped)
- [ ] Subtask 9.3: DataFetcher 인터페이스 테스트 (skipped)
- [ ] Subtask 9.4: MetricsCalculator 인터페이스 테스트 (skipped)
- [ ] Subtask 9.5: StrategyExecutor 인터페이스 테스트 (skipped)
- [ ] Subtask 9.6: BacktestStorage 인터페이스 테스트 (skipped)
- [ ] Subtask 9.7: pytest 실행 및 모든 테스트 skip 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스팅 엔진의 아키텍처를 설계하고 폴더 구조를 생성**합니다. 완료되면:
- **계층형 아키텍처** 확정 (API, Core, Data, Execution, Metrics, Storage)
- **명확한 인터페이스** 정의 (각 레이어의 역할과 책임)
- **확장 가능한 기반** 마련 (후속 Stories에서 구현)
- **성능 목표 달성 계획** 수립 (NFR6, NFR14)

### 📐 아키텍처 원칙

**1. 계층 분리 (Separation of Concerns):**
- **API Layer**: FastAPI 라우터 (HTTP 요청/응답)
- **Core Engine Layer**: 백테스트 오케스트레이션, 포지션 관리
- **Data Layer**: 시장 데이터 로드 (market_data 테이블)
- **Execution Layer**: 전략 실행 (노드 그래프)
- **Metrics Layer**: 성과 지표 계산
- **Storage Layer**: 결과 저장 (DB)

**2. 의존성 주입 (Dependency Injection):**
- BacktestEngine이 DataFetcher, StrategyExecutor, MetricsCalculator, BacktestStorage를 조합
- 각 레이어가 독립적으로 테스트 가능
- Story 4.3, 4.4, 4.6에서 구현 시 이 인터페이스를 따름

**3. 인터페이스 우선 (Interface-First Design):**
- 이 Story에서는 **스켈레톤 코드만 생성** (메서드 시그니처 + Docstring)
- 실제 구현은 후속 Stories에서 진행
- Story 4.2의 MarketData 모델 활용 (데이터 소스)

### 📚 Story 4.2 (과거 시장 데이터)에서 배운 패턴

**데이터 Fetch 패턴** [Source: 4-2-historical-market-data.md]:
```python
# Story 4.2의 MarketDataService
class MarketDataService:
    async def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[dict]:
        # ccxt로 데이터 가져오기
        pass

    async def get_data_from_db(
        self,
        exchange: str,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
        db: AsyncSession
    ) -> List[MarketData]:
        # DB에서 데이터 조회
        pass
```

**Story 4.1의 DataFetcher는 위 패턴을 활용**:
```python
class DataFetcher:
    async def fetch_data(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
        exchange: str = "binance"
    ) -> DataFrame:
        """
        Story 4.2의 MarketData 모델 활용
        """
        pass
```

**DB 스키마 참고** (Story 4.2에서 생성):
```sql
-- market_data 테이블 (Story 4.2)
CREATE TABLE market_data (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(20) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  timestamp BIGINT NOT NULL,
  open DECIMAL(20, 8) NOT NULL,
  high DECIMAL(20, 8) NOT NULL,
  low DECIMAL(20, 8) NOT NULL,
  close DECIMAL(20, 8) NOT NULL,
  volume DECIMAL(30, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(exchange, symbol, timeframe, timestamp)
);

CREATE INDEX idx_market_data_lookup
ON market_data(exchange, symbol, timeframe, timestamp);
```

### 🏗️ 백테스팅 엔진 코어 설계

**BacktestEngine의 역할** [Source: architecture.md#Backtest Engine]:
- **오케스트레이션**: 전체 백테스트 실행 흐름 제어
- **포지션 관리**: 자본, 잔고, 평가 손익 추적
- **거래 실행 시뮬레이션**: 수수료(0.1%), 슬리피지(0.05%) 적용

**핵심 메서드**:
```python
class BacktestEngine:
    async def run(self) -> Dict[str, Any]:
        """
        백테스트 실행 흐름:

        1. DataFetcher.fetch_data()로 시장 데이터 로드
        2. StrategyExecutor.parse_strategy()로 전략 파싱
        3. For each candle in data:
           a. StrategyExecutor.execute_on_candle(candle)
           b. 액션 발생 시 _handle_buy/sell_action()
           c. 포지션 업데이트, 거래 기록
           d. _update_equity_curve()
        4. MetricsCalculator.calculate_all_metrics()
        5. BacktestStorage.save_result()
        """
        pass
```

### 🚀 비동기 실행 전략

**FastAPI BackgroundTasks** [Source: architecture.md#Async Support]:
```python
# app/backtest/api.py
from fastapi import BackgroundTasks

@router.post("/run")
async def run_backtest(
    strategy_id: str,
    start_date: str,
    end_date: str,
    initial_capital: float = 10000.0,
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. backtest_results 레코드 생성 (status: "pending")
    # 2. background_tasks.add_task(run_backtest_task, backtest_id, ...)
    # 3. 즉시 backtest_id 반환

    return {"backtest_id": backtest_id, "status": "pending"}

async def run_backtest_task(backtest_id: int, ...):
    # 백그라운드에서 실행
    engine = BacktestEngine(db, strategy_json, config)
    result = await engine.run()
    # DB 업데이트 (status: "completed")
```

**왜 Celery를 사용하지 않는가?**
- **MVP**: BackgroundTasks로 충분 (단일 서버)
- **Phase 2**: 병렬 백테스트 필요 시 Celery 도입
- ** trade-off**: Celery는 Redis가 필요, 배포 복잡도 증가

### 📊 성능 최적화 계획

**NFR14: 백테스트 1회 실행 < 2분** [Source: architecture.md#NFR14]

**성능 병목 분석**:
1. **데이터 로딩**: 1년치 1h 캔들 = 8,760 rows → < 5초
2. **전략 실행**: Python 순차 실행 → < 90초 (최대 병목)
3. **지표 계산**: pandas/numpy → < 10초
4. **결과 저장**: bulk insert → < 5초

**최적화 기법**:
- **Chunked loading**: 데이터를 1000 rows 단위로 로드
- **Numba JIT**: 지표 계산 10x 가속 (Phase 2)
- **Bulk insert**: Story 4.2의 패턴 활용
- **Generator pattern**: 메모리 사용량 < 500MB

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL)
- ✅ Story 4.2: 과거 시장 데이터 가져오기 (market_data 테이블)
- ✅ Story 3.2: 노드 타입 정의 (전략 JSON 구조)

**후속 Stories (이 Story의 인터페이스 구현):**
- Story 4.3: 전략 실행 엔진 구현 (BacktestEngine.run(), StrategyExecutor)
- Story 4.4: 성과 지표 계산 (MetricsCalculator 구현)
- Story 4.5: 거래 내역 추적 (BacktestEngine._handle_buy/sell_action 구현)
- Story 4.6: 백테스트 결과 저장 (BacktestStorage 구현, backtest_results 테이블)

**파일 생성 목록:**
1. `app/backtest/__init__.py` - 패키지 초기화, export
2. `app/backtest/engine.py` - BacktestEngine 스켈레톤
3. `app/backtest/executor.py` - StrategyExecutor 스켈레톤
4. `app/backtest/data_fetcher.py` - DataFetcher 스켈레톤
5. `app/backtest/metrics.py` - MetricsCalculator 스켈레톤
6. `app/backtest/storage.py` - BacktestStorage 스켈레톤
7. `app/backtest/api.py` - FastAPI router
8. `app/backtest/README.md` - 아키텍처 문서
9. `tests/unit/test_backtest_engine.py` - 단위 테스트 스켈레톤
10. `app/main.py` 수정 - router 등록

### ⚠️ 중요 고려사항

**1. 구현하지 않는 것 (이 Story):**
- ❌ BacktestEngine.run() 실제 구현 → Story 4.3
- ❌ DataFetcher.fetch_data() 실제 구현 → Story 4.3 (Story 4.2의 MarketData 활용)
- ❌ MetricsCalculator.calculate_all_metrics() 실제 구현 → Story 4.4
- ❌ BacktestStorage.save_result() 실제 구현 → Story 4.6
- ✅ 위 모든 것의 **스켈레톤** (메서드 시그니처 + Docstring)만 생성

**2. 이 Story에서 해야 하는 것:**
- ✅ 폴더 구조 생성
- ✅ 클래스 스켈레톤 생성 (빈 메서드 + Docstring)
- ✅ 인터페이스 정의 (메서드 시그니처)
- ✅ FastAPI router 정의
- ✅ README.md 작성 (아키텍처, 캐싱, 최적화 계획)
- ✅ main.py에 router 등록

**3. 후속 Stories를 위한 가이드:**
- Story 4.3: `BacktestEngine.run()`, `StrategyExecutor.execute_on_candle()` 구현
- Story 4.4: `MetricsCalculator`의 모든 메서드 구현
- Story 4.6: `BacktestStorage`의 모든 메서드 구현, DB 스키마 생성

**4. 테스트 전략:**
- 이 Story에서는 **skipped 테스트**만 생성
- Story 4.3, 4.4, 4.6에서 실제 테스트 구현
- 목적: 인터페이스가 올바르게 정의되었는지 검증

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.1 요구사항 분석 (epics.md)
2. Architecture 문서 분석 (architecture.md)
3. Story 4.2 완료 내역 학습 (market_data 테이블, ccxt 활용)
4. 백테스팅 엔진 아키텍처 설계
5. 11개 AC 정의 (폴더 구조, API, 레이어 분리, 캐싱, 최적화)
6. 9개 Task/51개 Subtask 정의
7. Dev Notes 작성 (아키텍처 원칙, 의존성, 후속 작업)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 인터페이스 정의:**
- BacktestEngine (백테스팅 엔진 코어)
- StrategyExecutor (전략 실행 레이어)
- DataFetcher (데이터 Fetch 레이어)
- MetricsCalculator (성과 지표 계산 레이어)
- BacktestStorage (결과 저장 레이어)
- FastAPI Router (API 레이어)

📋 **다음 단계:**
- Story 4.1 개발 시작 (폴더 구조 생성)
- Story 4.3: 전략 실행 엔진 구현 (BacktestEngine.run())
- Story 4.4: 성과 지표 계산 (MetricsCalculator)
- Story 4.6: 결과 저장 (BacktestStorage, DB 스키마)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-1-backtest-engine-architecture.md` - This story file

**Backend Files to Create (est. 10 files)**
- `app/backtest/__init__.py` - 🆕 새로 생성 (패키지 초기화, export)
- `app/backtest/engine.py` - 🆕 새로 생성 (BacktestEngine 스켈레톤)
- `app/backtest/executor.py` - 🆕 새로 생성 (StrategyExecutor 스켈레톤)
- `app/backtest/data_fetcher.py` - 🆕 새로 생성 (DataFetcher 스켈레톤)
- `app/backtest/metrics.py` - 🆕 새로 생성 (MetricsCalculator 스켈레톤)
- `app/backtest/storage.py` - 🆕 새로 생성 (BacktestStorage 스켈레톤)
- `app/backtest/api.py` - 🆕 새로 생성 (FastAPI router)
- `app/backtest/README.md` - 🆕 새로 생성 (아키텍처 문서)
- `app/main.py` - ✅ 수정 (router 등록)
- `tests/unit/test_backtest_engine.py` - 🆕 새로 생성 (단위 테스트 스켈레톤)

**Total:** 10 files to create/modify
