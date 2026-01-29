# Story 4.6: 백테스트 결과 저장 및 불러오기 (Backtest Results Storage)

Status: ready-for-dev

---

## Story

**As a** 백테스팅 엔진 (Backtest Engine),
**I want** 백테스트 결과를 데이터베이스에 저장하고 나중에 다시 불러와서 이전 결과와 비교하고 싶다,
**so that** 사용자가 과거 백테스트 기록을 조회하고 결과를 비교 분석할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1.2에서 백엔드 스타터 템플릿 완료 ✅ (FastAPI, PostgreSQL, Alembic)
- Story 4.1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (BacktestStorage 인터페이스 정의)
- Story 4.3에서 전략 실행 엔진 구현 예정 ✅ (BacktestEngine.run() 결과 생성)
- Story 4.4에서 성과 지표 계산 예정 ✅ (MetricsCalculator 결과)
- Story 4.5에서 거래 내역 추적 예정 ✅ (self.trades 확장)
- Story 4.2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블)

**문제:**
- 백테스트 결과를 저장하는 DB 스키마가 없음
- 백테스트 기록을 조회하는 API 엔드포인트가 없음
- 결과를 저장하고 불러오는 BacktestStorage가 미구현 상태

**해결:**
backtest_results, backtest_trades 테이블 생성 및 BacktestStorage 구현

**중요:**
- **Story 4.1의 BacktestStorage 인터페이스 구현**: save_result(), get_result(), list_user_results()
- **FR24 커버**: 백테스트 결과 DB 저장, 조회, 목록 표시
- **DB 스키마 설계**: backtest_results, backtest_trades 테이블
- **Alembic migration**: 데이터베이스 스키마 버전 관리

---

## 수용 기준 (Acceptance Criteria)

### AC 1: backtest_results 테이블 생성

**Given** 백엔드 스타터 템플릿이 설정되었다 (Story 1.2)
**When** 개발자가 Alembic migration을 생성한다
**Then** `backtest_results` 테이블이 생성된다

**기술 구현:**
```sql
-- alembic/versions/XXX_create_backtest_results_table.py

CREATE TABLE backtest_results (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    strategy_id VARCHAR(50) NOT NULL,
    strategy_name VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    initial_capital DECIMAL(20, 8) NOT NULL,
    final_capital DECIMAL(20, 8) NOT NULL,
    roi DECIMAL(10, 4),
    mdd DECIMAL(10, 4),
    win_rate DECIMAL(10, 4),
    sharpe_ratio DECIMAL(10, 4),
    total_trades INTEGER,
    execution_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'completed',  -- pending, running, completed, failed
    created_at TIMESTAMP DEFAULT NOW(),
    strategy_json JSONB,      -- 전략 스냅샷 (nodes, edges)
    metrics_json JSONB        -- 모든 성과 지표 (equity_curve 포함)
);

CREATE INDEX idx_backtest_user_results ON backtest_results(user_id, created_at DESC);
CREATE INDEX idx_backtest_strategy_results ON backtest_results(strategy_id, created_at DESC);
```

### AC 2: backtest_trades 테이블 생성

**Given** backtest_results 테이블이 생성되었다
**When** 개발자가 Alembic migration을 생성한다
**Then** `backtest_trades` 테이블이 생성된다

**기술 구현:**
```sql
-- alembic/versions/XXX_create_backtest_trades_table.py

CREATE TABLE backtest_trades (
    id SERIAL PRIMARY KEY,
    backtest_id INTEGER NOT NULL REFERENCES backtest_results(id) ON DELETE CASCADE,
    timestamp BIGINT NOT NULL,
    trade_type VARCHAR(10) NOT NULL,  -- BUY/SELL
    price DECIMAL(20, 8) NOT NULL,
    quantity DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) NOT NULL,  -- commission
    position_size DECIMAL(20, 8) NOT NULL,
    pnl DECIMAL(20, 8),
    node_id VARCHAR(50),
    market_data JSONB,  -- 당시 시장 데이터 스냅샷 (OHLCV)
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_backtest_trades_query ON backtest_trades(backtest_id, timestamp);
CREATE INDEX idx_backtest_trades_type ON backtest_trades(backtest_id, trade_type);
```

### AC 3: BacktestResult SQLAlchemy 모델 구현

**Given** backtest_results 테이블이 생성되었다
**When** 개발자가 `app/models/backtest.py`를 생성한다
**Then** SQLAlchemy 모델이 구현된다

**기술 구현:**
```python
# app/models/backtest.py
from sqlalchemy import Column, Integer, BigInteger, String, DECIMAL, Date, DateTime, Text, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import List, Optional


class BacktestResult(Base):
    """
    Backtest Result Model

    백테스트 실행 결과를 저장하는 모델

    Attributes:
        id: Primary key
        user_id: 사용자 지갑 주소 (Web3 wallet address)
        strategy_id: 전략 ID
        strategy_name: 전략 이름
        start_date: 백테스트 시작일
        end_date: 백테스트 종료일
        initial_capital: 초기 자본
        final_capital: 최종 자본
        roi: 총 수익률 (%)
        mdd: 최대 낙폭 (%)
        win_rate: 승률 (%)
        sharpe_ratio: 샤프 비율
        total_trades: 총 거래 횟수
        execution_time_ms: 실행 시간 (밀리초)
        status: 상태 (pending, running, completed, failed)
        created_at: 생성 일시
        strategy_json: 전략 스냅샷 (JSON)
        metrics_json: 성과 지표 (JSON)
    """
    __tablename__ = "backtest_results"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # User & Strategy
    user_id = Column(String(50), nullable=False, index=True)
    strategy_id = Column(String(50), nullable=False, index=True)
    strategy_name = Column(String(200))

    # Date Range
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    # Capital & Performance
    initial_capital = Column(DECIMAL(20, 8), nullable=False)
    final_capital = Column(DECIMAL(20, 8), nullable=False)
    roi = Column(DECIMAL(10, 4))
    mdd = Column(DECIMAL(10, 4))
    win_rate = Column(DECIMAL(10, 4))
    sharpe_ratio = Column(DECIMAL(10, 4))
    total_trades = Column(Integer)

    # Execution
    execution_time_ms = Column(Integer)
    status = Column(String(20), default="completed", nullable=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # JSON Columns (PostgreSQL JSONB)
    strategy_json = Column(Text)  # JSON stored as TEXT (PostgreSQL JSONB requires sqlalchemy.dialects.postgresql.JSONB)
    metrics_json = Column(Text)  # JSON stored as TEXT

    # Relationships
    trades = relationship("BacktestTrade", back_populates="backtest_result", cascade="all, delete-orphan")

    # Table constraints and indexes
    __table_args__ = (
        Index('idx_backtest_user_results', 'user_id', 'created_at'),
        Index('idx_backtest_strategy_results', 'strategy_id', 'created_at'),
    )

    def __repr__(self) -> str:
        return f"<BacktestResult(id={self.id}, user_id='{self.user_id}', strategy_id='{self.strategy_id}', roi={float(self.roai) if self.roi else 0}%)>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "strategy_id": self.strategy_id,
            "strategy_name": self.strategy_name,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "initial_capital": float(self.initial_capital) if self.initial_capital else None,
            "final_capital": float(self.final_capital) if self.final_capital else None,
            "roi": float(self.roi) if self.roi else None,
            "mdd": float(self.mdd) if self.mdd else None,
            "win_rate": float(self.win_rate) if self.win_rate else None,
            "sharpe_ratio": float(self.sharpe_ratio) if self.sharpe_ratio else None,
            "total_trades": self.total_trades,
            "execution_time_ms": self.execution_time_ms,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            # JSON parsing needed for strategy_json, metrics_json
        }
```

### AC 4: BacktestTrade SQLAlchemy 모델 구현

**Given** backtest_trades 테이블이 생성되었다
**When** 개발자가 `app/models/backtest.py`에 추가한다
**Then** SQLAlchemy 모델이 구현된다

**기술 구현:**
```python
# app/models/backtest.py (continued)

class BacktestTrade(Base):
    """
    Backtest Trade Model

    백테스트 중 발생한 개별 거래를 저장하는 모델

    Attributes:
        id: Primary key
        backtest_id: 백테스트 결과 ID (FK)
        timestamp: 거래 타임스탬프 (밀리초)
        trade_type: 거래 유형 (BUY/SELL)
        price: 거래 가격
        quantity: 거래 수량
        fee: 수수료
        position_size: 포지션 사이즈
        pnl: 실현 손익
        node_id: 거래를 유발한 노드 ID
        market_data: 시장 데이터 스냅샷 (JSON)
        created_at: 생성 일시
    """
    __tablename__ = "backtest_trades"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign Key
    backtest_id = Column(Integer, ForeignKey('backtest_results.id', ondelete='CASCADE'), nullable=False)

    # Trade Data
    timestamp = Column(BigInteger, nullable=False)
    trade_type = Column(String(10), nullable=False)  # BUY/SELL
    price = Column(DECIMAL(20, 8), nullable=False)
    quantity = Column(DECIMAL(20, 8), nullable=False)
    fee = Column(DECIMAL(20, 8), nullable=False)  # commission
    position_size = Column(DECIMAL(20, 8), nullable=False)
    pnl = Column(DECIMAL(20, 8))

    # Metadata
    node_id = Column(String(50))
    market_data = Column(Text)  # JSON stored as TEXT
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    backtest_result = relationship("BacktestResult", back_populates="trades")

    # Table constraints and indexes
    __table_args__ = (
        Index('idx_backtest_trades_query', 'backtest_id', 'timestamp'),
        Index('idx_backtest_trades_type', 'backtest_id', 'trade_type'),
    )

    def __repr__(self) -> str:
        return f"<BacktestTrade(id={self.id}, backtest_id={self.backtest_id}, type='{self.trade_type}', price={float(self.price)})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "backtest_id": self.backtest_id,
            "timestamp": self.timestamp,
            "trade_type": self.trade_type,
            "price": float(self.price),
            "quantity": float(self.quantity),
            "fee": float(self.fee),
            "position_size": float(self.position_size),
            "pnl": float(self.pnl) if self.pnl else None,
            "node_id": self.node_id,
            # JSON parsing needed for market_data
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
```

### AC 5: BacktestStorage.save_result() 구현 (FR24)

**Given** BacktestStorage 인터페이스가 정의되었다 (Story 4.1)
**When** 개발자가 save_result() 메서드를 구현한다
**Then** FR24: 백테스트 결과가 데이터베이스에 저장된다
**And** 다음 정보가 포함된다:
  - 전략 ID
  - 실행 기간
  - 초기 자본
  - 성과 지표 (ROI, MDD, 승률 등)
  - 모든 거래 내역
  - 실행 시간
  - 실행자 (사용자 ID)

**기술 구현:**
```python
# app/backtest/storage.py
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.backtest import BacktestResult, BacktestTrade
import json

class BacktestStorage:
    """
    결과 저장 레이어 (Storage Layer)

    역할:
    - 백테스트 결과를 DB에 저장 (backtest_results 테이블)
    - 거래 내역 저장 (backtest_trades 테이블)
    - 결과 조회 및 삭제
    - 사용자별 백테스트 기록 조회

    의존성:
    - BacktestResult 모델
    - BacktestTrade 모델
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_result(
        self,
        user_id: str,
        strategy_id: str,
        strategy_name: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        trades: List[Dict[str, Any]]
    ) -> int:
        """
        백테스트 결과 저장

        Args:
            user_id: 사용자 지갑 주소
            strategy_id: 전략 ID
            strategy_name: 전략 이름
            config: 백테스트 설정 (기간, 초기 자본 등)
            result: 성과 지표 (ROI, MDD, 승률 등)
            trades: 거래 내역

        Returns:
            backtest_id (PK)
        """
        # 1. BacktestResult 생성
        backtest_result = BacktestResult(
            user_id=user_id,
            strategy_id=strategy_id,
            strategy_name=strategy_name,
            start_date=config["start_date"],
            end_date=config["end_date"],
            initial_capital=config["initial_capital"],
            final_capital=result["final_capital"],
            roi=result["roi"],
            mdd=result["mdd"],
            win_rate=result["win_rate"],
            sharpe_ratio=result.get("sharpe_ratio"),
            total_trades=result["total_trades"],
            execution_time_ms=result.get("execution_time_ms", 0),
            status="completed",
            strategy_json=json.dumps(config.get("strategy_json", {})),
            metrics_json=json.dumps({
                "equity_curve": result.get("equity_curve", []),
                "avg_holding_period": result.get("avg_holding_period")
            })
        )

        self.db.add(backtest_result)
        await self.db.flush()  # backtest_id 할당을 위해 flush

        # 2. BacktestTrade 대량 생성 (bulk insert)
        trade_objects = [
            BacktestTrade(
                backtest_id=backtest_result.id,
                timestamp=trade["timestamp"],
                trade_type=trade["type"],
                price=trade["price"],
                quantity=trade["quantity"],
                fee=trade.get("commission", 0),
                position_size=trade.get("position_size", 0),
                pnl=trade.get("pnl", 0),
                node_id=trade.get("node_id", ""),
                market_data=json.dumps(trade.get("market_data", {}))
            )
            for trade in trades
        ]

        self.db.add_all(trade_objects)
        await self.db.commit()

        return backtest_result.id
```

### AC 6: BacktestStorage.get_result() 구현 (FR24)

**Given** 저장된 백테스트 결과가 있다
**When** 사용자가 특정 결과를 선택한다
**Then** FR24: 상세 결과가 불러와진다
**And** 모든 성과 지표가 복원된다
**And** 거래 내역이 표시된다
**And** NFR6: API 응답시간 < 200ms가 만족된다

**기술 구현:**
```python
async def get_result(self, backtest_id: int) -> Dict[str, Any]:
    """
    백테스트 결과 조회

    Args:
        backtest_id: 백테스트 ID

    Returns:
        결과 딕셔너리 (성과 지표 + 거래 내역)

    Raises:
        ValueError: 백테스트 결과가 없을 때
    """
    # 1. BacktestResult 조회
    query = select(BacktestResult).where(BacktestResult.id == backtest_id)
    result = await self.db.execute(query)
    backtest_result = result.scalar_one_or_none()

    if not backtest_result:
        raise ValueError(f"Backtest result {backtest_id} not found")

    # 2. BacktestTrade 조회
    query = select(BacktestTrade).where(
        BacktestTrade.backtest_id == backtest_id
    ).order_by(BacktestTrade.timestamp)

    result = await self.db.execute(query)
    trades = result.scalars().all()

    # 3. 결과 조립
    return {
        "id": backtest_result.id,
        "user_id": backtest_result.user_id,
        "strategy_id": backtest_result.strategy_id,
        "strategy_name": backtest_result.strategy_name,
        "start_date": backtest_result.start_date.isoformat(),
        "end_date": backtest_result.end_date.isoformat(),
        "initial_capital": float(backtest_result.initial_capital),
        "final_capital": float(backtest_result.final_capital),
        "roi": float(backtest_result.roi) if backtest_result.roi else None,
        "mdd": float(backtest_result.mdd) if backtest_result.mdd else None,
        "win_rate": float(backtest_result.win_rate) if backtest_result.win_rate else None,
        "sharpe_ratio": float(backtest_result.sharpe_ratio) if backtest_result.sharpe_ratio else None,
        "total_trades": backtest_result.total_trades,
        "execution_time_ms": backtest_result.execution_time_ms,
        "status": backtest_result.status,
        "created_at": backtest_result.created_at.isoformat(),
        "strategy_json": json.loads(backtest_result.strategy_json) if backtest_result.strategy_json else {},
        "metrics_json": json.loads(backtest_result.metrics_json) if backtest_result.metrics_json else {},
        "trades": [trade.to_dict() for trade in trades]
    }
```

### AC 7: BacktestStorage.list_user_results() 구현 (FR24)

**Given** 백테스트 결과가 저장되었다
**When** 사용자가 "내 백테스트" 페이지를 연다
**Then** FR24: 모든 저장된 결과가 목록으로 표시된다
**And** 각 결과의 요약 정보가 표시된다 (전략명, 기간, ROI, 실행일)
**And** 최신 순으로 정렬된다
**And** 검색과 필터링이 지원된다 (전략별, 기간별)
**And** 페이지네이션이 지원된다 (limit, offset)

**기술 구현:**
```python
async def list_user_results(
    self,
    user_id: str,
    limit: int = 20,
    offset: int = 0,
    strategy_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    사용자의 백테스트 기록 조회

    Args:
        user_id: 사용자 지갑 주소
        limit: 반환 개수
        offset: 오프셋
        strategy_id: 전략 ID 필터 (선택사항)
        start_date: 시작일 필터 (선택사항)
        end_date: 종료일 필터 (선택사항)

    Returns:
        백테스트 결과 리스트
    """
    query = select(BacktestResult).where(BacktestResult.user_id == user_id)

    # 필터링
    if strategy_id:
        query = query.where(BacktestResult.strategy_id == strategy_id)
    if start_date:
        query = query.where(BacktestResult.start_date >= start_date)
    if end_date:
        query = query.where(BacktestResult.end_date <= end_date)

    # 정렬 (최신 순)
    query = query.order_by(BacktestResult.created_at.desc())

    # 페이지네이션
    query = query.limit(limit).offset(offset)

    result = await self.db.execute(query)
    backtest_results = result.scalars().all()

    return [
        {
            "id": br.id,
            "strategy_id": br.strategy_id,
            "strategy_name": br.strategy_name,
            "start_date": br.start_date.isoformat(),
            "end_date": br.end_date.isoformat(),
            "roi": float(br.roi) if br.roi else None,
            "total_trades": br.total_trades,
            "created_at": br.created_at.isoformat()
        }
        for br in backtest_results
    ]
```

### AC 8: API 엔드포인트 구현 (FR24, NFR6)

**Given** BacktestStorage가 구현되었다
**When** 개발자가 API 엔드포인트를 구현한다
**Then** FR24: 사용자는 백테스트 결과를 저장하고 조회할 수 있다
**And** NFR6: API 응답시간 < 200ms가 만족된다

**기술 구현:**
```python
# app/backtest/api.py (Story 4.1에서 스켈레톤 생성됨)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.api.deps import get_db, get_current_user
from app.models.user import User
from .storage import BacktestStorage

router = APIRouter(prefix="/api/v1/backtest", tags=["backtest"])

@router.post("/results")
async def save_backtest_result(
    user_id: str,
    strategy_id: str,
    strategy_name: str,
    config: Dict[str, Any],
    result: Dict[str, Any],
    trades: List[Dict[str, Any]],
    db: AsyncSession = Depends(get_db)
):
    """
    백테스트 결과 저장 (POST /api/v1/backtest/results)

    FR24: 백테스트 결과 DB 저장
    """
    storage = BacktestStorage(db)
    backtest_id = await storage.save_result(
        user_id=user_id,
        strategy_id=strategy_id,
        strategy_name=strategy_name,
        config=config,
        result=result,
        trades=trades
    )

    return {"backtest_id": backtest_id, "status": "saved"}

@router.get("/results/{backtest_id}")
async def get_backtest_result(
    backtest_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    백테스트 결과 조회 (GET /api/v1/backtest/results/{backtest_id})

    FR24: 상세 결과 불러오기
    NFR6: API 응답시간 < 200ms
    """
    storage = BacktestStorage(db)
    try:
        result = await storage.get_result(backtest_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/results")
async def list_backtest_results(
    user_id: str,
    limit: int = 20,
    offset: int = 0,
    strategy_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    백테스트 기록 목록 조회 (GET /api/v1/backtest/results)

    FR24: 저장된 결과 목록 표시
    """
    storage = BacktestStorage(db)
    results = await storage.list_user_results(
        user_id=user_id,
        limit=limit,
        offset=offset,
        strategy_id=strategy_id,
        start_date=start_date,
        end_date=end_date
    )

    return {
        "results": results,
        "limit": limit,
        "offset": offset,
        "total": len(results)
    }
```

---

## Tasks / Subtasks

### Task 1: Database 스키마 생성 (AC: #1, #2)
- [ ] Subtask 1.1: Alembic migration 생성 (backtest_results 테이블)
- [ ] Subtask 1.2: backtest_results 스키마 정의 (모든 컬럼, 인덱스)
- [ ] Subtask 1.3: Alembic migration 생성 (backtest_trades 테이블)
- [ ] Subtask 1.4: backtest_trades 스키마 정의 (모든 컬럼, FK, 인덱스)
- [ ] Subtask 1.5: `alembic upgrade` 실행 및 테이블 생성 확인

### Task 2: SQLAlchemy 모델 구현 (AC: #3, #4)
- [ ] Subtask 2.1: `app/models/backtest.py` 생성
- [ ] Subtask 2.2: BacktestResult 모델 구현
- [ ] Subtask 2.3: BacktestTrade 모델 구현
- [ ] Subtask 2.4: Relationship 설정 (backtest_result ↔ trades)
- [ ] Subtask 2.5: to_dict() 메서드 구현

### Task 3: BacktestStorage.save_result() 구현 (AC: #5)
- [ ] Subtask 3.1: BacktestResult 생성 로직 구현
- [ ] Subtask 3.2: BacktestTrade bulk insert 구현 (성능 최적화)
- [ ] Subtask 3.3: JSON 컬럼에 strategy_json, metrics_json 저장
- [ ] Subtask 3.4: Transaction 처리 (commit, rollback)

### Task 4: BacktestStorage.get_result() 구현 (AC: #6)
- [ ] Subtask 4.1: BacktestResult 조회 로직 구현
- [ ] Subtask 4.2: BacktestTrade 조회 로직 구현
- [ ] Subtask 4.3: 결과 조립 (백테스트 + 거래 내역)
- [ ] Subtask 4.4: JSON 파싱 (strategy_json, metrics_json)
- [ ] Subtask 4.5: 에러 처리 (404 when not found)

### Task 5: BacktestStorage.list_user_results() 구현 (AC: #7)
- [ ] Subtask 5.1: user_id 필터링 로직 구현
- [ ] Subtask 5.2: strategy_id, start_date, end_date 필터링 구현
- [ ] Subtask 5.3: 최신 순 정렬 (created_at DESC)
- [ ] Subtask 5.4: 페이지네이션 (limit, offset)
- [ ] Subtask 5.5: 요약 정보 반환 (전략명, 기간, ROI, 실행일)

### Task 6: API 엔드포인트 구현 (AC: #8)
- [ ] Subtask 6.1: POST /api/v1/backtest/results 구현
- [ ] Subtask 6.2: GET /api/v1/backtest/results/{backtest_id} 구현
- [ ] Subtask 6.3: GET /api/v1/backtest/results (list) 구현
- [ ] Subtask 6.4: NFR6 검증 (API 응답시간 < 200ms)
- [ ] Subtask 6.5: Error handling (400, 404)

### Task 7: 단위 테스트 작성
- [ ] Subtask 7.1: `tests/unit/test_backtest_storage.py` 생성
- [ ] Subtask 7.2: BacktestResult 모델 테스트
- [ ] Subtask 7.3: BacktestTrade 모델 테스트
- [ ] Subtask 7.4: save_result() 테스트 (bulk insert 포함)
- [ ] Subtask 7.5: get_result() 테스트
- [ ] Subtask 7.6: list_user_results() 테스트 (필터링, 페이지네이션)
- [ ] Subtask 7.7: pytest 실행 및 커버리지 확인 (> 80%)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스트 결과 저장 및 불러오기 시스템을 구현**합니다. 완료되면:
- **DB 스키마**: backtest_results, backtest_trades 테이블
- **SQLAlchemy 모델**: BacktestResult, BacktestTrade
- **BacktestStorage**: save_result(), get_result(), list_user_results()
- **API 엔드포인트**: POST /results, GET /results/{id}, GET /results (list)
- **FR24 만족**: 백테스트 결과 DB 저장, 조회, 목록 표시
- **NFR6 준수**: API 응답시간 < 200ms

### 📚 Story 4.1 (백테스팅 엔진 아키텍처)에서 배운 패턴

**BacktestStorage 인터페이스** [Source: 4-1-backtest-engine-architecture.md line 299-382]:
```python
class BacktestStorage:
    def __init__(self, db: AsyncSession):
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
        Story 4.6에서 구현 예정
        """
        pass

    async def get_result(self, backtest_id: int) -> Dict[str, Any]:
        """
        백테스트 결과 조회
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
        Story 4.6에서 구현 예정
        """
        pass
```

### 🏗️ 핵심 구현 전략

**1. Bulk Insert (성능 최적화)**
```python
# 단일 insert 대신 bulk insert 사용
trade_objects = [
    BacktestTrade(
        backtest_id=backtest_result.id,
        timestamp=trade["timestamp"],
        trade_type=trade["type"],
        ...
    )
    for trade in trades
]

self.db.add_all(trade_objects)
await self.db.commit()
```

**2. JSON 컬럼 활용**
```python
# PostgreSQL TEXT 타입에 JSON 저장 (JSONB는 나중에 migration)
strategy_json = json.dumps(config.get("strategy_json", {}))
metrics_json = json.dumps({
    "equity_curve": result.get("equity_curve", []),
    "avg_holding_period": result.get("avg_holding_period")
})

# 조회 시 JSON 파싱
strategy = json.loads(backtest_result.strategy_json)
```

**3. 인덱스 활용 (NFR6: < 200ms)**
```sql
-- 사용자별 최신 백테스트 조회 (자주 실행)
CREATE INDEX idx_backtest_user_results ON backtest_results(user_id, created_at DESC);

-- 특정 백테스트의 거래 내역 조회 (상세보기)
CREATE INDEX idx_backtest_trades_query ON backtest_trades(backtest_id, timestamp);
```

**4. Cascade Delete**
```python
# backtest_result 삭제 시 관련 거래 내역도 자동 삭제
backtest_id = Column(Integer, ForeignKey('backtest_results.id', ondelete='CASCADE'))
```

### 📊 데이터 흐름

```
Story 4.3 BacktestEngine.run()
    ↓ (result, trades)
Story 4.6 BacktestStorage.save_result()
    ↓
backtest_results 테이블
backtest_trades 테이블
    ↓
Story 4.6 BacktestStorage.get_result()
Story 4.6 BacktestStorage.list_user_results()
    ↓
API 엔드포인트
    ↓
프론트엔드 (Story 4.8)
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL, Alembic)
- ✅ Story 4.1: 백테스팅 엔진 아키텍처 설계 (BacktestStorage 인터페이스)
- ⚠️ Story 4.3: 전략 실행 엔진 구현 (BacktestEngine.run() → result, trades 생성)
- ⚠️ Story 4.4: 성과 지표 계산 (MetricsCalculator → metrics)
- ⚠️ Story 4.5: 거래 내역 추적 (self.trades 확장)

**후속 Stories (이 Story의 결과 활용):**
- Story 4.7: 백테스트 결과 시각화 UI (차트, 거래 내역 표시)
- Story 4.8: 백테스트 실행 및 파라미터 설정 UI (저장, 조회 UI)

**파일 생성/수정 목록:**
1. `alembic/versions/XXX_create_backtest_results_table.py` - 🆕 새로 생성 (Migration)
2. `alembic/versions/XXX_create_backtest_trades_table.py` - 🆕 새로 생성 (Migration)
3. `app/models/backtest.py` - 🆕 새로 생성 (BacktestResult, BacktestTrade 모델)
4. `app/backtest/storage.py` - ✅ 수정 (BacktestStorage 실제 구현)
5. `app/backtest/api.py` - ✅ 수정 (API 엔드포인트 실제 구현)
6. `tests/unit/test_backtest_storage.py` - 🆕 새로 생성 (단위 테스트)

### ⚠️ 중요 고려사항

**1. JSONB vs TEXT:**
- MVP 단계: TEXT 타입에 JSON 문자열 저장 (간단함)
- Phase 2: PostgreSQL JSONB 타입으로 migration (쿼리 성능)

**2. Bulk Insert:**
- 백테스트 거래는 수백~수천 건일 수 있음
- 단일 insert 대신 bulk insert 사용 (성능 10-100x 향상)

**3. NFR6 준수 (< 200ms):**
- 인덱스 활용: idx_backtest_user_results, idx_backtest_trades_query
- 쿼리 최적화: SELECT 필요한 컬럼만 (SELECT * 지양)
- 페이지네이션: limit, offset으로 대량 데이터 방지

**4. 에러 처리:**
- 백테스트 결과가 없을 때: 404 Not Found
- 잘못된 backtest_id: 404 Not Found
- DB 연결 실패: 500 Internal Server Error

**5. 테스트:**
- 단위 테스트: BacktestStorage의 모든 메서드
- Mock 사용: AsyncSession mock
- 커버리지 > 80% 목표
- 통합 테스트: API 엔드포인트

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.6 요구사항 분석 (epics.md)
2. Story 4.1 아키텍처 문서 분석 (BacktestStorage 인터페이스)
3. 8개 AC 정의 (DB 스키마, SQLAlchemy 모델, BacktestStorage 구현, API 엔드포인트)
4. 7개 Task/40개 Subtask 정의
5. Dev Notes 작성 (데이터 흐름, 성능 최적화, NFR6 준수)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- DB 스키마: backtest_results, backtest_trades 테이블
- SQLAlchemy 모델: BacktestResult, BacktestTrade
- BacktestStorage: save_result(), get_result(), list_user_results()
- API 엔드포인트: POST /results, GET /results/{id}, GET /results (list)
- FR24 만족, NFR6 준수 (< 200ms)

📋 **다음 단계:**
- Story 4.6 개발 시작 (DB 스키마, 모델, BacktestStorage, API)
- Story 4.7: 결과 시각화 UI (차트, 거래 내역)
- Story 4.8: 백테스트 실행 UI (저장, 조회)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-6-backtest-storage.md` - This story file

**Database Files to Create (est. 2 files)**
- `alembic/versions/XXX_create_backtest_results_table.py` - 🆕 새로 생성 (Migration)
- `alembic/versions/XXX_create_backtest_trades_table.py` - 🆕 새로 생성 (Migration)

**Backend Files to Create/Modify (est. 4 files)**
- `app/models/backtest.py` - 🆕 새로 생성 (BacktestResult, BacktestTrade 모델)
- `app/backtest/storage.py` - ✅ 수정 (BacktestStorage 실제 구현)
- `app/backtest/api.py` - ✅ 수정 (API 엔드포인트 실제 구현)
- `tests/unit/test_backtest_storage.py` - 🆕 새로 생성 (단위 테스트)

**Total:** 6 files to create/modify
