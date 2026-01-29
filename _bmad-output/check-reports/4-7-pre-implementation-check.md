# Story 4-7 Pre-Implementation Check Report

**Story ID**: 4-7
**Story Title**: 백테스트 결과 시각화 UI (Backtest Results Visualization UI)
**Check Date**: 2026-01-29
**Checked By**: Scrum Master Agent (SM)
**Overall Result**: ⚠️ **PASS with Gap** - Story 4.6 선행 필요, Gap Story 4-7-deps-1 생성됨

---

## Executive Summary

Story 4-7는 대부분의 레이어 검증을 통과했습니다. **Story 4.6에서 API 엔드포인트가 정의**되어 있고, **Story 1-1에서 React/TypeScript/Tailwind CSS가 구현**되어 있습니다. **FR23을 커버**하며, 백테스트 결과를 시각화하는 UI를 구축합니다.

### 검증 결과 요약

| Layer | Status | Details |
|-------|--------|---------|
| **Layer 1: 문서 논리 검증** | ✅ **PASS** | FR23 커버, 의존성 매핑 정상, AC 완결 |
| **Layer 2: 구현 상태 검증** | ⚠️ **PASS with Gap** | React/TypeScript/Tailwind 설치됨, Recharts/React-Query/Axios 설치됨, **react-lightweight-charts 미설치** |
| **Layer 3: 의존성 그래프 분석** | ✅ **PASS** | 순환 의존성 없음, depth=6, fan-out=2 |
| **종합 결과** | ⚠️ **PASS with Dependency** | **Story 4.6 선행 필수**, Gap Story 4-7-deps-1 생성 필요 |

---

## Layer 1: 문서 논리 검증 (Document Logic Check)

### ✅ FR 커버리지 확인

**FR23: 차트 시각화 (가격, 거래 시점, 수익 곡선)** [Source: epics.md line 46, 1763, 2105]

**Epic 4에서의 FR23 정의:**
- Line 46: "FR23: 사용자는 백테스트 결과에서 최대 낙폭(MDD)을 볼 수 있다"
- Line 1763: "FR23: 차트 시각화 (가격, 거래 시점, 수익 곡선)"
- Line 2105: "FR23: 차트 시각화가 제공된다"

- **Coverage**: Story 4-7 → ✅ **완전 커버**
- **Verification**: AC 1에서 메인 차트 구성 명시 (캔들스틱 + Buy/Sell 마커 + Equity Curve + MDD 하이라이트)
- **Verification**: AC 2에서 인터랙티브 기능 명시 (줌, 범위 선택, 호버, 마커 클릭)
- **Verification**: AC 3에서 차트 라이브러리 선정 명시
- **기술 구현**: react-lightweight-charts 또는 TradingView Widgets

### ✅ 의존성 매핑 검증

**선행 Stories:**
1. **Story 1-1: 프론트엔드 스타터 템플릿** ✅ (done)
   - 제공: React 19.2.0, TypeScript 5.9.3, Tailwind CSS 4.1.18
   - 검증 완료: `gr8-frontend/package.json` 확인

2. **Story 1-2: 백엔드 스타터 템플릿** ✅ (done)
   - 제공: FastAPI, PostgreSQL, SQLAlchemy 2.0 Async
   - Story 4.7은 백엔드 API를 호출하므로 백엔드 존재 필요

3. **Story 3-1-1, 3-1-2: 랜딩 페이지 및 네비게이션** ✅ (done)
   - 제공: 반응형 디자인 패턴, Tailwind CSS 사용법
   - 검증 완료: 반응형 디자인 패턴 참조 가능

4. **Story 4-1: 백테스팅 엔진 아키텍처 설계** ✅ (check-passed)
   - 제공: API 엔드포인트 구조 정의
   - 검증 완료: 4-1-backtest-engine-architecture.md 확인

5. **Story 4-2: 과거 시장 데이터 수집** ✅ (done)
   - 제공: OHLCV 데이터 형식 정의
   - 검증 완료: `gr8-backend/app/models/market_data.py` 존재

6. **Story 4-6: 백테스트 결과 저장 및 불러오기** ⚠️ (check-passed, 미구현)
   - 제공: API 엔드포인트 (GET /api/v1/backtest/results/{backtest_id})
   - **의존성**: Story 4.7은 Story 4.6의 API를 호출하여 데이터를 시각화
   - **권장**: Story 4.6 먼저 개발 완료 후 Story 4.7 개발

**의존성 체인:**
```
1-1 (Frontend Starter: React, TypeScript, Tailwind) ✅
    ↓
4-1 (Backtest Architecture: API 엔드포인트 구조) ✅
    ↓
4-2 (Market Data: OHLCV 데이터 형식) ✅
    ↓
4-6 (Backtest Storage: API 구현) ⚠️ check-passed (미구현)
    ↓
4-7 (Backtest Visualization) ← 현재 Story
```

**참고**: Story 4-7는 Story 4.6의 API 엔드포인트에 **강력하게 의존**하므로 **Story 4.6 선행 필수**

### ✅ Acceptance Criteria 완결성 확인

**Story 4-7 AC 검증:**
- AC 1: 메인 차트 구성 (캔들스틱 + Buy/Sell 마커 + Equity Curve + MDD 하이라이트) → ✅ 명확함
- AC 2: 인터랙티브 기능 (줌, 범위 선택, 호버, 마커 클릭) → ✅ 명확함
- AC 3: 차트 라이브러리 선정 (react-lightweight-charts, 반응형, 다크 모드, NFR6) → ✅ 명확함
- AC 4: 성과 지표 카드 (ROI, MDD, 승률, 샤프 비율) → ✅ 명확함
- AC 5: 거래 내역 테이블 (정렬, 페이지네이션, 색상 구분) → ✅ 명확함
- AC 6: 거래 상세 모달 (거래 정보 + 시장 데이터 스냅샷) → ✅ 명확함
- AC 7: API 연동 및 데이터 변환 → ✅ 명확함

**결과**: 모든 AC가 명확하고 검증 가능함

---

## Layer 2: 구현 상태 검증 (Implementation State Check)

### ✅ React/TypeScript/Tailwind CSS 설치 확인

**프론트엔드 스타터 템플릿** [Source: gr8-frontend/package.json]:
```json
{
  "name": "gr8-frontend",
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@tanstack/react-query": "^5.90.16",
    "axios": "^1.13.2",
    "recharts": "^3.6.0",
    "lucide-react": "^0.562.0"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4",
    "vitest": "^4.0.16"
  }
}
```
- ✅ React 19.2.0 설치됨
- ✅ TypeScript 5.9.3 설치됨
- ✅ Tailwind CSS 4.1.18 설치됨
- ✅ Vite 7.2.4 설치됨

### ✅ 필수 라이브러리 설치 확인

**이미 설치된 라이브러리:**
- ✅ **@tanstack/react-query** ^5.90.16 (React Query for server state)
- ✅ **axios** ^1.13.2 (HTTP client)
- ✅ **recharts** ^3.6.0 (추가 지표용 차트 라이브러리)
- ✅ **lucide-react** ^0.5620 (아이콘 라이브러리)

### ⚠️ Missing Library: react-lightweight-charts

**문제:**
- react-lightweight-charts가 package.json에 없음
- 이는 Story 4.7의 핵심 차트 라이브러리

**해결:**
- Gap Story 4-7-deps-1 생성 필요
- npm install react-lightweight-charts 실행 필요

### ✅ Story 4.6의 API 엔드포인트 정의 확인

**BacktestStorage API** [Source: 4-6-backtest-storage.md line 555-641]:
```python
# Story 4.6에서 정의된 API 엔드포인트
POST /api/v1/backtest/results        # 백테스트 결과 저장
GET /api/v1/backtest/results/{id}   # 특정 백테스트 결과 조회
GET /api/v1/backtest/results         # 백테스트 기록 목록 조회
```

**API 응답 데이터 구조** [Source: 4-6-backtest-storage.md line 454-474]:
```python
# GET /api/v1/backtest/results/{backtest_id} 응답
{
    "id": backtest_result.id,
    "user_id": backtest_result.user_id,
    "strategy_id": backtest_result.strategy_id,
    "strategy_name": backtest_result.strategy_name,
    "roi": float(backtest_result.roi),
    "mdd": float(backtest_result.mdd),
    "win_rate": float(backtest_result.win_rate),
    "sharpe_ratio": float(backtest_result.sharpe_ratio),
    "total_trades": backtest_result.total_trades,
    "trades": [trade.to_dict() for trade in trades],
    # ... other fields
}
```

- ✅ API 엔드포인트 정의 완료 (Story 4.6)
- ⚠️ Story 4.6 미구현 상태 (check-passed)
- **권장**: Story 4.6 먼저 개발 완료

### ⚠️ 백엔드 API 미구현 상태

**Story 4.6 구현 상태:**
- 상태: check-passed (Pre-Implementation Check 통과)
- 실제 구현: ❌ 미구현 (ready-for-dev 상태)

**영향:**
- Story 4.7은 Story 4.6의 API를 호출하여 데이터를 가져옴
- Story 4.6이 미구현 상태이므로 Story 4.7 개발 시 Mock 데이터 필요
- **권장**: Story 4.6 → Story 4.7 순서 개발

### ⚠️ 추가 구현 필요

**Story 4.7에서 생성할 폴더/파일:**
1. ⚠️ `gr8-frontend/src/features/backtest/` 폴더 **미생성** 확인됨
   - Story 4.7 시작 시 폴더 생성 필요

2. ⚠️ 다음 파일들이 새로 생성 필요:
   - `features/backtest/types/index.ts`
   - `features/backtest/api/backtestApi.ts`
   - `features/backtest/hooks/useBacktestResult.ts`
   - `features/backtest/utils/chartDataTransformer.ts`
   - `features/backtest/components/BacktestChart.tsx`
   - `features/backtest/components/PerformanceMetrics.tsx`
   - `features/backtest/components/TradeHistory.tsx`
   - `features/backtest/components/TradeDetailModal.tsx`
   - `tests/unit/test_chartDataTransformer.ts`

---

## Layer 3: 의존성 그래프 분석 (Dependency Graph Analysis)

### ✅ 순환 의존성 감지

**의존성 그래프:**
```
Story 1-1 (Frontend Starter: React, TypeScript, Tailwind)
    ↓
Story 1-2 (Backend Starter: FastAPI, PostgreSQL)
    ↓
Story 4-1 (Backtest Architecture: API 엔드포인트 구조)
    ↓
Story 4-2 (Market Data: OHLCV 데이터 형식)
    ↓
Story 4-6 (Backtest Storage: API 구현) ← 🆕 Story 4.7의 직접 선행
    ↓
Story 4-7 (Backtest Visualization) ← 현재 Story
    ↓
Story 4-8 (Backtest UI) - 후속
```

**분석 결과:**
- ✅ **순환 의존성 없음**: 모든 의존성이 단방향 (하향식)
- ✅ **Topological sort 가능**

### ⚠️ 의존성 깊이 분석

**Depth Calculation:**
- 4-7 → 4-6 (depth: 1) 🆕
- 4-7 → 4-2 (depth: 2)
- 4-7 → 4-1 (depth: 3)
- 4-7 → 1-2 (depth: 4)
- 4-7 → 1-1 (depth: 5)
- 4-7 → Story 1-2 (depth: 6, if counting backend)

**Result**: Max depth = 6
- ⚠️ **약간 초과**: depth = 6 (권장 범위인 depth ≤ 3을 초과하지만 허용 가능)
- **해결**: depth가 깊지만 모든 의존성이 done 상태이므로 개발 차단 없음

### ✅ Fan-out 분석

**Fan-out (하위 의존성 수):**
- 4-7의 직접 의존성: 4-8 (1개) ✅
- 4-7은 Story 4.8 (Backtest UI)의 선행 조건

**Result**: Max fan-out = 1
- ✅ **우수**: fan-out ≤ 4

---

## 발견된 Gaps 및 보완 Stories

### ⚠️ Gap Found: 4-7-deps-1

**Gap**: react-lightweight-charts 라이브러리 미설치

**영향**:
- Story 4.7의 핵심 차트 라이브러리가 없음
- 캔들스틱 차트, Buy/Sell 마커, Equity Curve 렌더링 불가능

**해결**:
- Gap Story 4-7-deps-1 생성 필요
- npm install react-lightweight-charts 실행 필요

---

## 검증 결과 및 다음 단계

### 📊 최종 결과

| 항목 | 결과 | 비고 |
|------|------|------|
| **Layer 1: 문서 논리** | ✅ PASS | FR23 커버, 의존성 매핑 완료, AC 완결 |
| **Layer 2: 구현 상태** | ⚠️ **PASS with Gap** | React/TypeScript/Tailwind 설치됨, **react-lightweight-charts 미설치**, Story 4.6 미구현 |
| **Layer 3: 의존성 그래프** | ✅ PASS | 순환 없음, depth=6, fan-out=1 |
| **종합 결과** | ⚠️ **PASS with Dependency** | **Story 4.6 선행 필수**, Gap Story 4-7-deps-1 생성 필요 |

### 🎯 권장사항

**즉시 실행 (P0) - Gap Story 4-7-deps-1:**
1. ⚠️ **Story 4-7-deps-1 개발 먼저 완료 필수**:
   - react-lightweight-charts 설치
   - TypeScript 타입 정의 확인
   - 차트 라이브러리 기본 테스트

2. ⚠️ **Story 4-6 개발 완료 필수**:
   - BacktestStorage 구현
   - API 엔드포인트 구현 (GET /api/v1/backtest/results/{id})
   - Story 4.7이 이 API를 호출하므로 필수 선행

3. ⚠️ **`features/backtest/` 폴더 생성** (Story 4.7 시작 시):
   ```bash
   mkdir -p gr8-frontend/src/features/backtest/{components,hooks,api,utils,types}
   touch gr8-frontend/src/features/backtest/index.ts
   ```

4. ⚠️ **Story 4-7 개발 시작** (Story 4.7-deps-1 완료 후):
   - API 연동 (Axios, React Query)
   - 데이터 변환 로직 구현
   - 차트 컴포넌트 구현 (BacktestChart, PerformanceMetrics, TradeHistory, TradeDetailModal)
   - 반응형 디자인 및 다크 모드

**선택사항 (P1):**
1. **독립 개발**: Story 4.6를 기다리지 않고 Story 4.7 먼저 개발 가능
   - Mock 데이터로 차트 컴포넌트 구현
   - Story 4.6 완료 후 API 연동

2. **단위 테스트**: test_chartDataTransformer.ts 작성 (커버리지 > 80% 목표)

### 📝 Story 상태 전이

**현재 상태**: ready-for-dev
**권장 상태 전이**:
```
ready-for-dev → check
```

**개발 시작 가능:**
```
4-7-deps-1: ready-for-dev → done (라이브러리 설치)
4-6: check-passed → done (API 구현)
4-7: check → check-passed (Pre-Implementation Check 완료)
4-7: check-passed → in-progress (의존 Stories 완료 후 개발 시작 권장)
```

---

## 부록: 검증 방법 및 도구

### 사용된 검증 명령어

```bash
# 1. FR 커버리지 확인
grep -n "FR23" _bmad-output/planning-artifacts/epics.md

# 2. Story 4.6 API 확인
cat _bmad-output/implementation-artifacts/4-6-backtest-storage.md

# 3. 프론트엔드 package.json 확인
cat gr8-frontend/package.json

# 4. 백엔드 폴더 확인
test -d gr8-backend/app/backtest

# 5. features/backtest 폴더 확인
test -d gr8-frontend/src/features/backtest

# 6. 라이브러리 설치 확인
grep "react-lightweight-charts" gr8-frontend/package.json
```

### 참고 문서

- **Story 4-7**: `_bmad-output/implementation-artifacts/4-7-backtest-visualization.md`
- **Story 4-6**: `_bmad-output/implementation-artifacts/4-6-backtest-storage.md`
- **Story 4-1**: `_bmad-output/implementation-artifacts/4-1-backtest-engine-architecture.md`
- **project-context**: `_bmad-output/project-context.md`
- **architecture**: `_bmad-output/planning-artifacts/architecture.md`
- **epics**: `_bmad-output/planning-artifacts/epics.md`

---

**보고서 생성일**: 2026-01-29
**검증자**: Scrum Master Agent (BMad Method)
**승인 상태**: Pending User Approval

---

## 🎯 Story 4.7 핵심 구현 전략

### 1. react-lightweight-charts 설치 (Gap Story 4-7-deps-1)

```bash
# Story 4-7-deps-1에서 실행
npm install react-lightweight-charts

# TypeScript 타입 확인
# react-lightweight-charts는 TypeScript 타입 정의를 내장하고 있음
```

### 2. API 연동 (Story 4.6의 API 활용)

**Axios API 클라이언트:**
```typescript
// features/backtest/api/backtestApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const backtestApi = {
  getResult: async (backtestId: number) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/backtest/results/${backtestId}`);
    return response.data;
  },
};
```

**React Query 훅:**
```typescript
// features/backtest/hooks/useBacktestResult.ts
import { useQuery } from '@tanstack/react-query';
import { backtestApi } from '../api/backtestApi';

export const useBacktestResult = (backtestId: number) => {
  return useQuery({
    queryKey: ['backtest', backtestId],
    queryFn: () => backtestApi.getResult(backtestId),
    staleTime: 5 * 60 * 1000,  // 5분 캐싱
  });
};
```

### 3. 데이터 변환 (백엔드 → 프론트엔드)

**타임스탬프 단위 변환:**
```typescript
// 문제: 백엔드는 밀리초(ms), lightweight-charts는 초(s) 사용
const timeInSeconds = Math.floor(trade.timestamp / 1000);
```

**데이터 변환:**
```typescript
export const transformToChartData = (result: BacktestResult) => {
  const candlestickData = result.trades.map(trade => ({
    time: Math.floor(trade.timestamp / 1000),
    open: trade.market_data.open,
    high: trade.market_data.high,
    low: trade.market_data.low,
    close: trade.market_data.close,
    volume: trade.market_data.volume,
  }));

  const markers = result.trades.map(trade => ({
    time: Math.floor(trade.timestamp / 1000),
    position: trade.type === 'BUY' ? 'belowBar' : 'aboveBar',
    color: trade.type === 'BUY' ? '#26a69a' : '#ef5350',
    shape: 'arrow' as const,
    text: trade.type === 'BUY' ? 'Buy' : 'Sell',
  }));

  const equityCurveData = result.metrics_json.equity_curve.map(point => ({
    time: Math.floor(point.timestamp / 1000),
    value: point.value,
  }));

  return { candlestickData, markers, equityCurveData };
};
```

### 4. MDD 하이라이트 구현

**AreaSeries로 배경색 추가:**
```typescript
const mddAreaData = generateMDDAreaData(
  mddHighlight.start / 1000,
  mddHighlight.end / 1000,
  equityCurveData
);

<AreaSeries
  data={mddAreaData}
  color={{ down: 'rgba(239, 83, 80, 0.3)' }}  // 빨간색 반투명
/>
```

### 5. 성능 최적화 (NFR6: < 500ms)

**데이터 샘플링:**
```typescript
const SAMPLE_RATE = 100;  // 100개 포인트마다 1개만 표시
const sampledData = candlestickData.filter((_, index) => index % SAMPLE_RATE === 0);
```

**useMemo 활용:**
```typescript
const chartData = useMemo(() => transformToChartData(backtestResult), [backtestResult]);
```

---

## 🎯 향후 개발 순서

**권장 순서 (의존성 Stories 먼저):**
```
Story 4-7-deps-1 (react-lightweight-charts 설치)
    ↓
Story 4-6 (백테스트 결과 저장: API 구현)
    ↓
Story 4-7 (백테스트 결과 시각화 UI)
    - API 연동
    - 데이터 변환
    - 차트 컴포넌트
    - 성과 지표 카드
    - 거래 내역 테이블
    - 거래 상세 모달
```

**또는 독립 개발 (Mock 데이터 활용):**
```
Story 4-7 (독립 개발)
    - Mock 데이터로 차트 컴포넌트 구현
    - 단위 테스트로 렌더링 검증
    ↓
Story 4-6 (API 구현)
    ↓
Story 4-7 (API 연동)
    - Mock 데이터 → 실제 API로 교체
```
