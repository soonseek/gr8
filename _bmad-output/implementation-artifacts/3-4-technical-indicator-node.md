# Story 3.4: 기술적 지표 노드 구현 (RSI, MACD, MA)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 기술적 지표 노드를 추가하여 RSI, MACD, Moving Average를 계산할 수 있고 싶다,
**so that** 매매 신호를 생성할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (IndicatorNode 인터페이스 포함)
- Story 3.3에서 시장 데이터 노드 구현 완료 ✅ (MarketDataNode로 OHLCV 데이터 제공)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅
- 에디터 4영역 레이아웃 (Toolbar, NodePalette, PropertiesPanel, StatusBar) 완료 ✅

**문제:**
- 기술적 지표 노드 컴포넌트가 구현되지 않음
- 사용자가 RSI, MACD, MA 등의 기술적 지표를 활용할 수 없음
- 매매 신호 생성을 위한 지표 계산 기능 없음

**해결:**
IndicatorNode 컴포넌트 구현 및 technicalindicators 라이브러리 연동

**중요:**
- **지표 계산 라이브러리**: `technicalindicators` npm 패키지 사용 (안정화된 버전)
- **MVP 지원 지표**: RSI, MACD, SMA, EMA (Bollinger Bands는 선택사항)
- **입력 데이터**: MarketDataNode에서 받은 OHLCV 데이터 사용
- **속성 패널**: 지표별 파라미터 설정 UI 제공

---

## 수용 기준 (Acceptance Criteria)

### AC 1: IndicatorNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodeTypes/IndicatorNode.tsx`를 생성한다 (또는 기존 nodeTypes/index.tsx의 IndicatorNodeComponent 확장)
**Then** 기술적 지표 노드 컴포넌트가 구현된다
**And** 노드가 아이콘과 라벨을 표시한다 (📈 지표)
**And** 노드가 1개 입력 포트(target: Top)와 1개 출력 포트(source: Bottom)를 가진다
**And** 노드가 다크모드 스타일링된다 (bg-gray-800, border-purple-500)
**And** 지표별로 다른 아이콘이 표시된다 (RSI, MACD, SMA, EMA)

### AC 2: 노드 팔레트 통합

**Given** IndicatorNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 RSI/MACD/MA 노드를 드래그한다
**Then** 노드가 캔버스에 추가된다
**And** nodeFactory를 통해 노드가 생성된다
**And** 우측 속성 패널에 노드 설정이 표시된다
**And** MarketDataNode 출력 포트와 IndicatorNode 입력 포트를 연결할 수 있다

### AC 3: RSI 지표 구현

**Given** 사용자가 노드 팔레트에서 RSI 노드를 추가한다
**When** RSI 설정 패널이 표시된다
**Then** Period 입력이 제공된다 (기본값: 14, 범위: 2~100)
**And** Source 입력이 연결되어야 한다 (시장 데이터 또는 다른 지표)
**And** Period 변경 시 즉시 노드 데이터에 반영된다

**Given** 사용자가 RSI 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** RSI 값(0~100)이 출력된다
**And** 다른 노드에서 RSI 값을 참조할 수 있다 (ConditionNode 등)
**And** 백테스트 엔진이 RSI를 계산할 수 있다 (technicalindicators 라이브러리 사용)

### AC 4: MACD 지표 구현

**Given** 사용자가 노드 팔레트에서 MACD 노드를 추가한다
**Then** MACD 설정 패널이 표시된다
**And** Fast Period 입력이 제공된다 (기본값: 12, 범위: 2~100)
**And** Slow Period 입력이 제공된다 (기본값: 26, 범위: 2~100)
**And** Signal Period 입력이 제공된다 (기본값: 9, 범위: 2~100)
**And** Source 입력이 연결되어야 한다

**Given** 사용자가 MACD 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** MACD Line, Signal Line, Histogram이 출력된다
**And** 다른 노드에서 이 값들을 참조할 수 있다
**And** 백테스트 엔진이 MACD를 계산할 수 있다

### AC 5: Moving Average 지표 구현

**Given** 사용자가 노드 팔레트에서 Moving Average 노드를 추가한다
**Then** MA 설정 패널이 표시된다
**And** MA 타입 선택이 제공된다 (SMA, EMA)
**And** Period 입력이 제공된다 (기본값: 20, 범위: 2~200)
**And** Source 입력이 연결되어야 한다

**Given** 사용자가 MA 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** MA 값이 출력된다
**And** 여러 MA를 서로 연결할 수 있다 (예: Golden Cross: MA50 > MA200)
**And** 백테스트 엔진이 MA를 계산할 수 있다

### AC 6: 속성 패널 설정 UI

**Given** 기술적 지표 노드가 추가되었다
**When** 사용자가 속성 패널을 연다
**Then** 지표 타입이 표시된다 (RSI, MACD, SMA, EMA)
**And** 지표별 파라미터가 동적으로 표시된다
**And** 모든 파라미터에 라벨과 설명이 표시된다
**And** 파라미터 범위 검증이 수행된다 (예: Period: 2~100)
**And** 노드 라벨이 파라미터 기반으로 동적 업데이트된다 (예: "RSI(14)")

### AC 7: technicalindicators 라이브러리 연동

**Given** 기술적 지표 노드가 구성되었다
**When** 백테스팅 엔진이 실행된다 (Story 4.x)
**Then** 각 지표가 입력 데이터를 기반으로 계산된다
**And** 지표 계산 라이브러리가 사용된다 (technicalindicators npm 패키지)
**And** 계산 결과가 다음 노드로 전달된다
**And** 계산 오류 시 에러가 로깅되고 사용자에게 알려진다

---

## Tasks / Subtasks

### Task 1: technicalindicators 라이브러리 설치 및 설정 (AC: #7)
- [ ] Subtask 1.1: `npm install technicalindicators` 실행
- [ ] Subtask 1.2: TypeScript 타입 정의 확인 (@types/technicalindicators 없을 경우 직접 정의)
- [ ] Subtask 1.3: 지표 계산 유틸리티 생성 (src/utils/indicatorCalculator.ts)
- [ ] Subtask 1.4: RSI, MACD, SMA, EMA 계산 함수 구현
- [ ] Subtask 1.5: 단위 테스트 작성 (indicatorCalculator.test.ts)

### Task 2: IndicatorNode 컴포넌트 확장 (AC: #1, #2)
- [ ] Subtask 2.1: 기존 IndicatorNodeComponent 확인 (nodeTypes/index.tsx)
- [ ] Subtask 2.2: 지표 타입별 아이콘 추가 (RSI: 📊, MACD: 📉, SMA: 📈, EMA: 📈)
- [ ] Subtask 2.3: 입력 포트(target: Top)와 출력 포트(source: Bottom) 확인
- [ ] Subtask 2.4: 다크모드 스타일링 확인 (bg-gray-800, border-purple-500)
- [ ] Subtask 2.5: nodeTypes 객체에 indicator 키 등록 확인

### Task 3: 속성 패널 설정 UI 구현 (AC: #3, #4, #5, #6)
- [ ] Subtask 3.1: PropertiesPanel 컴포넌트에 IndicatorNode 설정 UI 추가
- [ ] Subtask 3.2: 지표 타입 선택 UI (Select 드롭다운: RSI, MACD, SMA, EMA)
- [ ] Subtask 3.3: RSI 파라미터 UI (Period: 2~100, 기본값 14)
- [ ] Subtask 3.4: MACD 파라미터 UI (Fast Period: 12, Slow Period: 26, Signal Period: 9)
- [ ] Subtask 3.5: MA 파라미터 UI (타입: SMA/EMA, Period: 2~200, 기본값 20)
- [ ] Subtask 3.6: 파라미터 범위 검증 로직 추가
- [ ] Subtask 3.7: 노드 라벨 동적 업데이트 (예: "RSI(14)", "MACD(12,26,9)", "SMA(20)")

### Task 4: Zustand store와의 통합 (AC: #2, #6)
- [ ] Subtask 4.1: editorStore에 updateNodeConfig 액션 사용 확인 (기존 구현 활용)
- [ ] Subtask 4.2: 속성 패널에서 파라미터 변경 시 store 업데이트
- [ ] Subtask 4.3: 노드 라벨 동적 업데이트 로직 연결
- [ ] Subtask 4.4: React Flow의 onNodesChange 핸들러와 연동 확인
- [ ] Subtask 4.5: MarketDataNode → IndicatorNode edge 연결 테스트

### Task 5: 노드 팩토리 업데이트 (AC: #2)
- [ ] Subtask 5.1: utils/nodeFactory.ts에 createIndicatorNode 함수 확인
- [ ] Subtask 5.2: 지표 타입별 기본 파라미터 설정
- [ ] Subtask 5.3: 노드 팔레트에서 드래그 앤 드롭 테스트
- [ ] Subtask 5.4: MarketDataNode와의 연결 테스트

### Task 6: 테스트 및 검증 (AC: #7)
- [ ] Subtask 6.1: RSI 계산 테스트 (다양한 period: 5, 14, 21)
- [ ] Subtask 6.2: MACD 계산 테스트 (기본 파라미터 및 커스텀 파라미터)
- [ ] Subtask 6.3: SMA/EMA 계산 테스트 (다양한 period: 10, 20, 50, 200)
- [ ] Subtask 6.4: 에러 시나리오 테스트 (잘못된 파라미터, 데이터 누락)
- [ ] Subtask 6.5: 단위 테스트 작성 (Vitest - indicatorCalculator.test.ts)
- [ ] Subtask 6.6: 통합 테스트 (MarketDataNode → IndicatorNode → ConditionNode)

---

## Dev Notes

### 🎯 목표

이 Story는 **기술적 지표 노드 컴포넌트**를 구현하여 사용자가 매매 신호를 생성할 수 있게 합니다. 완료되면:
- 사용자가 노드 팔레트에서 RSI, MACD, MA 노드를 드래그하여 캔버스에 추가 가능
- 속성 패널에서 지표별 파라미터 설정 가능 (Period, Fast/Slow Period 등)
- MarketDataNode에서 받은 OHLCV 데이터를 기반으로 지표 계산
- 후속 스토리(3.5, 3.7 등)에서 지표 값을 활용하여 매매 신호 생성 가능

### 📚 Story 3.2 & 3.3에서 배운 패턴

**IndicatorNode 인터페이스** [Source: 3-2-node-type-definitions.md#AC 3]:
```typescript
interface IndicatorNode extends BaseNode {
  type: NodeType.INDICATOR;
  category: NodeCategory.TRANSFORMATION;  // 🆕 하이브리드 아키텍처
  data: {
    label: string;
    config: {
      indicatorType: IndicatorType;  // 'RSI' | 'MACD' | 'SMA' | 'EMA' | 'BOLLINGER_BANDS'
      parameters: Record<string, number>;  // e.g., { period: 14 }
      inputNodeId: string;  // Reference to market data or another indicator
    };
  };
}
```

**노드 팩토리 패턴** [Source: 3-2-node-type-definitions.md#Dev Notes]:
```typescript
// nodeFactory.ts
case NodeType.INDICATOR:
  return {
    id,
    type: NodeType.INDICATOR,
    category: NodeCategory.TRANSFORMATION,
    position,
    data: {
      label: 'Indicator',
      config: {
        indicatorType: 'RSI',
        parameters: { period: 14 },
        inputNodeId: '',
        ...config,
      },
    },
  } as IndicatorNode;
```

**연결 검증 로직** [Source: 3-2-node-type-definitions.md#연결 검증 로직]:
- MARKET_DATA → INDICATOR 가능 (TRANSFORMATION 카테고리)
- INDICATOR → INDICATOR 가능 (지표 체이닝)
- INDICATOR → CONDITION, LOGIC, ACTION 가능
- INDICATOR는 1개 입력 포트와 1개 출력 포트를 가짐

**MarketDataNode에서 OHLCV 데이터 받기** [Source: 3-3-market-data-node.md#Dev Notes]:
```typescript
// MarketDataNode 출력 (OHLCV 데이터 타입)
{
  dataType: 'OHLCV',
  symbol: 'BTC',
  timeframe: '1h',
  exchange: 'binance',
}

// IndicatorNode 입력 (MarketDataNode 또는 다른 IndicatorNode)
inputNodeId: 'market-data-node-1'  // Source node ID
```

### 🏗️ React Flow 커스텀 노드 패턴

**기존 IndicatorNodeComponent** [Source: nodeTypes/index.tsx:191-232]:
```typescript
export const IndicatorNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as IndicatorNode['data'];

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-purple-500 ${
      selected ? 'ring-2 ring-purple-300' : ''
    }`} style={{ minWidth: '200px' }}>
      {/* Input handle (Top) */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Node icon and label */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold">
          I
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Indicator</div>
        </div>
      </div>

      {/* Config display */}
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="text-purple-400">{nodeData.config.indicatorType}</span>
        </div>
        <div className="flex justify-between">
          <span>Params:</span>
          <span className="text-yellow-400">
            {Object.entries(nodeData.config.parameters)
              .map(([k, v]) => `${k}=${v}`)
              .join(', ')}
          </span>
        </div>
      </div>

      {/* Output handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
```

**확장 필요 사항:**
- 지표 타입별 아이콘 추가 (현재는 "I"로 고정)
- 노드 라벨 동적 업데이트 (예: "RSI(14)" 대신 현재 "Indicator")

### 📐 파일 구조

**Story 3.4에서 생성/수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodeTypes/
│       │   └── index.tsx                # ✅ 수정 (IndicatorNodeComponent 확장)
│       └── PropertiesPanel.tsx          # ✅ 수정 (IndicatorNode 설정 UI 추가)
├── utils/
│   ├── nodeFactory.ts                   # ✅ 수정 (createIndicatorNode 기본 파라미터)
│   ├── indicatorCalculator.ts           # ✅ 새로 생성 (지표 계산 유틸리티)
│   └── __tests__/
│       └── indicatorCalculator.test.ts  # ✅ 새로 생성 (지표 계산 테스트)
└── types/
    └── nodes.ts                          # Story 3.2에서 정의 완료
```

### 🎨 UI/UX 디자인 가이드

**노드 디자인 패턴:**
- 다크모드: `bg-gray-800`, `border-purple-500`
- 선택 상태: `ring-2 ring-purple-300`
- 텍스트: `text-white` (라벨), `text-gray-400` (보조)
- 아이콘: RSI(📊), MACD(📉), SMA(📈), EMA(📈)

**속성 패널 디자인:**
```
┌─────────────────────────────────┐
│ 📈 기술적 지표 노드 설정          │
├─────────────────────────────────┤
│ 지표 타입                        │
│ [RSI ▼] (RSI, MACD, SMA, EMA)   │
│                                  │
│ ┌─ RSI 설정 ─────────────────┐   │
│ │ Period                      │   │
│ │ [14] (2~100)                │   │
│ └──────────────────────────────┘   │
│                                  │
│ 💡 팁: technicalindicators       │
│ 라이브러리로 계산합니다           │
└─────────────────────────────────┘
```

**노드 라벨 동적 업데이트 예시:**
- RSI(Period: 14) → "RSI(14)"
- MACD(Fast: 12, Slow: 26, Signal: 9) → "MACD(12,26,9)"
- SMA(Period: 20) → "SMA(20)"
- EMA(Period: 50) → "EMA(50)"

### 🔬 technicalindicators 라이브러리 사용법

**설치:**
```bash
npm install technicalindicators
```

**RSI 계산 예시:**
```typescript
import { RSI } from 'technicalindicators';

// src/utils/indicatorCalculator.ts
export function calculateRSI(
  prices: number[],  // Close prices from OHLCV data
  period: number = 14
): number[] {
  try {
    const input = {
      values: prices,
      period: period,
    };

    const rsiValues = RSI.calculate(input);
    return rsiValues.map(r => rsi);  // Array of RSI values
  } catch (error) {
    console.error('RSI calculation error:', error);
    throw new Error(`RSI 계산 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

**MACD 계산 예시:**
```typescript
import { MACD } from 'technicalindicators';

export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  try {
    const input = {
      values: prices,
      fastPeriod: fastPeriod,
      slowPeriod: slowPeriod,
      signalPeriod: signalPeriod,
      SimpleMAOscillator: false,  // Use EMA
      SimpleMASignal: false,      // Use EMA
    };

    const macdValues = MACD.calculate(input);

    return {
      macd: macdValues.map(m => m.MACD),
      signal: macdValues.map(m => m.signal),
      histogram: macdValues.map(m => m.histogram),
    };
  } catch (error) {
    console.error('MACD calculation error:', error);
    throw new Error(`MACD 계산 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

**SMA 계산 예시:**
```typescript
import { SMA } from 'technicalindicators';

export function calculateSMA(
  prices: number[],
  period: number = 20
): number[] {
  try {
    const input = {
      values: prices,
      period: period,
    };

    const smaValues = SMA.calculate(input);
    return smaValues.map(s => s);  // Array of SMA values
  } catch (error) {
    console.error('SMA calculation error:', error);
    throw new Error(`SMA 계산 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

**EMA 계산 예시:**
```typescript
import { EMA } from 'technicalindicators';

export function calculateEMA(
  prices: number[],
  period: number = 20
): number[] {
  try {
    const input = {
      values: prices,
      period: period,
    };

    const emaValues = EMA.calculate(input);
    return emaValues.map(e => e);  // Array of EMA values
  } catch (error) {
    console.error('EMA calculation error:', error);
    throw new Error(`EMA 계산 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

**데이터 파싱 (MarketDataNode OHLCV → technicalindicators):**
```typescript
// 백테스트 엔진에서 사용 (Story 4.x)
// OHLCV 데이터에서 close 가격 추출
function extractClosePrices(ohlcvData: OHLCVData[]): number[] {
  return ohlcvData.map(candle => candle.close);
}

// 사용 예시
const closePrices = extractClosePrices(marketData);
const rsiValues = calculateRSI(closePrices, 14);
const sma20Values = calculateSMA(closePrices, 20);
const sma50Values = calculateSMA(closePrices, 50);

// Golden Cross 전략 예시
const goldenCross = sma20Values[sma20Values.length - 1] > sma50Values[sma50Values.length - 1];
```

### ⚠️ 중요 고려사항

**1. 지표 파라미터 범위:**
- RSI Period: 2~100 (일반적으로 14 사용)
- MACD Fast Period: 2~100 (일반적으로 12)
- MACD Slow Period: 2~100 (일반적으로 26, Fast Period보다 커야 함)
- MACD Signal Period: 2~100 (일반적으로 9)
- MA Period: 2~200 (일반적으로 20, 50, 200 사용)

**2. 데이터 요구사항:**
- technicalindicators 라이브러리는 최소 period개의 데이터 필요
- 예: RSI(14)는 최소 14개 캔들 필요
- 데이터가 부족하면 계산 불가 (에러 처리 필요)

**3. 지표 체이닝:**
- 단일 지표: MarketDataNode → IndicatorNode
- 다중 지표: IndicatorNode → IndicatorNode (예: RSI → EMA of RSI)
- 지표 비교: IndicatorNode(MA20) → ConditionNode(MA20 > MA50)

**4. 성능 최적화:**
- React.memo로 IndicatorNode 감싸서 불필요한 리렌더링 방지
- 지표 계산은 백테스트 엔진에서 수행 (프론트엔드에서는 설정만)
- 대량 데이터 요청 시 디바운싱 고려

**5. 에러 처리:**
- 잘못된 파라미터 (예: Period = 0)
- 데이터 부족 (예: RSI(14)에 10개 캔들만 있음)
- NaN 결과 (예: 데이터에 null/undefined 포함)

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
// src/utils/__tests__/indicatorCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateRSI, calculateMACD, calculateSMA, calculateEMA } from '../indicatorCalculator';

describe('indicatorCalculator', () => {
  // Mock OHLCV data (50 candles)
  const mockPrices = Array.from({ length: 50 }, (_, i) => 100 + Math.random() * 10);

  describe('calculateRSI', () => {
    it('calculates RSI with period 14', () => {
      const result = calculateRSI(mockPrices, 14);
      expect(result).toHaveLength(50 - 14);  // RSI는 (n - period)개 반환
      expect(result.every(r => r >= 0 && r <= 100)).toBe(true);  // RSI는 0~100 범위
    });

    it('throws error for invalid period', () => {
      expect(() => calculateRSI(mockPrices, 0)).toThrow();
    });

    it('throws error for insufficient data', () => {
      const shortData = [1, 2, 3];  // 3개만 있음
      expect(() => calculateRSI(shortData, 14)).toThrow();
    });
  });

  describe('calculateMACD', () => {
    it('calculates MACD with default parameters', () => {
      const result = calculateMACD(mockPrices);
      expect(result.macd).toBeDefined();
      expect(result.signal).toBeDefined();
      expect(result.histogram).toBeDefined();
      expect(result.macd.length).toBeGreaterThan(0);
    });

    it('calculates MACD with custom parameters', () => {
      const result = calculateMACD(mockPrices, 5, 10, 4);
      expect(result.macd).toBeDefined();
    });
  });

  describe('calculateSMA', () => {
    it('calculates SMA with period 20', () => {
      const result = calculateSMA(mockPrices, 20);
      expect(result).toHaveLength(50 - 20);
      expect(result.every(s => !isNaN(s))).toBe(true);
    });
  });

  describe('calculateEMA', () => {
    it('calculates EMA with period 20', () => {
      const result = calculateEMA(mockPrices, 20);
      expect(result).toHaveLength(50 - 20);
      expect(result.every(e => !isNaN(e))).toBe(true);
    });
  });
});
```

**파싱 로직 테스트:**
```typescript
// OHLCV 데이터 파싱 테스트
describe('extractClosePrices', () => {
  it('extracts close prices from OHLCV data', () => {
    const mockOHLCV = [
      { timestamp: 1, open: 100, high: 105, low: 95, close: 102, volume: 1000 },
      { timestamp: 2, open: 102, high: 108, low: 101, close: 107, volume: 1200 },
      { timestamp: 3, open: 107, high: 110, low: 106, close: 109, volume: 1100 },
    ];

    const closePrices = extractClosePrices(mockOHLCV);
    expect(closePrices).toEqual([102, 107, 109]);
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (IndicatorNode 인터페이스)
- ✅ Story 3.3: 시장 데이터 노드 구현 (OHLCV 데이터 소스)

**후속 Stories (이 Story의 IndicatorNode 활용):**
- Story 3.5: 기본 매수/매도 액션 구현 (지표 기반 매매 신호)
- Story 3.7: 조건부 분기 노드 구현 (예: RSI > 70 이면 매도)
- Story 4.x: 백테스팅 엔진 (지표 계산 실제 수행)

### 📖 참고 자료

**technicalindicators 공식 문서:**
- npm: https://www.npmjs.com/package/technicalindicators
- GitHub: https://github.com/anandanuj84/technicalindicators

**지표 설명:**
- **RSI (Relative Strength Index)**: 0~100 범위, 70 이상 = 과매수, 30 이하 = 과매도
- **MACD (Moving Average Convergence Divergence)**: Trend-following momentum indicator
- **SMA (Simple Moving Average)**: 단순 이동평균
- **EMA (Exponential Moving Average)**: 지수 이동평균 (최근 데이터에 더 가중치)

**React Flow 공식 문서:**
- Custom Nodes: https://reactflow.dev/docs/nodes/custom-nodes/
- Handle Component: https://reactflow.dev/docs/api/nodes/handle/

**Zustand 공식 문서:**
- TypeScript Guide: https://zustand.docs.pmnd.rs/guides/typescript

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None yet

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-4的完整AC
2. ✅ 分析了Story 3-3的实现模式作为参考
3. ✅ 确认technicalindicators库为最佳选择(稳定版本3.1.0)
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了现有节点结构(nodeTypes/index.tsx)
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: 安装并配置technicalindicators库
- Task 2: 扩展IndicatorNodeComponent (已在nodeTypes/index.tsx中)
- Task 3: 实现属性面板配置UI
- Task 4: Zustand store集成
- Task 5: 更新节点工厂
- Task 6: 测试和验证

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-4-technical-indicator-node.md` - This story file

**Frontend Files to Modify/Create (5 files)**
- `gr8-frontend/src/components/editor/nodeTypes/index.tsx` - ✅ 修改 (IndicatorNodeComponent扩展)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 修改 (IndicatorNode配置UI)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 修改 (createIndicatorNode默认参数)
- `gr8-frontend/src/utils/indicatorCalculator.ts` - ✅ 新建 (指标计算工具)
- `gr8-frontend/src/utils/__tests__/indicatorCalculator.test.ts` - ✅ 新建 (指标计算测试)

**Configuration Files:**
- `package.json` - ✅ 修改 (添加technicalindicators依赖)

**Total:** 6 files to modify/create (1 new utility + 1 test + 4 modified)

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-4 Created**
- Created comprehensive story file for IndicatorNode implementation
- Extracted all AC from epics.md
- Analyzed Story 3-3 for implementation patterns
- Integrated technicalindicators library research
- Added detailed dev notes with code examples
- Prepared testing strategy with sample test cases
