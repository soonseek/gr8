# Story 3.3: 시장 데이터 노드 구현 (가격, 거래량)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 시장 데이터 노드를 캔버스에 추가하여 가격 및 거래량을 가져올 수 있고 싶다,
**so that** 전략의 데이터 소스를 설정할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (MarketDataNode 인터페이스 포함)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅
- 에디터 4영역 레이아웃 (Toolbar, NodePalette, PropertiesPanel, StatusBar) 완료 ✅
- 노드 팩토리 패턴 구현됨 ✅ (Story 3.2 Dev Notes 참조)

**문제:**
- 시장 데이터 노드 컴포넌트가 구현되지 않음
- 사용자가 전략에 데이터 소스를 추가할 수 없음
- Binance API 연동이 없음
- 속성 패널에서 데이터 타입, 심볼, 시간프레임 설정 불가

**해결:**
MarketDataNode 컴포넌트 구현 및 Binance API 연동

---

## 수용 기준 (Acceptance Criteria)

### AC 1: MarketDataNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/MarketDataNode.tsx`를 생성한다
**Then** 시장 데이터 노드 컴포넌트가 구현된다
**And** 노드가 아이콘과 라벨을 표시한다 (📊 가격/거래량)
**And** 노드가 1개 입력 포트(없음)와 1개 출력 포트(데이터)를 가진다
**And** 노드가 다크모드 스타일링된다 (bg-gray-800, border-gray-700)

### AC 2: 노드 팔레트 통합

**Given** MarketDataNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 시장 데이터 노드를 드래그한다
**Then** 노드가 캔버스에 추가된다
**And** nodeFactory를 통해 노드가 생성된다
**And** 우측 속성 패널에 노드 설정이 표시된다

### AC 3: 속성 패널 설정 UI

**Given** 시장 데이터 노드가 추가되었다
**When** 사용자가 속성 패널을 연다
**Then** 데이터 타입 선택이 제공된다 (PRICE, VOLUME, OHLCV)
**And** 심볼 입력 필드가 제공된다 (예: BTC/USDT)
**And** 시간프레임 선택이 제공된다 (1m, 5m, 15m, 1h, 4h, 1d)
**And** 각 설정에 대한 라벨과 설명이 표시된다

### AC 4: 노드 데이터 즉시 반영

**Given** 시장 데이터 노드가 추가되었다
**When** 사용자가 노드 설정을 변경한다
**Then** 변경 사항이 즉시 노드 데이터에 반영된다 (Zustand store 업데이트)
**And** 노드 라벨이 업데이트된다 (예: "BTC/USDT 가격")
**And** 다른 노드에서 이 노드를 참조할 수 있다 (edge 연결)

### AC 5: Binance API 연동 (백엔드 준비)

**Given** 시장 데이터 노드가 구성되었다
**When** 백테스팅 엔진이 실행된다 (Story 4.x)
**Then** 노드가 Binance API를 호출하여 히스토리컬 데이터를 가져온다
**And** NFR-INT-001: Binance API를 통해 데이터를 조회한다
**And** 데이터가 지정된 시간프레임으로 집계된다
**And** 다음 노드로 데이터가 전달된다
**And** 에러 시 사용자에게 친절한 메시지가 표시된다

### AC 6: 다양한 심볼과 시간프레임 지원

**Given** 시장 데이터 노드가 구현되었다
**When** 개발자가 다양한 심볼과 시간프레임으로 테스트한다
**Then** 모든 지원 심볼이 정상 작동한다 (BTC, ETH, SOL, BNB, XRP 등)
**And** 모든 시간프레임이 정상 작동한다 (1m, 5m, 15m, 1h, 4h, 1d)
**And** OHLCV 데이터가 올바르게 파싱된다
**And** PRICE 데이터는 close 가격만 반환한다
**And** VOLUME 데이터는 거래량만 반환한다

---

## Tasks / Subtasks

### Task 1: MarketDataNode 컴포넌트 기본 구조 (AC: #1)
- [ ] Subtask 1.1: `src/components/editor/nodes/MarketDataNode.tsx` 파일 생성
- [ ] Subtask 1.2: React Flow의 `NodeProps` 타입 임포트 및 설정
- [ ] Subtask 1.3: Handle 컴포넌트 구현 (커스텀 핸들)
- [ ] Subtask 1.4: 노드 본체 UI 구현 (아이콘, 라벨, 다크모드 스타일)
- [ ] Subtask 1.5: 출력 포트(Handle) 추가 (target: 없음, source: 있음)

### Task 2: React Flow nodeTypes에 등록 (AC: #1, #2)
- [ ] Subtask 2.1: `src/components/editor/nodes/index.ts` 파일 수정
- [ ] Subtask 2.2: MarketDataNode 컴포넌트 임포트
- [ ] Subtask 2.3: nodeTypes 객체에 market_data 키로 등록
- [ ] Subtask 2.4: StrategyEditor 컴포넌트에 nodeTypes prop 전달 확인
- [ ] Subtask 2.5: 노드 팔레트에서 MarketDataNode 드래그 앤 드롭 테스트

### Task 3: 속성 패널 설정 UI 구현 (AC: #3)
- [ ] Subtask 3.1: PropertiesPanel 컴포넌트에 MarketDataNode 설정 UI 추가
- [ ] Subtask 3.2: 데이터 타입 선택 UI (Select 드롭다운)
- [ ] Subtask 3.3: 심볼 입력 필드 (TextInput, 자동완성 제안)
- [ ] Subtask 3.4: 시간프레임 선택 UI (Select 드롭다운 또는 라디오 버튼)
- [ ] Subtask 3.5: 각 설정에 대한 라벨과 설명 추가 (Tooltip 또는 Helper Text)

### Task 4: Zustand store와의 통합 (AC: #4)
- [ ] Subtask 4.1: editorStore에 updateNodeConfig 액션 구현
- [ ] Subtask 4.2: 속성 패널에서 설정 변경 시 store 업데이트
- [ ] Subtask 4.3: 노드 라벨 동적 업데이트 (config 기반 라벨 생성)
- [ ] Subtask 4.4: React Flow의 onNodesChange 핸들러와 연동
- [ ] Subtask 4.5: 노드 간 edge 연결 테스트

### Task 5: Binance API 연동 준비 (AC: #5)
- [ ] Subtask 5.1: Binance API 엔드포인트 문서 확인 (klines)
- [ ] Subtask 5.2: API 호출 함수 스텁 구현 (실제 연동은 Story 4.2)
- [ ] Subtask 5.3: 데이터 파싱 로직 구현 (OHLCV, PRICE, VOLUME)
- [ ] Subtask 5.4: 에러 처리 및 사용자 메시지 구현
- [ ] Subtask 5.5: 로딩 상태 표시 (스켈레톤 또는 스피너)

### Task 6: 테스트 및 검증 (AC: #6)
- [ ] Subtask 6.1: 다양한 심볼 테스트 (BTC, ETH, SOL, BNB, XRP)
- [ ] Subtask 6.2: 모든 시간프레임 테스트 (1m, 5m, 15m, 1h, 4h, 1d)
- [ ] Subtask 6.3: 데이터 타입별 파싱 테스트 (PRICE, VOLUME, OHLCV)
- [ ] Subtask 6.4: 에러 시나리오 테스트 (잘못된 심볼, 네트워크 에러)
- [ ] Subtask 6.5: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **시장 데이터 노드 컴포넌트**를 구현하여 사용자가 전략에 데이터 소스를 추가할 수 있게 합니다. 완료되면:
- 사용자가 노드 팔레트에서 시장 데이터 노드를 드래그하여 캔버스에 추가 가능
- 속성 패널에서 데이터 타입, 심볼, 시간프레임 설정 가능
- Binance API 연동 준비 완료 (실제 호출은 Story 4.2에서)
- 후속 스토리(3.4, 3.5 등)에서 데이터 소스로 활용 가능

### 📚 Story 3.2 (노드 타입 정의)에서 배운 패턴

**MarketDataNode 인터페이스** [Source: 3-2-node-type-definitions.md#AC 3]:
```typescript
interface MarketDataNode extends BaseNode {
  type: NodeType.MARKET_DATA;
  category: NodeCategory.DATA_SOURCE;
  data: {
    label: string;
    config: {
      dataType: 'PRICE' | 'VOLUME' | 'OHLCV';
      symbol: string;        // 예: 'BTC/USDT'
      timeframe: string;     // '1m', '5m', '15m', '1h', '4h', '1d'
    };
  };
}
```

**노드 팩토리 패턴** [Source: 3-2-node-type-definitions.md#Dev Notes]:
```typescript
// nodeFactory.ts
case NodeType.MARKET_DATA:
  return {
    id,
    type: NodeType.MARKET_DATA,
    category: NodeCategory.DATA_SOURCE,  // 🆕 하이브리드 아키텍처
    position,
    data: {
      label: 'Market Data',
      config: {
        dataType: 'PRICE',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        ...config,
      },
    },
  } as MarketDataNode;
```

**연결 검증 로직** [Source: 3-2-node-type-definitions.md#연결 검증 로직]:
- TRIGGER → MARKET_DATA 가능 (DATA_CONTINUOUS 트리거)
- MARKET_DATA → TRANSFORMATION, LOGIC, ACTION 가능
- MARKET_DATA는 입력을 받지 않음 (DATA_SOURCE 카테고리)

### 🏗️ React Flow 커스텀 노드 패턴

**Handle 컴포넌트** (커스텀 연결 포인트):
```typescript
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { MarketDataNode } from '@/types/nodes';

export const MarketDataNode = ({ data, selected }: NodeProps<MarketDataNode>) => {
  return (
    <div className={`
      px-4 py-2 rounded-lg border-2 transition-all
      ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-700'}
      bg-gray-800 text-gray-100 min-w-[200px]
    `}>
      {/* 출력 포트만 있음 (입력 없음) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-gray-900"
      />

      {/* 노드 아이콘과 라벨 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📊</span>
        <span className="font-semibold">{data.label}</span>
      </div>

      {/* 데이터 타입 뱃지 */}
      <div className="text-xs text-gray-400">
        {data.config.dataType} • {data.config.symbol}
      </div>
    </div>
  );
};
```

**커스텀 핸들 스타일링:**
- `type="source"`: 출력 포트 (다른 노드로 데이터 전달)
- `type="target"`: 입력 포트 (다른 노드로부터 데이터 수신) - MarketDataNode에는 없음
- `position`: Position.Right, Position.Left, Position.Top, Position.Bottom
- `className`: Tailwind CSS로 스타일링

### 📐 파일 구조

**Story 3.3에서 생성/수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodes/
│       │   ├── MarketDataNode.tsx     # ✅ 새로 생성 (메인 컴포넌트)
│       │   ├── index.ts                # ✅ 수정 (nodeTypes 등록)
│       │   ├── IndicatorNode.tsx       # Story 3.4에서 생성
│       │   └── ActionNode.tsx          # Story 3.5에서 생성
│       └── PropertiesPanel.tsx         # ✅ 수정 (MarketDataNode 설정 UI 추가)
├── stores/
│   └── editorStore.ts                  # ✅ 수정 필요 시 (updateNodeConfig)
└── types/
    └── nodes.ts                        # Story 3.2에서 정의 완료
```

### 🎨 UI/UX 디자인 가이드

**노드 디자인 패턴:**
- 다크모드: `bg-gray-800`, `border-gray-700`
- 선택 상태: `border-blue-500`, `shadow-lg`
- 텍스트: `text-gray-100` (기본), `text-gray-400` (보조)
- 아이콘: 📊 (시장 데이터), 📈 (지표), ⚡ (액션)

**속성 패널 디자인:**
```
┌─────────────────────────────────┐
│ 📊 시장 데이터 노드 설정          │
├─────────────────────────────────┤
│ 데이터 타입                      │
│ [PRICE ▼] (가격)                │
│                                  │
│ 심볼                             │
│ [BTC/USDT        ] 🔍           │
│                                  │
│ 시간프레임                       │
│ [1h ▼] (1시간)                  │
│                                  │
│ 💡 팁: Binance에서 실시간 데이터  │
└─────────────────────────────────┘
```

**라벨 동적 업데이트 예시:**
- PRICE + BTC/USDT → "BTC/USDT 가격"
- VOLUME + ETH/USDT → "ETH/USDT 거래량"
- OHLCV + SOL/USDT → "SOL/USDT 캔들"

### 🌐 Binance API 연동 준비

**API 엔드포인트** (Story 4.2에서 실제 연동):
```
GET https://api.binance.com/api/v3/klines

Parameters:
- symbol: BTCUSDT (슬래시 제거)
- interval: 1m, 5m, 15m, 1h, 4h, 1d
- limit: 1000 (최대 캔들 수)

Response:
[
  [
    1499040000000,  // Open time
    "0.01634790",  // Open
    "0.80000000",  // High
    "0.01575800",  // Low
    "0.01577100",  // Close
    "148976.1141", // Volume
    ...            // (나머지 필드 무시 가능)
  ],
  ...
]
```

**데이터 파싱 로직 (스텁):**
```typescript
// src/utils/marketDataParser.ts
export function parseBinanceKlines(
  klines: number[][],
  dataType: 'PRICE' | 'VOLUME' | 'OHLCV'
) {
  return klines.map(k => {
    const [openTime, open, high, low, close, volume] = k;

    switch (dataType) {
      case 'PRICE':
        return { timestamp: openTime, value: parseFloat(close) };

      case 'VOLUME':
        return { timestamp: openTime, value: parseFloat(volume) };

      case 'OHLCV':
        return {
          timestamp: openTime,
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume),
        };

      default:
        throw new Error(`Unknown dataType: ${dataType}`);
    }
  });
}
```

**에러 처리 패턴:**
```typescript
try {
  const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}`);

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  const data = await response.json();
  return parseBinanceKlines(data, dataType);
} catch (error) {
  console.error('Failed to fetch market data:', error);
  // 사용자에게 친절한 메시지 표시
  return {
    error: '시장 데이터를 가져오는데 실패했습니다. 나중에 다시 시도해주세요.',
  };
}
```

### ⚠️ 중요 고려사항

**1. 심볼 포맷:**
- UI 표시: "BTC/USDT" (슬래시 포함, 사용자 친화적)
- API 호출: "BTCUSDT" (슬래시 제거, Binance 포맷)
- 변환 함수 필요: `formatSymbolForAPI("BTC/USDT") → "BTCUSDT"`

**2. 시간프레임 매핑:**
```typescript
const TIMEFRAME_MAP: Record<string, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};
```

**3. 데이터 타입별 출력:**
- **PRICE**: 단일 숫자 배열 (close 가격만)
- **VOLUME**: 단일 숫자 배열 (거래량만)
- **OHLCV**: 객체 배열 (open, high, low, close, volume)

**4. 성능 최적화:**
- React.memo로 MarketDataNode 감싸서 불필요한 리렌더링 방지
- 대량 데이터 요청 시 디바운싱 고려 (나중에)
- 캐싱 전략 고려 (Story 4.2에서 구현)

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
// src/components/editor/nodes/__tests__/MarketDataNode.test.tsx
import { render, screen } from '@testing-library/react';
import { MarketDataNode } from '../MarketDataNode';

describe('MarketDataNode', () => {
  it('renders node with icon and label', () => {
    const mockData = {
      label: 'BTC/USDT 가격',
      config: {
        dataType: 'PRICE',
        symbol: 'BTC/USDT',
        timeframe: '1h',
      },
    };

    render(<MarketDataNode data={mockData} selected={false} />);
    expect(screen.getByText('BTC/USDT 가격')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('shows correct data type and symbol', () => {
    const mockData = {
      label: 'BTC/USDT 가격',
      config: {
        dataType: 'PRICE',
        symbol: 'BTC/USDT',
        timeframe: '1h',
      },
    };

    render(<MarketDataNode data={mockData} selected={false} />);
    expect(screen.getByText(/PRICE.*BTC\/USDT/)).toBeInTheDocument();
  });
});
```

**파싱 로직 테스트:**
```typescript
// src/utils/__tests__/marketDataParser.test.ts
import { parseBinanceKlines } from '../marketDataParser';

describe('parseBinanceKlines', () => {
  const mockKlines = [
    [1499040000000, "0.01634790", "0.80000000", "0.01575800", "0.01577100", "148976.1141"],
  ];

  it('parses PRICE data correctly', () => {
    const result = parseBinanceKlines(mockKlines, 'PRICE');
    expect(result[0]).toEqual({
      timestamp: 1499040000000,
      value: 0.01577100,
    });
  });

  it('parses VOLUME data correctly', () => {
    const result = parseBinanceKlines(mockKlines, 'VOLUME');
    expect(result[0]).toEqual({
      timestamp: 1499040000000,
      value: 148976.1141,
    });
  });

  it('parses OHLCV data correctly', () => {
    const result = parseBinanceKlines(mockKlines, 'OHLCV');
    expect(result[0]).toEqual({
      timestamp: 1499040000000,
      open: 0.01634790,
      high: 0.80000000,
      low: 0.01575800,
      close: 0.01577100,
      volume: 148976.1141,
    });
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (MarketDataNode 인터페이스)

**후속 Stories (이 Story의 MarketDataNode 활용):**
- Story 3.4: 기술적 지표 노드 구현 (IndicatorNode가 MarketDataNode 출력을 입력으로 사용)
- Story 3.5: 기본 매수/매도 액션 구현 (시장 데이터 기반 액션)
- Story 4.2: 히스토리컬 시장 데이터 (Binance API 실제 연동)

### 📖 참고 자료

**React Flow 공식 문서:**
- Custom Nodes: https://reactflow.dev/docs/nodes/custom-nodes/
- Handle Component: https://reactflow.dev/docs/api/nodes/handle/
- Node Props: https://reactflow.dev/docs/api/react-node-props/

**Binance API 문서:**
- Klines/Candlesticks: https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data

**Zustand 공식 문서:**
- TypeScript Guide: https://zustand.docs.pmnd.rs/guides/typescript

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
_Story implementation尚未开始 - 이 스토리는 ready-for-dev 상태입니다._

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-3-market-data-node.md` - This story file

**Frontend Files to Create/Modify (est. 5 files)**
- `gr8-frontend/src/components/editor/nodes/MarketDataNode.tsx` - ✅ 새로 생성 (시장 데이터 노드 컴포넌트)
- `gr8-frontend/src/components/editor/nodes/index.ts` - ✅ 수정 (nodeTypes에 MarketDataNode 등록)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (MarketDataNode 설정 UI 추가)
- `gr8-frontend/src/utils/marketDataParser.ts` - ✅ 새로 생성 (Binance 데이터 파싱 유틸리티)
- `gr8-frontend/src/components/editor/nodes/__tests__/MarketDataNode.test.tsx` - ✅ 새로 생성 (단위 테스트)
- `gr8-frontend/src/utils/__tests__/marketDataParser.test.ts` - ✅ 새로 생성 (파싱 로직 테스트)

**Total:** 6 files to create/modify
