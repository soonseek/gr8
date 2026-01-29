# Story 4.7: 백테스트 결과 시각화 UI (Backtest Results Visualization UI)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 백테스트 결과를 차트와 그래프로 시각화하여 전략의 성과를 직관적으로 이해하고 싶다,
**so that** 백테스트 결과를 한눈에 파악하고 전략의 강점과 약점을 빠르게 식별할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS)
- Story 3-1-1, 3-1-2에서 랜딩 페이지 및 네비게이션 완료 ✅
- Story 4-1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (API 엔드포인트 구조 정의)
- Story 4-2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블, OHLCV 데이터)
- Story 4-3에서 전략 실행 엔진 check-passed ✅ (BacktestEngine 구현 예정)
- Story 4-4에서 성과 지표 계산 check (4-4-deps-1 보완 Story 생성됨) ✅ (MetricsCalculator 예정)
- Story 4-5에서 거래 내역 추적 check-passed ✅ (self.trades 확장 예정)
- Story 4-6에서 백테스트 결과 저장 check-passed ✅ (BacktestStorage, API 엔드포인트 구현 예정)

**문제:**
- 백테스트 결과가 숫자로만 표시되어 직관적이지 않음
- 사용자가 전략의 성과를 시각적으로 확인할 수 없음
- 매수/매도 시점을 차트에서 볼 수 없음
- 수익 곡선(Equity Curve)과 MDD 구간을 한눈에 볼 수 없음

**해결:**
react-lightweight-charts 또는 TradingView Widgets를 사용한 백테스트 결과 시각화 UI 구현

**중요:**
- **FR23 커버**: 차트 시각화 (가격, 거래 시점, 수익 곡선, MDD)
- **Story 4-6 API 활용**: GET /api/v1/backtest/results/{backtest_id}
- **인터랙티브 기능**: 줌, 범위 선택, 호버, 마커 클릭
- **성능 요구사항**: NFR6 준수 (렌더링 < 500ms)
- **반응형 디자인**: 모바일 지원, 다크 모드

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 메인 차트 구성 (FR23)

**Given** 백테스트가 완료되었다
**When** 결과 페이지가 표시된다
**Then** FR23: 차트 시각화가 제공된다
**And** 메인 차트에 가격 움직임이 표시된다 (캔들스틱 차트)
**And** 모든 매수/매도 시점이 마커로 표시된다
**And** 수익 곡선(Equity Curve)이 별도 차트로 표시된다
**And** MDD 구간이 하이라이트된다

**기술 구현:**
```typescript
// features/backtest/components/BacktestChart.tsx

interface BacktestChart {
  priceChart: {
    type: 'candlestick',
    data: OHLCV[],
    markers: {
      time: number,
      position: 'aboveBar' | 'belowBar',
      color: string,
      shape: 'arrow' | 'circle',
      text: 'Buy' | 'Sell'
    }[]
  },
  equityChart: {
    type: 'line',
    data: { time: number, value: number }[],
    mddHighlight: { start: number, end: number }
  }
}

type OHLCV = {
  time: number;      // 타임스탬프 (초 단위)
  open: number;      // 시가
  high: number;      // 고가
  low: number;       // 저가
  close: number;     // 종가
  volume: number;    // 거래량
};
```

### AC 2: 인터랙티브 기능 구현

**Given** 결과 차트가 표시되었다
**When** 사용자가 차트와 상호작용한다
**Then** 줌 인/아웃이 가능하다
**And** 범위 선택이 가능하다 (특정 기간만 확대)
**And** 마우스 호버 시 상세 정보가 표시된다 (가격, 거래 내역)
**And** 매수/매도 마커 클릭 시 해당 거래 상세가 표시된다

**기술 구현:**
```typescript
// react-lightweight-charts 인터랙티브 기능
import { Chart, CandlestickSeries, LineSeries, MarkerShape, Crosshair } from 'react-lightweight-charts';

// 1. 줌 인/아웃 (마우스 휠, 줌 버튼)
<Chart
  width={800}
  height={400}
  options={{
    handleScale: true,        // 줌 활성화
    handleScroll: true,       // 팬 활성화
    kineticScroll: {          # 관성 스크롤
      touch: true,
      mouse: true
    }
  }}
>

// 2. 마우스 호버 (Crosshair)
<Crosshair
  mode={CrosshairMode.Normal}  // 십자선 모드
/>

// 3. 마커 클릭 이벤트
const handleMarkerClick = (marker: Marker) => {
  const trade = trades.find(t => t.timestamp === marker.time * 1000);
  if (trade) {
    setSelectedTrade(trade);
    setShowTradeDetailModal(true);
  }
};
```

### AC 3: 차트 라이브러리 선정 및 설정

**Given** 시각화 라이브러리가 선택되었다
**When** 차트가 구현된다
**Then** TradingView Widgets 또는 lightweight-charts가 사용된다
**And** 차트가 반응형이다 (모바일 지원)
**And** NFR6: 렌더링 성능 < 500ms가 만족된다
**And** 다크 모드가 지원된다

**기술 구현:**

**라이브러리 설치:**
```bash
# 옵션 1: react-lightweight-charts (추천)
npm install react-lightweight-charts

# 옵션 2: tradingview-widget
npm install tradingview-widget

# 추가 지표용: Recharts (Story 8-1에서 이미 사용됨)
npm install recharts
```

**차트 테마 설정:**
```typescript
// features/backtest/utils/chartTheme.ts
export const chartTheme = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    gridColor: '#e0e0e0',
    crosshairColor: '#758696',
    upColor: '#26a69a',    // 상승 캔들 색상
    downColor: '#ef5350',  // 하락 캔들 색상
  },
  dark: {
    backgroundColor: '#1e1e1e',
    textColor: '#d1d5db',
    gridColor: '#374151',
    crosshairColor: '#758696',
    upColor: '#26a69a',
    downColor: '#ef5350',
  },
};
```

**반응형 차트:**
```typescript
// features/backtest/components/BacktestChart.tsx
import { useWindowSize } from '../hooks/useWindowSize';

export const BacktestChart: React.FC<BacktestChartProps> = ({ backtestId }) => {
  const { width } = useWindowSize();

  // 반응형 차트 크기
  const chartWidth = Math.min(width - 32, 1200);  // 최대 1200px
  const chartHeight = width < 768 ? 300 : 400;    // 모바일: 300px, 데스크톱: 400px

  return (
    <Chart width={chartWidth} height={chartHeight}>
      {/* 차트 내용 */}
    </Chart>
  );
};
```

### AC 4: 성과 지표 카드 표시

**Given** 백테스트 결과가 로드되었다
**When** 결과 페이지가 표시된다
**Then** 다음 성과 지표가 카드로 표시된다:
  - ROI (총 수익률)
  - MDD (최대 낙폭)
  - 승률 (Win Rate)
  - 샤프 비율 (Sharpe Ratio)
**And** 각 지표가 한눈에 볼 수 있도록 그리드 레이아웃으로 배치된다

**기술 구현:**
```typescript
// features/backtest/components/PerformanceMetrics.tsx
interface PerformanceMetricsProps {
  roi: number;          // %
  mdd: number;          // %
  winRate: number;      // %
  sharpeRatio: number;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  roi,
  mdd,
  winRate,
  sharpeRatio
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="ROI"
        value={`${roi.toFixed(2)}%`}
        color={roi >= 0 ? 'text-green-500' : 'text-red-500'}
      />
      <MetricCard
        label="MDD"
        value={`${mdd.toFixed(2)}%`}
        color="text-red-500"
      />
      <MetricCard
        label="Win Rate"
        value={`${winRate.toFixed(2)}%`}
        color="text-blue-500"
      />
      <MetricCard
        label="Sharpe Ratio"
        value={sharpeRatio.toFixed(2)}
        color="text-purple-500"
      />
    </div>
  );
};
```

### AC 5: 거래 내역 테이블 표시

**Given** 백테스트 결과가 로드되었다
**When** 사용자가 스크롤을 내린다
**Then** 모든 거래 내역이 테이블로 표시된다
**And** 각 거래의 다음 정보가 표시된다:
  - 타임스탬프
  - 거래 유형 (BUY/SELL)
  - 가격
  - 수량
  - 수수료
  - 포지션 사이즈
  - PnL (수익/손실)
**And** 수익/손실이 색상으로 구분된다 (초록/빨강)
**And** 페이지네이션이 지원된다 (20개씩)

**기술 구현:**
```typescript
// features/backtest/components/TradeHistory.tsx
import { useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const data = useMemo(() => trades, [trades]);

  const columns = useMemo(() => [
    {
      Header: 'Timestamp',
      accessor: 'timestamp',
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => (
        <span className={value === 'BUY' ? 'text-green-500' : 'text-red-500'}>
          {value}
        </span>
      ),
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }) => `$${value.toFixed(2)}`,
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },
    {
      Header: 'Fee',
      accessor: 'commission',
      Cell: ({ value }) => `$${value.toFixed(2)}`,
    },
    {
      Header: 'PnL',
      accessor: 'pnl',
      Cell: ({ value, row }) => {
        if (row.original.type === 'BUY') return '-';
        return (
          <span className={value >= 0 ? 'text-green-500' : 'text-red-500'}>
            {value >= 0 ? '+' : ''}${value.toFixed(2)}
          </span>
        );
      },
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
  } = useTable(
    { columns, data, initialState: { pageSize: 20 } },
    useSortBy,
    usePagination
  );

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-between mt-4">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page {useState(state => state.pageIndex + 1)} of {pageCount}
        </span>
      </div>
    </div>
  );
};
```

### AC 6: 거래 상세 모달

**Given** 차트에 매수/매도 마커가 표시되었다
**When** 사용자가 마커를 클릭한다
**Then** 거래 상세 모달이 표시된다
**And** 다음 정보가 표시된다:
  - 거래 타입 (BUY/SELL)
  - 가격, 수량
  - 수수료, 슬리피지
  - 포지션 사이즈
  - PnL (매도의 경우)
  - 노드 ID (어떤 전략 노드에서 실행되었는지)
  - 당시 시장 데이터 스냅샷 (OHLCV)
**And** 모달 외부 클릭 시 닫힌다

**기술 구현:**
```typescript
// features/backtest/components/TradeDetailModal.tsx
import { Dialog, Transition } from '@headlessui/react';

interface TradeDetailModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  isOpen,
  onClose
}) => {
  if (!trade) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Trade Details
          </Dialog.Title>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type</span>
              <span className={trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                {trade.type}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Price</span>
              <span>${trade.price.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Quantity</span>
              <span>{trade.quantity}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fee</span>
              <span>${trade.commission.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slippage</span>
              <span>${trade.slippage.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Position Size</span>
              <span>${trade.position_size.toFixed(2)}</span>
            </div>

            {trade.type === 'SELL' && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">PnL</span>
                <span className={trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Node ID</span>
              <span className="font-mono text-sm">{trade.node_id}</span>
            </div>

            {/* 시장 데이터 스냅샷 */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-2">Market Data Snapshot</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Open: </span>
                  ${trade.market_data.open.toFixed(2)}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">High: </span>
                  ${trade.market_data.high.toFixed(2)}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Low: </span>
                  ${trade.market_data.low.toFixed(2)}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Close: </span>
                  ${trade.market_data.close.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
```

### AC 7: API 연동 및 데이터 변환

**Given** 백테스트 결과 API가 구현되었다 (Story 4.6)
**When** 사용자가 백테스트 결과 페이지를 연다
**Then** GET /api/v1/backtest/results/{backtest_id} API가 호출된다
**And** 응답 데이터가 차트 데이터 형식으로 변환된다
**And** 차트가 렌더링된다

**기술 구현:**

**API 클라이언트:**
```typescript
// features/backtest/api/backtestApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface BacktestResult {
  id: number;
  user_id: string;
  strategy_id: string;
  strategy_name: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  roi: number;
  mdd: number;
  win_rate: number;
  sharpe_ratio: number;
  total_trades: number;
  execution_time_ms: number;
  status: string;
  created_at: string;
  metrics_json: {
    equity_curve: Array<{ timestamp: number; value: number }>;
    mdd_periods?: Array<{ start: number; end: number; value: number }>;
  };
  trades: Array<{
    timestamp: number;
    type: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    commission: number;
    slippage: number;
    position_size: number;
    pnl: number;
    node_id: string;
    market_data: {
      timestamp: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    };
  }>;
}

export const backtestApi = {
  getResult: async (backtestId: number): Promise<BacktestResult> => {
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
    gcTime: 10 * 60 * 1000,    // 10분 후 메모리에서 제거
  });
};
```

**데이터 변환 유틸리티:**
```typescript
// features/backtest/utils/chartDataTransformer.ts
import { BacktestResult } from '../api/backtestApi';

export type OHLCV = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Marker = {
  time: number;
  position: 'aboveBar' | 'belowBar';
  color: string;
  shape: 'arrow' | 'circle';
  text: 'Buy' | 'Sell';
};

export const transformToChartData = (result: BacktestResult) => {
  // 1. trades에서 OHLCV 데이터 추출
  const candlestickData: OHLCV[] = result.trades.map(trade => ({
    time: Math.floor(trade.timestamp / 1000),  // 밀리초 → 초 변환
    open: trade.market_data.open,
    high: trade.market_data.high,
    low: trade.market_data.low,
    close: trade.market_data.close,
    volume: trade.market_data.volume,
  }));

  // 2. Buy/Sell 마커 생성
  const markers: Marker[] = result.trades.map(trade => ({
    time: Math.floor(trade.timestamp / 1000),
    position: trade.type === 'BUY' ? 'belowBar' : 'aboveBar',
    color: trade.type === 'BUY' ? '#26a69a' : '#ef5350',
    shape: 'arrow' as const,
    text: trade.type === 'BUY' ? 'Buy' : 'Sell',
  }));

  // 3. Equity Curve 데이터 변환
  const equityCurveData = result.metrics_json.equity_curve.map(point => ({
    time: Math.floor(point.timestamp / 1000),
    value: point.value,
  }));

  // 4. MDD 하이라이트
  const mddHighlight = result.metrics_json.mdd_periods?.[0] || {
    start: 0,
    end: 0,
  };

  return {
    candlestickData,
    markers,
    equityCurveData,
    mddHighlight,
  };
};
```

---

## Tasks / Subtasks

### Task 1: 차트 라이브러리 설치 및 설정 (AC: #3)
- [ ] Subtask 1.1: react-lightweight-charts 설치 (npm install react-lightweight-charts)
- [ ] Subtask 1.2: 차트 테마 설정 (light/dark 모드)
- [ ] Subtask 1.3: TypeScript 타입 정의 (features/backtest/types/index.ts)

### Task 2: API 연동 (AC: #7)
- [ ] Subtask 2.1: Axios API 클라이언트 구현 (features/backtest/api/backtestApi.ts)
- [ ] Subtask 2.2: React Query 훅 구현 (features/backtest/hooks/useBacktestResult.ts)
- [ ] Subtask 2.3: API 응답 TypeScript 인터페이스 정의

### Task 3: 데이터 변환 로직 구현 (AC: #7)
- [ ] Subtask 3.1: 백엔드 응답 → 차트 데이터 변환 유틸리티 구현
- [ ] Subtask 3.2: OHLCV 데이터 추출 로직
- [ ] Subtask 3.3: Buy/Sell 마커 생성 로직
- [ ] Subtask 3.4: Equity Curve 데이터 변환 로직
- [ ] Subtask 3.5: 타임스탬프 단위 변환 (밀리초 → 초)

### Task 4: 메인 차트 구현 (AC: #1, #2)
- [ ] Subtask 4.1: BacktestChart 컴포넌트 구현 (features/backtest/components/BacktestChart.tsx)
- [ ] Subtask 4.2: 캔들스틱 차트 렌더링 (CandlestickSeries)
- [ ] Subtask 4.3: Buy/Sell 마커 표시
- [ ] Subtask 4.4: 줌 인/아웃 기능 구현
- [ ] Subtask 4.5: 범위 선택 기능 구현
- [ ] Subtask 4.6: 마우스 호버 시 Crosshair 표시
- [ ] Subtask 4.7: 마커 클릭 이벤트 핸들러

### Task 5: Equity Curve 및 MDD 하이라이트 (AC: #1)
- [ ] Subtask 5.1: Equity Curve 라인 차트 구현 (LineSeries)
- [ ] Subtask 5.2: MDD 구간 하이라이트 구현 (AreaSeries 또는 배경색)
- [ ] Subtask 5.3: MDD 시작/종료 시점 표시

### Task 6: 성과 지표 카드 (AC: #4)
- [ ] Subtask 6.1: PerformanceMetrics 컴포넌트 구현
- [ ] Subtask 6.2: MetricCard 하위 컴포넌트 구현
- [ ] Subtask 6.3: 그리드 레이아웃 (grid-cols-2 md:grid-cols-4)
- [ ] Subtask 6.4: 색상 구분 (ROI: 초록/빨강, MDD: 빨강, Win Rate: 파랑, Sharpe: 보라)

### Task 7: 거래 내역 테이블 (AC: #5)
- [ ] Subtask 7.1: TradeHistory 컴포넌트 구현
- [ ] Subtask 7.2: react-table 또는 TanStack Table 설치
- [ ] Subtask 7.3: 테이블 컬럼 정의 (timestamp, type, price, quantity, fee, pnl)
- [ ] Subtask 7.4: 정렬 기능 구현 (useSortBy)
- [ ] Subtask 7.5: 페이지네이션 구현 (usePagination, 20개씩)
- [ ] Subtask 7.6: 수익/손실 색상 구분

### Task 8: 거래 상세 모달 (AC: #6)
- [ ] Subtask 8.1: TradeDetailModal 컴포넌트 구현
- [ ] Subtask 8.2: Headless UI Dialog 설치 및 설정
- [ ] Subtask 8.3: 모달 내용 레이아웃 (거래 정보 + 시장 데이터 스냅샷)
- [ ] Subtask 8.4: 닫기 버튼 및 외부 클릭 시 닫기

### Task 9: 반응형 디자인 (AC: #3)
- [ ] Subtask 9.1: useWindowSize 훅 구현
- [ ] Subtask 9.2: 반응형 차트 크기 (모바일: 300px, 데스크톱: 400px)
- [ ] Subtask 9.3: Tailwind CSS 반응형 클래스 적용 (md:, lg:)

### Task 10: 다크 모드 지원 (AC: #3)
- [ ] Subtask 10.1: 다크 모드 테마 전환 로직
- [ ] Subtask 10.2: 차트 테마 동적 변경
- [ ] Subtask 10.3: Tailwind CSS dark: 클래스 적용

### Task 11: 성능 최적화 (AC: #3, NFR6)
- [ ] Subtask 11.1: 데이터 샘플링 구현 (너무 많은 데이터 포인트 다운샘플링)
- [ ] Subtask 11.2: useMemo, useCallback 활용 (불필요한 리렌더링 방지)
- [ ] Subtask 11.3: React Query 캐싱 전략 (staleTime: 5분)
- [ ] Subtask 11.4: 렌더링 성능 측정 (< 500ms 목표)

### Task 12: 단위 테스트 작성
- [ ] Subtask 12.1: chartDataTransformer 테스트 (데이터 변환 로직)
- [ ] Subtask 12.2: BacktestChart 컴포넌트 테스트 (레nder링)
- [ ] Subtask 12.3: PerformanceMetrics 컴포넌트 테스트
- [ ] Subtask 12.4: TradeHistory 컴포넌트 테스트
- [ ] Subtask 12.5: vitest 또는 jest 실행 및 커버리지 확인 (> 80% 목표)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스트 결과 시각화 UI를 구현**합니다. 완료되면:
- **차트 시각화**: 캔들스틱 차트, Buy/Sell 마커, Equity Curve, MDD 하이라이트
- **인터랙티브 기능**: 줌, 범위 선택, 호버, 마커 클릭
- **성과 지표 카드**: ROI, MDD, 승률, 샤프 비율
- **거래 내역 테이블**: 정렬, 페이지네이션, 색상 구분
- **거래 상세 모달**: 거래 정보 및 시장 데이터 스냅샷
- **FR23 만족**: 차트 시각화
- **NFR6 준수**: 렌더링 < 500ms

### 📚 Story 4.6 (백테스트 결과 저장)에서 배운 패턴

**API 엔드포인트** [Source: 4-6-backtest-storage.md]:
```python
# Story 4.6에서 구현된 API 엔드포인트
GET /api/v1/backtest/results/{backtest_id}  # 특정 백테스트 결과 조회
GET /api/v1/backtest/results                # 백테스트 기록 목록 조회
```

**API 응답 데이터 구조** [Source: 4-6-backtest-storage.md]:
```python
# Story 4.6에서 정의된 응답 형식
{
    "id": 123,
    "strategy_name": "RSI Strategy",
    "roi": 25.0,
    "mdd": -15.5,
    "win_rate": 65.0,
    "sharpe_ratio": 1.8,
    "metrics_json": {
        "equity_curve": [
            {"timestamp": 1609459200000, "value": 10000.00},
            {"timestamp": 1609462800000, "value": 10250.50}
        ],
        "mdd_periods": [
            {"start": 1609545600000, "end": 1609632000000, "value": -15.5}
        ]
    },
    "trades": [
        {
            "timestamp": 1609459200000,
            "type": "BUY",
            "price": 50000.00,
            "quantity": 0.1,
            "pnl": 0.0,
            "node_id": "action-1",
            "market_data": {
                "open": 49950.00,
                "high": 50100.00,
                "low": 49900.00,
                "close": 50000.00,
                "volume": 123.45
            }
        }
    ]
}
```

### 🏗️ 핵심 구현 전략

**1. 차트 라이브러리 선정: react-lightweight-charts**
```typescript
// 이유:
// - TradingView 개발 (전문 금융 차트)
// - 고성능 렌더링 (Canvas 기반)
// - 반응형 디자인 기본 지원
// - TypeScript 타입 정의 완벽
// - 다크 모드 기본 지원
// - 가볍고 빠름

// 설치
npm install react-lightweight-charts
```

**2. 타임스탬프 단위 통일**
```typescript
// 문제: 백엔드는 밀리초(ms), lightweight-charts는 초(s) 사용
// 해결: 데이터 변환 시 단위 통일

const timeInSeconds = Math.floor(trade.timestamp / 1000);
```

**3. 데이터 샘플링 (성능 최적화)**
```typescript
// 문제: 1년치 1시간봉 = 8,760개 데이터 포인트 (너무 많음)
// 해결: 데이터 샘플링

const SAMPLE_RATE = 100;  // 100개 포인트마다 1개만 표시
const sampledData = candlestickData.filter((_, index) => index % SAMPLE_RATE === 0);
```

**4. MDD 하이라이트 구현**
```typescript
// 방법 1: AreaSeries로 배경색 추가
const mddAreaData = generateMDDAreaData(
  mddHighlight.start,
  mddHighlight.end,
  equityCurveData
);

<AreaSeries
  data={mddAreaData}
  color={{ down: 'rgba(239, 83, 80, 0.3)' }}  // 빨간색 반투명
/>

// 방법 2: 별도의 시각적 큐 (수직선, 배경색)
```

### 📊 데이터 흐름

```
Story 4-3 BacktestEngine.run()
    ↓ (result, trades)
Story 4-4 MetricsCalculator.calculate_all_metrics()
    ↓ (metrics + equity_curve)
Story 4-6 BacktestStorage.save_result()
    ↓ (DB에 저장)
PostgreSQL DB (backtest_results, backtest_trades)
    ↓ (API 요청: GET /results/{id})
Story 4-7 Frontend API 호출
    ↓ (JSON 응답)
chartDataTransformer (JSON → Chart Data)
    ↓ (Chart Data Format)
react-lightweight-charts 렌더링
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)
- ✅ Story 3-1-1, 3-1-2: 랜딩 페이지 및 네비게이션 (반응형 디자인 패턴)
- ✅ Story 4-1: 백테스팅 엔진 아키텍처 설계 (API 엔드포인트 구조)
- ✅ Story 4-2: 과거 시장 데이터 수집 (OHLCV 데이터 형식)
- ⚠️ Story 4-3: 전략 실행 엔진 (BacktestEngine, trades 데이터) - 선행 권장
- ⚠️ Story 4-4: 성과 지표 계산 (MetricsCalculator, MDD) - 선행 권장
- ⚠️ Story 4-5: 거래 내역 추적 (trades 확장) - 선행 권장
- ⚠️ Story 4-6: 백테스트 결과 저장 (API 엔드포인트) - **필수 선행**

**후속 Stories (이 Story의 결과 활용):**
- Story 4.8: 백테스트 실행 및 파라미터 설정 UI (Story 4.7의 차트를 결과로 표시)
- Story 4.9: 템플릿 전략 백테스트 결과 제공 (Story 4.7의 차트를 라이브러리에서 활용)

**파일 생성/수정 목록:**
1. `features/backtest/types/index.ts` - 🆕 새로 생성 (TypeScript 타입 정의)
2. `features/backtest/api/backtestApi.ts` - 🆕 새로 생성 (Axios API 클라이언트)
3. `features/backtest/hooks/useBacktestResult.ts` - 🆕 새로 생성 (React Query 훅)
4. `features/backtest/utils/chartDataTransformer.ts` - 🆕 새로 생성 (데이터 변환)
5. `features/backtest/components/BacktestChart.tsx` - 🆕 새로 생성 (메인 차트)
6. `features/backtest/components/PerformanceMetrics.tsx` - 🆕 새로 생성 (성과 지표 카드)
7. `features/backtest/components/TradeHistory.tsx` - 🆕 새로 생성 (거래 내역 테이블)
8. `features/backtest/components/TradeDetailModal.tsx` - 🆕 새로 생성 (거래 상세 모달)
9. `features/backtest/hooks/useWindowSize.ts` - 🆕 새로 생성 (반응형 훅)
10. `features/backtest/utils/chartTheme.ts` - 🆕 새로 생성 (차트 테마)
11. `tests/unit/test_chartDataTransformer.ts` - 🆕 새로 생성 (단위 테스트)

### ⚠️ 중요 고려사항

**1. 데이터 양 관리:**
- 백테스트 기간이 길수록 데이터 포인트가 많아짐 (1년치 1시간봉 = 8,760개)
- **해결책**: 데이터 샘플링 또는 다운샘플링 적용
- 프론트엔드에서 너무 많은 데이터를 한 번에 렌더링하지 않도록 주의

**2. 타임스탬프 단위 통일:**
- 백엔드: 밀리초 (millisecond)
- lightweight-charts: 초 (second)
- **해결책**: 데이터 변환 시 단위 통일 (`timestamp / 1000`)

**3. 다크 모드 전환 시 차트 재렌더링:**
- 다크 모드 토글 시 차트 테마가 변경되어야 함
- **해결책**: 차트 컴포넌트를 언마운트했다가 다시 마운트하거나, 테마 변경 API 호출

**4. 모바일 성능:**
- 모바일에서는 차트 높이를 줄이고 데이터를 더 적게 표시
- **해결책**: 반응형 차트 높이 + 데이터 샘플링률 조정

**5. 오류 처리:**
- 백테스트 결과가 없는 경우 (404)
- 데이터가 손상된 경우
- **해결책**: Error Boundary 및 에러 메시지 표시

**6. NFR6 준수 (< 500ms 렌더링):**
- **해결책**:
  - 데이터 샘플링
  - useMemo, useCallback 활용
  - React Query 캐싱
  - 차트 라이브러리 고성능 렌더링 활용 (Canvas 기반)

### 📦 추가 라이브러리

**필수 라이브러리:**
```bash
# 차트 라이브러리
npm install react-lightweight-charts

# 데이터 패칭
npm install axios

# 상태 관리 및 서버 상태
npm install @tanstack/react-query

# 테이블 (선택사항)
npm install @tanstack/table  # 또는 react-table

# 모달 (선택사항, Headless UI 이미 설치됨)
npm install @headlessui/react
```

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.7 요구사항 분석 (epics.md)
2. Story 4.6 문서 분석 (API 엔드포인트, 데이터 구조)
3. 이전 Stories (4-1~4-6) 의존성 분석
4. 7개 AC 정의 (메인 차트, 인터랙티브 기능, 라이브러리, 성과 지표, 거래 내역, 상세 모달, API 연동)
5. 12개 Task/50개 Subtask 정의
6. Dev Notes 작성 (데이터 흐름, 성능 최적화, 의존성 Stories)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- react-lightweight-charts 기반 차트 시각화
- API 연동 (Story 4.6의 GET /api/v1/backtest/results/{id})
- 인터랙티브 기능 (줌, 범위 선택, 호버, 마커 클릭)
- 성과 지표 카드, 거래 내역 테이블, 상세 모달
- FR23 만족, NFR6 준수 (< 500ms 렌더링)

📋 **다음 단계:**
- Story 4-7 개발 시작 (차트 컴포넌트, API 연동)
- Story 4-8: 백테스트 실행 및 파라미터 설정 UI
- Story 4-9: 템플릿 전략 백테스트 결과 제공

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-7-backtest-visualization.md` - This story file

**Frontend Files to Create (est. 10 files)**
- `features/backtest/types/index.ts` - 🆕 새로 생성 (TypeScript 타입 정의)
- `features/backtest/api/backtestApi.ts` - 🆕 새로 생성 (Axios API 클라이언트)
- `features/backtest/hooks/useBacktestResult.ts` - 🆕 새로 생성 (React Query 훅)
- `features/backtest/hooks/useWindowSize.ts` - 🆕 새로 생성 (반응형 훅)
- `features/backtest/utils/chartDataTransformer.ts` - 🆕 새로 생성 (데이터 변환)
- `features/backtest/utils/chartTheme.ts` - 🆕 새로 생성 (차트 테마)
- `features/backtest/components/BacktestChart.tsx` - 🆕 새로 생성 (메인 차트)
- `features/backtest/components/PerformanceMetrics.tsx` - 🆕 새로 생성 (성과 지표 카드)
- `features/backtest/components/TradeHistory.tsx` - 🆕 새로 생성 (거래 내역 테이블)
- `features/backtest/components/TradeDetailModal.tsx` - 🆕 새로 생성 (거래 상세 모달)

**Test Files (est. 1 file)**
- `tests/unit/test_chartDataTransformer.ts` - 🆕 새로 생성 (단위 테스트)

**Total:** 11-12 files to create
