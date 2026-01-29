# Story 4.3: 전략 실행 엔진 구현

Status: ready-for-dev

---

## Story

**As a** 백테스팅 엔진 (Backtest Engine),
**I want** 사용자가 정의한 노드 기반 전략을 과거 데이터에 대해 순차적으로 실행하여 거래 시뮬레이션을 수행한다,
**so that** 백테스팅 시뮬레이션을 통해 전략의 수익성을 검증할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1.2에서 백엔드 스타터 템플릿 완료 ✅ (FastAPI, PostgreSQL, Alembic)
- Story 4.1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (폴더 구조, 인터페이스 정의)
- Story 4.2에서 과거 시장 데이터 수집 완료 ✅ (ccxt 기반, market_data 테이블)
- Story 3.2에서 노드 타입 정의 완료 ✅ (전략 JSON 구조, NodeType enum)

**문제:**
- 백테스팅 엔진의 실제 실행 로직이 구현되지 않음
- 노드 기반 전략 JSON을 파싱하고 실행하는 엔진이 없음
- 각 캔들마다 시뮬레이션하는 순회 로직이 없음
- 매수/매도 액션 시뮬레이션(수수료, 슬리피지, 포지션 관리)이 없음

**해결:**
Story 4.1에서 정의한 인터페이스(BacktestEngine, StrategyExecutor)를 실제 구현

**중요:**
- **Story 4.1의 인터페이스 구현**: BacktestEngine.run(), StrategyExecutor.execute_on_candle()
- **Story 4.2의 MarketData 활용**: DataFetcher가 market_data 테이블 조회
- **Story 3.2의 노드 타입 활용**: 노드 그래프 파싱 (TRIGGER, MARKET_DATA, INDICATOR, ACTION, CONDITION, LOOP, RISK_MANAGEMENT)
- **거래 시뮬레이션**: 수수료 0.1%, 슬리피지 0.05% 적용

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 전략 JSON 파싱 및 노드 그래프 변환

**Given** 과거 데이터가 준비되었다
**When** 백테스팅 엔진이 실행된다
**Then** 전략 JSON이 파싱된다
**And** 노드 그래프가 실행 가능한 형태로 변환된다
**And** FR20: 지정된 기간에 대해 순차적으로 실행된다
**And** 각 캔들마다 시뮬레이션이 진행된다

**기술 구현:**
```python
# app/backtest/executor.py (Story 4.1에서 스켈레톤 생성됨)
class StrategyExecutor:
    def __init__(self, strategy_json: Dict[str, Any]):
        self.strategy_json = strategy_json
        self.nodes = []
        self.edges = []

    def parse_strategy(self) -> None:
        """
        전략 JSON을 파싱하여 nodes, edges로 변환

        Story 3.2의 노드 타입 활용:
        - TRIGGER: 시간 기반 트리거
        - MARKET_DATA: 시장 데이터 노드
        - INDICATOR: 기술적 지표 (RSI, MACD, MA)
        - ACTION: 매수/매도 액션
        - CONDITION: If-Then-Else 조건
        - LOOP: For/While 순환
        - RISK_MANAGEMENT: 손절/익절
        """
        # JSON 파싱 로직 구현
        pass
```

### AC 2: 각 노드 타입별 실행 로직 구현

**Given** 전략 실행 엔진이 구현되었다
**When** 전략이 실행된다
**Then** Market Data 노드가 현재 캔들의 데이터를 제공한다
**And** Indicator 노드가 기술적 지표를 계산한다 (RSI, MACD, MA)
**And** Condition 노드가 조건을 평가한다 (If-Then-Else)
**And** Loop 노드가 순환 로직을 처리한다 (For/While)
**And** Action 노드가 매수/매도를 실행한다
**And** Risk Management 노드가 손절/익절을 모니터링한다

**기술 구현:**
```python
# app/backtest/executor.py
def execute_on_candle(
    self,
    candle: Dict[str, Any],
    index: int,
    context: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    단일 캔들에 대해 전략 실행

    Args:
        candle: OHLCV 데이터 (timestamp, open, high, low, close, volume)
        index: 캔들 인덱스
        context: 실행 컨텍스트 (포지션, 현재 자본 등)

    Returns:
        액션 리스트 (예: [{"type": "buy", "amount": 0.1, "price": 50000, "node_id": "action-1"}])

    노드 실행 순서:
    1. TRIGGER 노드: 실행 조건 확인 (시간, 캔들 인덱스)
    2. MARKET_DATA 노드: 현재 캔들 데이터 제공
    3. INDICATOR 노드: 기술적 지표 계산 (이전 캔들 데이터 필요)
    4. CONDITION 노드: 조건 평가 (true/false)
    5. LOOP 노드: 순환 로직 처리
    6. RISK_MANAGEMENT 노드: 손절/익절 모니터링
    7. ACTION 노드: 매수/매도 액션 트리거
    """
    actions = []
    # 노드 그래프 실행 로직 구현
    return actions
```

### AC 3: 백테스팅 엔진 코어 구현 (BacktestEngine.run())

**Given** 전략 실행 엔진이 구현되었다
**When** 백테스팅 엔진이 실행된다
**Then** FR20: 지정된 기간에 대해 순차적으로 실행된다
**And** 각 캔들마다 시뮬레이션이 진행된다

**기술 구현:**
```python
# app/backtest/engine.py (Story 4.1에서 스켈레톤 생성됨)
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd

class BacktestEngine:
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
                    "metrics": {...},  # Story 4.4에서 MetricsCalculator.calculate_all_metrics()
                    "trades": [...],
                    "equity_curve": [...]
                }

        Raises:
            ValueError: 데이터 부족, 전략 오류
            Exception: 백테스트 실행 실패

        실행 흐름:
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

### AC 4: 매수/매도 액션 시뮬레이션 (수수료, 슬리피지, 포지션 관리)

**Given** 전략 실행 중 매수/매도가 발생한다
**When** Buy/Sell 액션이 실행된다
**Then** FR20: 초기 자본이 고려된다
**And** 수수료가 계산된다 (0.1%)
**And** 슬리피지가 시뮬레이션된다 (0.05%)
**And** 포지션이 업데이트된다
**And** FR22: 모든 거래가 기록된다

**기술 구현:**
```python
# app/backtest/engine.py
def _handle_buy_action(self, action: Dict[str, Any]) -> None:
    """
    매수 액션 처리

    - 수수료 계산 (0.1%)
    - 슬리피지 적용 (0.05%)
    - 포지션 업데이트
    - 거래 기록

    Args:
        action: {"type": "buy", "amount": 0.1, "price": 50000, "node_id": "action-1"}
    """
    commission = action["amount"] * action["price"] * self.config["commission"]
    slippage = action["price"] * self.config["slippage"]
    total_cost = action["amount"] * action["price"] + commission + slippage

    if total_cost > self.current_capital:
        raise ValueError("Insufficient capital")

    # 포지션 업데이트
    symbol = self.config["symbol"]
    if symbol not in self.position:
        self.position[symbol] = {"quantity": 0, "avg_price": 0}

    old_quantity = self.position[symbol]["quantity"]
    old_avg_price = self.position[symbol]["avg_price"]

    # 평균 단가 재계산
    new_quantity = old_quantity + action["amount"]
    new_avg_price = ((old_quantity * old_avg_price) + (action["amount"] * action["price"])) / new_quantity

    self.position[symbol] = {"quantity": new_quantity, "avg_price": new_avg_price}
    self.current_capital -= total_cost

    # 거래 기록
    self.trades.append({
        "timestamp": action["timestamp"],
        "type": "BUY",
        "price": action["price"],
        "quantity": action["amount"],
        "commission": commission,
        "slippage": slippage,
        "node_id": action["node_id"]
    })

def _handle_sell_action(self, action: Dict[str, Any]) -> None:
    """
    매도 액션 처리

    - 수수료 계산
    - 슬리피지 적용
    - 포지션 종료
    - 거래 기록
    - PnL 계산
    """
    pass

def _update_equity_curve(self, timestamp: int) -> None:
    """
    자본 곡선 업데이트

    현재 자본 = 현금 + 포지션 평가가

    Args:
        timestamp: 현재 캔들 타임스탬프
    """
    pass
```

### AC 5: DataFetcher로 시장 데이터 로드 (Story 4.2 활용)

**Given** Story 4.2에서 market_data 테이블이 생성되었다
**When** DataFetcher.fetch_data()가 호출된다
**Then** market_data 테이블에서 데이터가 조회된다
**And** DataFrame으로 변환된다
**And** 데이터 갭(Gap) 감지 및 경고가 표시된다

**기술 구현:**
```python
# app/backtest/data_fetcher.py (Story 4.1에서 스켈레톤 생성됨)
from datetime import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from pandas import DataFrame
from app.models.market_data import MarketData

class DataFetcher:
    """
    데이터 Fetch 레이어 (Data Fetch Layer)

    역할:
    - DB에서 과거 시장 데이터 조회 (market_data 테이블)
    - DataFrame 형태로 변환
    - 데이터 갭(Gap) 감지

    의존성:
    - MarketData 모델 (Story 4.2)
    - SQLAlchemy AsyncSession

    Story 4.2의 MarketDataService 활용
    """

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
        # Story 4.2의 market_data 테이블 조회
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

### AC 6: 포지션 관리 및 거래 기록

**Given** 백테스팅 엔진이 실행된다
**When** 매수/매도가 발생한다
**Then** 포지션이 업데이트된다
**And** FR22: 모든 거래가 기록된다
**And** 자본 곡선이 업데이트된다

**기술 구현:**
```python
# BacktestEngine의 포지션 관리
self.position = {
    "BTCUSDT": {
        "quantity": 0.5,  # 보유 수량
        "avg_price": 50000  # 평균 단가
    }
}

# 거래 기록 형식
self.trades = [
    {
        "timestamp": 1640995200000,
        "type": "BUY",
        "price": 50000,
        "quantity": 0.1,
        "commission": 5.0,
        "slippage": 2.5,
        "node_id": "action-1"
    }
]
```

### AC 7: 백테스트 결과 반환

**Given** 백테스팅이 완료되었다
**When** 결과가 계산된다
**Then** 다음 정보가 반환된다:
- 성과 지표 (ROI, MDD, 승률 등) - Story 4.4의 MetricsCalculator
- 거래 내역 (FR22)
- 자본 곡선

**기술 구현:**
```python
# BacktestEngine.run() 반환 값
return {
    "backtest_id": backtest_id,
    "metrics": metrics,  # MetricsCalculator.calculate_all_metrics()
    "trades": self.trades,
    "equity_curve": self.equity_curve
}
```

---

## Tasks / Subtasks

### Task 1: StrategyExecutor 구현 (AC: #1, #2)
- [ ] Subtask 1.1: `parse_strategy()` 메서드 구현 (JSON 파싱, 노드/엣지 추출)
- [ ] Subtask 1.2: 노드 그래프 실행 순서 정의 (위상 정렬, 의존성 해결)
- [ ] Subtask 1.3: TRIGGER 노드 실행 로직 구현 (시간 기반 트리거)
- [ ] Subtask 1.4: MARKET_DATA 노드 실행 로직 구현 (현재 캔들 데이터 제공)
- [ ] Subtask 1.5: INDICATOR 노드 실행 로직 구현 (RSI, MACD, MA 계산)
- [ ] Subtask 1.6: CONDITION 노드 실행 로직 구현 (If-Then-Else)
- [ ] Subtask 1.7: LOOP 노드 실행 로직 구현 (For/While)
- [ ] Subtask 1.8: RISK_MANAGEMENT 노드 실행 로직 구현 (손절/익절 모니터링)
- [ ] Subtask 1.9: ACTION 노드 실행 로직 구현 (매수/매도 액션 트리거)
- [ ] Subtask 1.10: `execute_on_candle()` 메서드 통합 테스트

### Task 2: BacktestEngine 코어 구현 (AC: #3, #7)
- [ ] Subtask 2.1: `__init__()` 메서드 구현 (초기 자본, 포지션, 거래 기록 초기화)
- [ ] Subtask 2.2: `run()` 메서드 구현 (백테스트 실행 오케스트레이션)
- [ ] Subtask 2.3: DataFetcher와 연동 (시장 데이터 로드)
- [ ] Subtask 2.4: StrategyExecutor와 연동 (전략 파싱, 실행)
- [ ] Subtask 2.5: 캔들 순회 루프 구현 (for i, candle in data.iterrows())
- [ ] Subtask 2.6: MetricsCalculator와 연동 (성과 지표 계산)
- [ ] Subtask 2.7: 결과 반환 딕셔너리 구현

### Task 3: DataFetcher 구현 (AC: #5)
- [ ] Subtask 3.1: `fetch_data()` 메서드 구현 (market_data 테이블 조회)
- [ ] Subtask 3.2: SQLAlchemy AsyncSession으로 쿼리 실행
- [ ] Subtask 3.3: pandas DataFrame으로 변환
- [ ] Subtask 3.4: `detect_gaps()` 메서드 구현 (데이터 갭 감지)
- [ ] Subtask 3.5: Story 4.2의 idx_market_data_lookup 인덱스 활용

### Task 4: 매수/매도 액션 시뮬레이션 (AC: #4, #6)
- [ ] Subtask 4.1: `_handle_buy_action()` 메서드 구현
- [ ] Subtask 4.2: 수수료 계산 (0.1%)
- [ ] Subtask 4.3: 슬리피지 적용 (0.05%)
- [ ] Subtask 4.4: 포지션 업데이트 (수량, 평균 단가)
- [ ] Subtask 4.5: `_handle_sell_action()` 메서드 구현
- [ ] Subtask 4.6: 포지션 종료
- [ ] Subtask 4.7: PnL 계산 (실현 손익)
- [ ] Subtask 4.8: `_update_equity_curve()` 메서드 구현

### Task 5: 단위 테스트 작성
- [ ] Subtask 5.1: `tests/unit/test_backtest_engine.py` 생성
- [ ] Subtask 5.2: BacktestEngine 초기화 테스트
- [ ] Subtask 5.3: DataFetcher.fetch_data() 테스트 (Mock DB)
- [ ] Subtask 5.4: StrategyExecutor.execute_on_candle() 테스트 (Mock 노드)
- [ ] Subtask 5.5: 매수/매도 액션 시뮬레이션 테스트
- [ ] Subtask 5.6: 포지션 관리 테스트
- [ ] Subtask 5.7: pytest 실행 및 커버리지 확인 (> 80%)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스팅 엔진의 실제 실행 로직을 구현**합니다. 완료되면:
- **BacktestEngine.run()**: 백테스트 실행 오케스트레이션
- **StrategyExecutor**: 노드 기반 전략 JSON 파싱 및 실행
- **DataFetcher**: Story 4.2의 market_data 테이블 활용
- **거래 시뮬레이션**: 수수료 0.1%, 슬리피지 0.05%, 포지션 관리
- **FR20, FR22 만족**: 지정된 기간 순차 실행, 모든 거래 기록

### 📚 Story 4.1 (백테스팅 엔진 아키텍처)에서 배운 패턴

**계층형 아키텍처** [Source: 4-1-backtest-engine-architecture.md]:
```
API Layer (FastAPI Router)
    ↓
Core Engine Layer (BacktestEngine)
    ↓
Data Layer (DataFetcher) → Story 4.2의 MarketData
Execution Layer (StrategyExecutor) → Story 3.2의 노드 타입
Metrics Layer (MetricsCalculator) → Story 4.4
Storage Layer (BacktestStorage) → Story 4.6
```

**백테스팅 엔진 실행 흐름**:
```
1. 사용자 → POST /api/v1/backtest/run
2. API Layer → BacktestEngine 초기화
3. BacktestEngine.run():
   a. DataFetcher.fetch_data() (market_data 테이블 조회)
   b. StrategyExecutor.parse_strategy() (전략 JSON 파싱)
   c. For each candle:
      - StrategyExecutor.execute_on_candle()
      - 액션 발생 → _handle_buy/sell_action()
      - 포지션 업데이트, 거래 기록
      - _update_equity_curve()
   d. MetricsCalculator.calculate_all_metrics()
   e. BacktestStorage.save_result()
4. 사용자 → GET /api/v1/backtest/results/{id}
```

### 📚 Story 4.2 (과거 시장 데이터)에서 배운 패턴

**MarketData 모델 활용** [Source: 4-2-historical-market-data.md]:
```python
# Story 4.2의 market_data 테이블 스키마
class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(BigInteger, primary_key=True)
    exchange = Column(String(20), nullable=False)
    symbol = Column(String(20), nullable=False)
    timeframe = Column(String(10), nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    open = Column(DECIMAL(20, 8), nullable=False)
    high = Column(DECIMAL(20, 8), nullable=False)
    low = Column(DECIMAL(20, 8), nullable=False)
    close = Column(DECIMAL(20, 8), nullable=False)
    volume = Column(DECIMAL(30, 8), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_market_data_lookup', 'exchange', 'symbol', 'timeframe', 'timestamp', unique=True),
    )
```

**DataFetcher 구현 패턴**:
```python
# Story 4.2의 get_data_from_db() 메서드 활용
async def fetch_data(self, symbol, timeframe, start_date, end_date, exchange="binance") -> DataFrame:
    """
    Story 4.2의 MarketData 모델 활용

    1. market_data 테이블 조회
    2. DataFrame으로 변환
    3. 인덱스 활용 (idx_market_data_lookup)
    """
    query = select(MarketData).where(
        MarketData.exchange == exchange,
        MarketData.symbol == symbol,
        MarketData.timeframe == timeframe,
        MarketData.timestamp >= start_ts,
        MarketData.timestamp <= end_ts
    ).order_by(MarketData.timestamp)

    result = await self.db.execute(query)
    data = result.scalars().all()

    # DataFrame 변환
    df = pd.DataFrame([{
        "timestamp": d.timestamp,
        "open": float(d.open),
        "high": float(d.high),
        "low": float(d.low),
        "close": float(d.close),
        "volume": float(d.volume)
    } for d in data])

    df.set_index("timestamp", inplace=True)
    return df
```

### 📚 Story 3.2 (노드 타입 정의)에서 배운 패턴

**NodeType enum** [Source: 3-2-node-type-definitions.md]:
```typescript
export enum NodeType {
  TRIGGER = "TRIGGER",
  MARKET_DATA = "MARKET_DATA",
  INDICATOR = "INDICATOR",
  ACTION = "ACTION",
  CONDITION = "CONDITION",
  LOOP = "LOOP",
  RISK_MANAGEMENT = "RISK_MANAGEMENT"
}
```

**전략 JSON 구조**:
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "MARKET_DATA",
      "data": {"symbol": "BTCUSDT", "timeframe": "1h"}
    },
    {
      "id": "node-2",
      "type": "INDICATOR",
      "data": {"indicator": "RSI", "period": 14}
    },
    {
      "id": "node-3",
      "type": "ACTION",
      "data": {"action": "BUY", "amount": 0.1}
    }
  ],
  "edges": [
    {"source": "node-1", "target": "node-2"},
    {"source": "node-2", "target": "node-3"}
  ]
}
```

### 🏗️ 핵심 구현 전략

**1. 전략 파싱 (parse_strategy)**
```python
def parse_strategy(self) -> None:
    """
    전략 JSON 파싱

    1. JSON 유효성 검증
    2. nodes, edges 추출
    3. 노드 타입 검증 (Story 3.2의 NodeType enum)
    4. 순환 참조 감지 (Loop 노드 제외)
    """
    strategy = self.strategy_json

    # JSON 유효성 검증
    if "nodes" not in strategy or "edges" not in strategy:
        raise ValueError("Invalid strategy JSON: missing 'nodes' or 'edges'")

    # 노드 파싱
    self.nodes = strategy["nodes"]
    self.edges = strategy["edges"]

    # 노드 타입 검증
    valid_types = ["TRIGGER", "MARKET_DATA", "INDICATOR", "ACTION", "CONDITION", "LOOP", "RISK_MANAGEMENT"]
    for node in self.nodes:
        if node["type"] not in valid_types:
            raise ValueError(f"Invalid node type: {node['type']}")
```

**2. 캔들 순회 실행**
```python
async def run(self) -> Dict[str, Any]:
    """
    백테스트 실행
    """
    # 1. 시장 데이터 로드
    data_fetcher = DataFetcher(self.db)
    df = await data_fetcher.fetch_data(
        symbol=self.config["symbol"],
        timeframe=self.config["timeframe"],
        start_date=self.config["start_date"],
        end_date=self.config["end_date"],
        exchange="binance"
    )

    # 2. 전략 파싱
    executor = StrategyExecutor(self.strategy_json)
    executor.parse_strategy()

    # 3. 캔들 순회
    context = {
        "position": {},
        "capital": self.current_capital,
        "trades": []
    }

    for i, (timestamp, row) in enumerate(df.iterrows()):
        candle = {
            "timestamp": timestamp,
            "open": row["open"],
            "high": row["high"],
            "low": row["low"],
            "close": row["close"],
            "volume": row["volume"]
        }

        # 노드 실행
        actions = executor.execute_on_candle(candle, i, context)

        # 액션 처리
        for action in actions:
            if action["type"] == "buy":
                self._handle_buy_action(action)
            elif action["type"] == "sell":
                self._handle_sell_action(action)

        # 자본 곡선 업데이트
        self._update_equity_curve(timestamp)

    # 4. 성과 지표 계산 (Story 4.4)
    # metrics_calculator = MetricsCalculator()
    # metrics = metrics_calculator.calculate_all_metrics(self.trades, self.initial_capital, self.equity_curve)

    return {
        "trades": self.trades,
        "equity_curve": self.equity_curve
    }
```

**3. 수수료 및 슬리피지 계산**
```python
# 수수료: 0.1%
commission = amount * price * 0.001

# 슬리피지: 0.05%
slippage = price * 0.0005

# 총 비용
total_cost = (amount * price) + commission + slippage
```

### 📊 성능 최적화 (Story 4.1의 최적화 계획 참고)

**NFR14: 백테스트 1회 실행 < 2분** [Source: 4-1-check-passed]

**최적화 기법:**
1. **데이터 로딩**: < 5초 (Story 4.2의 Chunked loading 활용)
2. **전략 실행**: < 90초 (Python 순차 실행, 캔들마다 노드 그래프 실행)
3. **지표 계산**: < 10초 (pandas/numpy)
4. **결과 저장**: < 5초 (Story 4.6에서 Bulk insert)

**최적화 전략:**
- **캐싱**: 지표 계산 결과 캐싱 (복잡한 지표 재사용)
- **메모리 관리**: Generator pattern 사용 (전체 DataFrame을 메모리에 올리지 않음)
- **인덱스 활용**: Story 4.2의 idx_market_data_lookup 인덱스 활용

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL)
- ✅ Story 4.1: 백테스팅 엔진 아키텍처 설계 (인터페이스 정의)
- ✅ Story 4.2: 과거 시장 데이터 가져오기 (market_data 테이블)
- ✅ Story 3.2: 노드 타입 정의 (NodeType enum, 전략 JSON 구조)

**후속 Stories (이 Story의 결과 활용):**
- Story 4.4: 성과 지표 계산 (MetricsCalculator 구현, BacktestEngine.run()에서 호출)
- Story 4.5: 거래 내역 추적 (self.trades 활용)
- Story 4.6: 백테스트 결과 저장 (BacktestStorage.save_result() 구현)

**파일 생성/수정 목록:**
1. `app/backtest/engine.py` - BacktestEngine.run() 구현
2. `app/backtest/executor.py` - StrategyExecutor.execute_on_candle() 구현
3. `app/backtest/data_fetcher.py` - DataFetcher.fetch_data() 구현
4. `tests/unit/test_backtest_engine.py` - 단위 테스트

### ⚠️ 중요 고려사항

**1. 구현 범위:**
- ✅ BacktestEngine.run() 전체 실행 흐름 구현
- ✅ StrategyExecutor: 노드 그래프 파싱 및 실행
- ✅ DataFetcher: Story 4.2의 market_data 테이블 활용
- ✅ 매수/매도 액션 시뮬레이션 (수수료, 슬리피지, 포지션 관리)
- ❌ MetricsCalculator: Story 4.4에서 구현 (이 Story에서는 stub만)
- ❌ BacktestStorage: Story 4.6에서 구현 (이 Story에서는 stub만)

**2. Story 4.1의 인터페이스 준수:**
- Story 4.1에서 정의한 메서드 시그니처 정확히 따름
- Story 4.1의 Docstring 참고 (역할, 의존성, 파라미터, 반환값)

**3. Story 4.2의 MarketData 활용:**
- market_data 테이블 조회 (idx_market_data_lookup 인덱스 활용)
- Story 4.2의 MarketDataService 참고 (데이터 fetch 패턴)

**4. Story 3.2의 노드 타입 활용:**
- NodeType enum: TRIGGER, MARKET_DATA, INDICATOR, ACTION, CONDITION, LOOP, RISK_MANAGEMENT
- 전략 JSON 구조: nodes[], edges[]

**5. 에러 처리:**
- 전략 JSON 유효성 검증
- 데이터 부족 시 ValueError
- 포지션 부족 시 ValueError
- 노드 실행 실패 시 명확한 에러 메시지

**6. 테스트:**
- 단위 테스트: BacktestEngine, StrategyExecutor, DataFetcher
- Mock 사용: DB 조회 Mock, 노드 실행 Mock
- 커버리지 > 80% 목표

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.3 요구사항 분석 (epics.md)
2. Story 4.1 아키텍처 문서 분석 (백테스팅 엔진 계층 구조)
3. Story 4.2 시장 데이터 문서 분석 (MarketData 모델, ccxt 활용)
4. Story 3.2 노드 타입 분석 (NodeType enum, 전략 JSON 구조)
5. 7개 AC 정의 (전략 파싱, 노드 실행, 액션 시뮬레이션, 포지션 관리)
6. 5개 Task/41개 Subtask 정의
7. Dev Notes 작성 (아키텍처 패턴, 구현 전략, 성능 최적화)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- BacktestEngine.run(): 백테스트 실행 오케스트레이션
- StrategyExecutor.execute_on_candle(): 노드 그래프 실행
- DataFetcher.fetch_data(): Story 4.2의 market_data 테이블 활용
- 거래 시뮬레이션: 수수료 0.1%, 슬리피지 0.05%, 포지션 관리
- FR20, FR22 만족

📋 **다음 단계:**
- Story 4.3 개발 시작 (백테스팅 엔진 실제 구현)
- Story 4.4: 성과 지표 계산 (MetricsCalculator)
- Story 4.6: 결과 저장 (BacktestStorage, DB 스키마)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-3-strategy-execution-engine.md` - This story file

**Backend Files to Create/Modify (est. 4 files)**
- `app/backtest/engine.py` - ✅ 수정 (BacktestEngine.run() 구현, _handle_buy/sell_action() 구현)
- `app/backtest/executor.py` - ✅ 수정 (StrategyExecutor.execute_on_candle() 구현)
- `app/backtest/data_fetcher.py` - ✅ 수정 (DataFetcher.fetch_data() 구현)
- `tests/unit/test_backtest_engine.py` - 🆕 새로 생성 (단위 테스트)

**Total:** 4 files to create/modify
