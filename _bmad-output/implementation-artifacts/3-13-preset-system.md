# Story 3.13: 프리셋 시스템 (원클릭 전략 로드)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 미리 정의된 프리셋 전략을 원클릭으로 로드하고 싶다,
**so that** 빠르게 전략을 시작하고 커스터마이즈할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅
- Story 3.3-3.9에서 다양한 노드 구현 완료 ✅
- Story 3.12에서 전략 이름/설명 수정 예정 ✅
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 처음 사용자는 빈 캔버스에서 시작하는 것이 어려움
- 인기 있는 전략 패턴이 있음에도 매번 수동으로 구성해야 함
- DCA 마틴게일, RSI 시그널 같은 일반적인 전략을 쉽게 시작할 수 없음
- 학습 곡선이 가파름

**해결:**
프리셋 시스템 구현으로 인기 있는 전략을 원클릭으로 로드

**중요:**
- **원클릭 로드**: 버튼 하나로 완전한 전략 로드
- **2가지 프리셋**: DCA 마틴게일 10단, RSI 시그널 봇
- **좌측 팔레트 프리셋 탭**: NodePalette에 프리셋 섹션 추가
- **기존 전략 초기화 경고**: 현재 작업 중인 전략 보존 확인
- **프리셋 후 커스터마이징**: 로드 후 자유롭게 수정 가능
- **FR18, FR19, FR20, FR21, FR26 충족**: 프리셋 원클릭 로드, DCA 마틴게일 10단, RSI 시그널 봇, 초기화 경고, 혼합 사용

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 프리셋 팔레트 UI 구현

**Given** 노드 에디터가 구현되었다
**When** 개발자가 좌측 팔레트에 프리셋 탭을 추가한다
**Then** NodePalette 상단에 "프리셋" 탭이 있다
**And** "노드" 탭과 "프리셋" 탭을 전환할 수 있다
**And** 프리셋 탭에 2개의 프리셋 카드가 있다

### AC 2: DCA 마틴게일 10단 프리셋

**Given** 사용자가 프리셋 탭에 있다
**When** "DCA 마틴게일 10단" 프리셋 카드를 본다
**Then** 프리셋 이름이 표시된다
**And** 프리셋 설명이 표시된다 (예: "순환매 + 마틴게일 10단 DCA 전략")
**And** "로드" 버튼이 있다
**And** 프리셋 미리보기 이미지가 있다 (선택사항)
**And** **FR19: DCA 마틴게일 10단 프리셋을 로드할 수 있다**

### AC 3: RSI 시그널 봇 프리셋

**Given** 사용자가 프리셋 탭에 있다
**When** "RSI 시그널 봇" 프리셋 카드를 본다
**Then** 프리셋 이름이 표시된다
**And** 프리셋 설명이 표시된다 (예: "RSI 30/70 시그널 봇")
**And** "로드" 버튼이 있다
**And** 프리셋 미리보기 이미지가 있다 (선택사항)
**And** **FR20: RSI 시그널 봇 프리셋을 로드할 수 있다**

### AC 4: 프리셋 원클릭 로드

**Given** 사용자가 프리셋 카드의 "로드" 버튼을 클릭한다
**When** 캔버스가 비어있거나 사용자가 기존 전략 삭제를 확인한다
**Then** 프리셋 전략이 캔버스에 로드된다
**And** 모든 노드가 배치된다
**And** 모든 엣지가 연결된다
**And** 전략 이름이 프리셋 이름으로 설정된다
**And** 전략 설명이 프리셋 설명으로 설정된다
**And** **FR18: 프리셋 전략을 원클릭으로 로드할 수 있다**

### AC 5: 기존 전략 초기화 경고

**Given** 사용자가 현재 작업 중인 전략이 있다 (1개 이상의 노드)
**When** 프리셋 "로드" 버튼을 클릭한다
**Then** 확인 모달이 표시된다
**And** "현재 캔버스의 내용은 삭제됩니다" 메시지가 있다
**And** "미리 저장하지 않으면 변경 사항이 손실됩니다" 경고가 있다
**And** "취소"와 "로드" 버튼이 있다
**And** **FR21: 프리셋 로드 시 기존 전략 초기화 경고가 표시된다**

### AC 6: 프리셋 후 커스터마이징

**Given** 프리셋이 로드되었다
**When** 사용자가 전략을 수정한다
**Then** 노드를 추가/삭제/수정할 수 있다
**And** 엣지를 추가/삭제/수정할 수 있다
**And** 파라미터를 변경할 수 있다
**And** **FR26: 프리셋과 수동 수정을 자유롭게 섞어서 전략을 구성할 수 있다**

---

## Tasks / Subtasks

### Task 1: 프리셋 데이터 구조 정의 (AC: #2, #3)
- [ ] Subtask 1.1: `src/types/presets.ts` 파일 생성
  ```typescript
  export interface PresetStrategy {
    id: string;
    name: string;
    description: string;
    category: 'dca' | 'signal' | 'custom';
    nodes: PresetNode[];
    edges: PresetEdge[];
    viewport: { x: number; y: number; zoom: number };
  }

  export interface PresetNode {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, any>;
  }

  export interface PresetEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }
  ```
- [ ] Subtask 1.2: DCA 마틴게일 10단 프리셋 정의
  ```typescript
  export const DCA_MARTINGALE_10_PRESET: PresetStrategy = {
    id: 'dca-martingale-10',
    name: 'DCA 마틴게일 10단',
    description: '순환매 + 마틴게일 10단 DCA 전략. 1단계 100 USDC부터 시작하여 10단계까지 2배씩 증액.',
    category: 'dca',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: '시작', config: { triggerType: 'schedule', interval: '1d' } }
      },
      {
        id: 'market-1',
        type: 'market_data',
        position: { x: 100, y: 250 },
        data: {
          label: 'BTC/USDC',
          config: { exchange: 'binance', symbol: 'BTCUSDC' }
        }
      },
      // ... 10개의 Split Buy 노드
      // ... Loop 노드
      // ... Condition 노드 (판매 조건)
      // ... Sell 노드
    ],
    edges: [
      // 모든 노드 연결
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 }
  };
  ```
- [ ] Subtask 1.3: RSI 시그널 봇 프리셋 정의
  ```typescript
  export const RSI_SIGNAL_BOT_PRESET: PresetStrategy = {
    id: 'rsi-signal-bot',
    name: 'RSI 시그널 봇',
    description: 'RSI 30/70 시그널 봇. RSI < 30 매수, RSI > 70 매도.',
    category: 'signal',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: '시작', config: { triggerType: 'schedule', interval: '1h' } }
      },
      {
        id: 'market-1',
        type: 'market_data',
        position: { x: 100, y: 250 },
        data: {
          label: 'BTC/USDC',
          config: { exchange: 'binance', symbol: 'BTCUSDC' }
        }
      },
      {
        id: 'indicator-1',
        type: 'indicator',
        position: { x: 350, y: 200 },
        data: {
          label: 'RSI 14',
          config: { indicatorType: 'RSI', period: 14, source: 'close' }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 600, y: 200 },
        data: {
          label: 'If RSI < 30',
          config: { operator: 'LT', leftValue: 'RSI', rightValue: 30 }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 850, y: 100 },
        data: {
          label: '매수 100 USDC',
          config: { actionType: 'BUY', amount: 100, amountType: 'quote' }
        }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 600, y: 400 },
        data: {
          label: 'If RSI > 70',
          config: { operator: 'GT', leftValue: 'RSI', rightValue: 70 }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 850, y: 500 },
        data: {
          label: '매도 전량',
          config: { actionType: 'SELL', amountType: 'percent', amount: 100 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'market-1' },
      { id: 'e2', source: 'market-1', target: 'indicator-1' },
      { id: 'e3', source: 'indicator-1', target: 'condition-1' },
      { id: 'e4', source: 'indicator-1', target: 'condition-2' },
      { id: 'e5', source: 'condition-1', target: 'action-1' },
      { id: 'e6', source: 'condition-2', target: 'action-2' }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  };
  ```
- [ ] Subtask 1.4: 프리셋 목록 내보내기
  ```typescript
  export const PRESETS: PresetStrategy[] = [
    DCA_MARTINGALE_10_PRESET,
    RSI_SIGNAL_BOT_PRESET
  ];
  ```

### Task 2: 프리셋 로드 서비스 구현 (AC: #4)
- [ ] Subtask 2.1: `src/services/presetLoader.ts` 파일 생성
  ```typescript
  import { PresetStrategy } from '@/types/presets';
  import { useEditorStore } from '@/stores/editorStore';

  export function loadPreset(preset: PresetStrategy): void {
    const { setNodes, setEdges, setViewport, updateMetadata } = useEditorStore.getState();

    // 1. 기존 전략 초기화 확인 (호출부에서 처리)

    // 2. 노드 로드
    setNodes(preset.nodes);

    // 3. 엣지 로드
    setEdges(preset.edges);

    // 4. 뷰포트 설정
    setViewport(preset.viewport);

    // 5. 메타데이터 업데이트
    updateMetadata({
      name: preset.name,
      description: preset.description
    });
  }

  export function hasUnsavedChanges(): boolean {
    const { nodes } = useEditorStore.getState();
    return nodes.length > 0;
  }
  ```
- [ ] Subtask 2.2: UUID 재생성 로직 (선택사항)
  - 노드 ID 충돌 방지
  - 새 UUID 할당

### Task 3: NodePalette 프리셋 탭 UI 구현 (AC: #1)
- [ ] Subtask 3.1: NodePalette에 탭 전환 기능 추가
  ```tsx
  const [activeTab, setActiveTab] = useState<'nodes' | 'presets'>('nodes');

  <div className="flex border-b">
    <button
      className={`px-4 py-2 ${activeTab === 'nodes' ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab('nodes')}
    >
      노드
    </button>
    <button
      className={`px-4 py-2 ${activeTab === 'presets' ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab('presets')}
    >
      프리셋
    </button>
  </div>
  ```
- [ ] Subtask 3.2: 프리셋 탭 컨텐츠 구현
  ```tsx
  {activeTab === 'presets' && (
    <div className="p-4 space-y-4">
      {PRESETS.map((preset) => (
        <PresetCard key={preset.id} preset={preset} onLoad={handleLoadPreset} />
      ))}
    </div>
  )}
  ```
- [ ] Subtask 3.3: 반응형 디자인
  - 데스크톱: 2열 그리드
  - 태블릿: 1열
  - 모바일: 축소형 카드

### Task 4: PresetCard 컴포넌트 구현 (AC: #2, #3)
- [ ] Subtask 4.1: `PresetCard.tsx` 컴포넌트 생성
  ```tsx
  interface PresetCardProps {
    preset: PresetStrategy;
    onLoad: (preset: PresetStrategy) => void;
  }

  export function PresetCard({ preset, onLoad }: PresetCardProps) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border hover:border-blue-500 transition">
        <h3 className="font-bold text-lg mb-2">{preset.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{preset.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {preset.nodes.length} nodes
          </span>
          <button
            onClick={() => onLoad(preset)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-sm"
          >
            로드
          </button>
        </div>
      </div>
    );
  }
  ```
- [ ] Subtask 4.2: 프리셋 아이콘 추가 (선택사항)
  - DCA: 📊 (차트 아이콘)
  - RSI: 📈 (시그널 아이콘)
- [ ] Subtask 4.3: 호버 효과
  - 테두리 색상 변경
  - 그림자 효과

### Task 5: 기존 전략 초기화 경고 모달 (AC: #5)
- [ ] Subtask 5.1: `ConfirmLoadPresetModal.tsx` 컴포넌트 생성
  ```tsx
  interface ConfirmLoadPresetModalProps {
    preset: PresetStrategy;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

  export function ConfirmLoadPresetModal({
    preset,
    isOpen,
    onClose,
    onConfirm
  }: ConfirmLoadPresetModalProps) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold">프리셋 로드 확인</h2>
          </div>

          <p className="text-gray-300 mb-2">
            현재 캔버스의 내용은 삭제됩니다.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            미리 저장하지 않으면 변경 사항이 손실됩니다.
          </p>

          <div className="bg-gray-700 rounded p-3 mb-4">
            <p className="text-sm font-semibold">{preset.name}</p>
            <p className="text-xs text-gray-400">{preset.description}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              로드
            </button>
          </div>
        </div>
      </div>
    );
  }
  ```
- [ ] Subtask 5.2: 경고 아이콘 (AlertTriangle from lucide-react)
- [ ] Subtask 5.3: 프리셋 정보 요약 표시

### Task 6: 프리셋 로드 핸들러 구현 (AC: #4, #5, #6)
- [ ] Subtask 6.1: NodePalette에서 핸들러 구현
  ```tsx
  const [selectedPreset, setSelectedPreset] = useState<PresetStrategy | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLoadPreset = (preset: PresetStrategy) => {
    if (hasUnsavedChanges()) {
      setSelectedPreset(preset);
      setShowConfirmModal(true);
    } else {
      loadPreset(preset);
    }
  };

  const handleConfirmLoad = () => {
    if (selectedPreset) {
      loadPreset(selectedPreset);
      setShowConfirmModal(false);
      setSelectedPreset(null);
    }
  };
  ```
- [ ] Subtask 6.2: 프리셋 로드 후 Toast 메시지
  ```tsx
  import toast from 'react-hot-toast';

  const handleConfirmLoad = () => {
    if (selectedPreset) {
      loadPreset(selectedPreset);
      toast.success(`${selectedPreset.name}이 로드되었습니다.`);
      setShowConfirmModal(false);
      setSelectedPreset(null);
    }
  };
  ```
- [ ] Subtask 6.3: 캔버스 자동 맞춤 (fitView)
  ```tsx
  import { useReactFlow } from '@xyflow/react';

  const reactFlowInstance = useReactFlow();
  reactFlowInstance.fitView({ nodes: preset.nodes, padding: 0.2 });
  ```

### Task 7: DCA 마틴게일 10단 프리셋 완성 (AC: #2)
- [ ] Subtask 7.1: 10개의 Split Buy 노드 정의
  - 1단계: 100 USDC
  - 2단계: 200 USDC
  - 3단계: 400 USDC
  - ...
  - 10단계: 51,200 USDC
- [ ] Subtask 7.2: Loop 노드 구성
  - 매수 사이클 반복
  - 조건: 미체결 수량 > 0
- [ ] Subtask 7.3: Condition 노드 (판매 조건)
  - 목표가: +5%
  - 손절가: -10%
- [ ] Subtask 7.4: 모든 엣지 연결

### Task 8: RSI 시그널 봇 프리셋 완성 (AC: #3)
- [ ] Subtask 8.1: Trigger 노드 (1시간 간격)
- [ ] Subtask 8.2: MarketData 노드 (BTC/USDC)
- [ ] Subtask 8.3: Indicator 노드 (RSI 14)
- [ ] Subtask 8.4: Condition 노드 2개 (매수: RSI < 30, 매도: RSI > 70)
- [ ] Subtask 8.5: Action 노드 2개 (매수 100 USDC, 매도 전량)
- [ ] Subtask 8.6: 모든 엣지 연결

### Task 9: 단위 테스트 작성 (Vitest)
- [ ] Subtask 9.1: PresetLoader 테스트
  - loadPreset() 함수
  - hasUnsavedChanges() 함수
  - 메타데이터 업데이트 확인
- [ ] Subtask 9.2: 프리셋 데이터 구조 검증
  - DCA 마틴게일 10단 노드 수
  - RSI 시그널 봇 노드 수
  - 모든 엣지 연결 확인
- [ ] Subtask 9.3: PresetCard 컴포넌트 테스트
  - 로드 버튼 클릭
  - 핸들러 호출 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **프리셋 시스템**을 구현하여 사용자가 인기 있는 전략을 원클릭으로 로드할 수 있게 합니다. 완료되면:
- 좌측 팔레트에 "프리셋" 탭 추가
- 2개의 프리셋 제공 (DCA 마틴게일 10단, RSI 시그널 봇)
- 원클릭으로 완전한 전략 로드
- 기존 전략 초기화 경고
- 프리셋 후 자유로운 커스터마이징
- FR18, FR19, FR20, FR21, FR26 충족

### 📚 프리셋 시스템 아키텍처

**데이터 흐름:**
```
PresetStrategy (정의)
    ↓
PresetCard (UI)
    ↓
loadPreset() (서비스)
    ↓
Zustand Store (상태 업데이트)
    ↓
ReactFlow (렌더링)
```

**파일 구조:**
```
src/
├── types/
│   └── presets.ts                     # ✅ 새로 생성 (PresetStrategy, PRESETS)
├── services/
│   └── presetLoader.ts                # ✅ 새로 생성 (loadPreset, hasUnsavedChanges)
├── components/
│   └── editor/
│       ├── NodePalette.tsx            # ✅ 수정 (탭 전환)
│       ├── PresetCard.tsx             # ✅ 새로 생성
│       └── ConfirmLoadPresetModal.tsx # ✅ 새로 생성
└── presets/
    ├── dcaMartingale10.ts             # ✅ 새로 생성 (DCA 마틴게일 10단 정의)
    └── rsiSignalBot.ts                # ✅ 새로 생성 (RSI 시그널 봇 정의)
```

### 🏗️ DCA 마틴게일 10단 프리셋 상세

**전략 로직:**
1. **시작**: 1일 간격 트리거
2. **시장 데이터**: BTC/USDC (Binance)
3. **DCA 로직**: 10단계 매수
   - 1단계: 100 USDC (총 $100)
   - 2단계: 200 USDC (총 $300)
   - 3단계: 400 USDC (총 $700)
   - 4단계: 800 USDC (총 $1,500)
   - 5단계: 1,600 USDC (총 $3,100)
   - 6단계: 3,200 USDC (총 $6,300)
   - 7단계: 6,400 USDC (총 $12,700)
   - 8단계: 12,800 USDC (총 $25,500)
   - 9단계: 25,600 USDC (총 $51,100)
   - 10단계: 51,200 USDC (총 $102,300)
4. **반복**: 1-10단계 순환 (Loop 노드)
5. **판매 조건**:
   - 목표가: 평균 단가 +5%
   - 손절가: 평균 단가 -10%

**노드 구성:**
```
[시작 Trigger] → [BTC/USDC MarketData] → [Loop] → [Split Buy 1] (100)
                                              ↓ [Loop]
                                         [Split Buy 2] (200)
                                              ↓ ...
                                         [Split Buy 10] (51,200)
                                              ↓
                                         [Condition: 목표가/손절가]
                                              ↓
                                         [Sell: 전량]
```

### 🏗️ RSI 시그널 봇 프리셋 상세

**전략 로직:**
1. **시작**: 1시간 간격 트리거
2. **시장 데이터**: BTC/USDC (Binance)
3. **RSI 계산**: RSI 14 기간
4. **매수 조건**: RSI < 30 (과매도)
5. **매도 조건**: RSI > 70 (과매수)
6. **매수/매도**: 100 USDC / 전량

**노드 구성:**
```
        [시작 Trigger]
              ↓
     [BTC/USDC MarketData]
              ↓
         [RSI 14 Indicator]
              ↓
        ┌─────┴─────┐
        ↓           ↓
[Condition: RSI < 30]  [Condition: RSI > 70]
        ↓                    ↓
   [매수 100 USDC]      [매도 전량]
```

### 📐 NodePalette 탭 전환 UI

**Tab Switcher:**
```tsx
import { useState } from 'react';
import { NodePalette } from './NodePalette';
import { PresetPalette } from './PresetPalette';

export function StrategySidebar() {
  const [activeTab, setActiveTab] = useState<'nodes' | 'presets'>('nodes');

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'nodes'
              ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('nodes')}
        >
          노드
        </button>
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'presets'
              ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('presets')}
        >
          프리셋
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'nodes' ? <NodePalette /> : <PresetPalette />}
      </div>
    </div>
  );
}
```

### 📐 PresetCard 컴포넌트

```tsx
import { BookOpen, TrendingUp } from 'lucide-react';
import type { PresetStrategy } from '@/types/presets';

interface PresetCardProps {
  preset: PresetStrategy;
  onLoad: (preset: PresetStrategy) => void;
}

export function PresetCard({ preset, onLoad }: PresetCardProps) {
  const getCategoryIcon = () => {
    switch (preset.category) {
      case 'dca':
        return <TrendingUp className="text-green-400" size={20} />;
      case 'signal':
        return <BookOpen className="text-blue-400" size={20} />;
      default:
        return <BookOpen className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-1">{getCategoryIcon()}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-base mb-1">{preset.name}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{preset.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <span className="text-xs text-gray-500">
          {preset.nodes.length} nodes • {preset.edges.length} connections
        </span>
        <button
          onClick={() => onLoad(preset)}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition"
        >
          로드
        </button>
      </div>
    </div>
  );
}
```

### ⚠️ 중요 고려사항

**1. 노드 ID 충돌 방지:**
- 각 프리셋 로드 시 새 UUID 생성
- 또는 프리셋 내에서 고유 ID 보장

**2. 메타데이터 관리:**
- 프리셋 로드 시 메타데이터 덮어쓰기
- 사용자가 수정하면 자동 저장

**3. 학습 곡선:**
- 프리셋은 입문자용
- 복잡한 전략은 수동 구현 유도

**4. 프리셋 확장성:**
- 나중에 새로운 프리셋 추가 가능
- 커뮤니티 프리셋 (Story 5. 마켓플레이스)

**5. 성능:**
- 프리셋 로드는 빨라야 함 (< 1초)
- 대형 프리셋(50+ 노드)도 최적화

### 💡 향후 확장

**추가 프리셋 (후속 Stories):**
- Story 3.14: LLM 대화형 전략 구축 (AI Co-pilot)
- Story 5.x: 커뮤니티 프리셋 (마켓플레이스)
- 사용자 정의 프리셋 (내 전략을 프리셋으로 저장)

**프리셋 공유:**
- JSON export로 프리셋 공유
- GitHub에 프리셋 라이브러리
- 커뮤니티 기여 프로그램

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터
- ✅ Story 3.2: 노드 타입 정의
- ✅ Story 3.3-3.9: 다양한 노드 구현

**후속 Stories (이 Story의 프리셋 활용):**
- Story 3.14: LLM 대화형 전략 구축 (프리셋 + AI 수정)
- Story 5.x: 전략 마켓플레이스 (프리셋 공유/판매)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ PRD에서 FR18-FR21, FR26 추출
2. ✅ 프리셋 시스템 아키텍처 설계
3. ✅ DCA 마틴게일 10단 프리셋 설계
4. ✅ RSI 시그널 봇 프리셋 설계
5. ✅ NodePalette 탭 전환 UI 설계

**实施计划:**
- Task 1: 프리셋 데이터 구조 정의
- Task 2: 프리셋 로드 서비스 구현
- Task 3: NodePalette 프리셋 탭 UI 구현
- Task 4: PresetCard 컴포넌트 구현
- Task 5: 기존 전략 초기화 경고 모달
- Task 6: 프리셋 로드 핸들러 구현
- Task 7: DCA 마틴게일 10단 프리셋 완성
- Task 8: RSI 시그널 봇 프리셋 완성
- Task 9: 단위 테스트 작성

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-13-preset-system.md` - This story file

**Frontend Files to Create (4 files)**
- `gr8-frontend/src/types/presets.ts` - ✅ 새로 생성 (PresetStrategy 인터페이스, PRESETS 배열)
- `gr8-frontend/src/services/presetLoader.ts` - ✅ 새로 생성 (loadPreset, hasUnsavedChanges)
- `gr8-frontend/src/components/editor/PresetCard.tsx` - ✅ 새로 생성 (프리셋 카드)
- `gr8-frontend/src/components/editor/ConfirmLoadPresetModal.tsx` - ✅ 새로 생성 (로드 확인 모달)

**Files to Modify (2 files)**
- `gr8-frontend/src/components/editor/NodePalette.tsx` - ✅ 수정 (탭 전환 기능)
- `gr8-frontend/src/components/editor/StrategySidebar.tsx` - ✅ 생성 (Tab Switcher 래퍼)

**Dependencies to Install:**
- None (lucide-react 이미 설치됨)

**Test Files:**
- `gr8-frontend/src/services/__tests__/presetLoader.test.ts` - ✅ 새로 생성
- `gr8-frontend/src/components/editor/__tests__/PresetCard.test.tsx` - ✅ 새로 생성

**Total:** 4 files to create, 2 files to modify

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-29 - Story 3-13 Created**
- Created comprehensive story file for Preset System
- Designed 2 preset strategies (DCA Martingale 10, RSI Signal Bot)
- Defined PresetStrategy data structure
- Designed NodePalette tab switching UI
- Added preset loading service with warning modal
- Implemented FR18, FR19, FR20, FR21, FR26
