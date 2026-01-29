# Story 4.8: 백테스트 실행 및 파라미터 설정 UI (Backtest Execution and Parameter Configuration UI)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 백테스트를 실행할 때 기간, 초기 자본, 기간 설정 등 파라미터를 쉽게 설정하고 싶다,
**so that** 원하는 조건으로 백테스트를 실행하고 전략의 성과를 검증할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS, Shadcn UI)
- Story 4-1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (API 엔드포인트 구조, 비동기 실행)
- Story 4-2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블, 다양한 타임프레임)
- Story 4-3에서 전략 실행 엔진 check-passed ✅ (BacktestEngine 구현 예정)
- Story 4-6에서 백테스트 결과 저장 check-passed ✅ (API 엔드포인트 구현 예정)
- Story 4-7에서 백테스트 결과 시각화 check ✅ (4-7-deps-1 보완 Story 생성됨)

**문제:**
- 사용자가 백테스트를 실행할 때 파라미터를 설정할 UI가 없음
- 백테스트 실행 버튼과 설정 모달이 없음
- 진행 상태를 표시하는 기능이 없음
- 예상 소요 시간을 알려주는 기능이 없음

**해결:**
백테스트 실행 버튼, 파라미터 설정 모달, 진행 상태 표시 UI 구현

**중요:**
- **FR20 커버**: 백테스트 실행 (기간 설정, 초기 자본, 타임프레임, 수수료, 슬리피지)
- **FR26 커버**: 첫 백테스트 성공률 90%+ 목표 (예상 소요 시간 표시, 에러 핸들링)
- **React Hook Form + Zod**: 폼 관리 및 검증
- **WebSocket 또는 Polling**: 실시간 진행 상태 업데이트
- **비동기 실행**: BackgroundTasks 또는 Celery
- **NFR14 준수**: 백테스트 1회 실행 < 2분 (1년 데이터 기준)

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 백테스트 실행 버튼 및 설정 모달 표시

**Given** 사용자가 전략 에디터에 있다
**When** "백테스트 실행" 버튼을 클릭한다
**Then** 백테스트 설정 모달이 표시된다
**And** 다음 파라미터를 설정할 수 있다:
  - 시작 날짜 (Date picker)
  - 종료 날짜 (Date picker)
  - 초기 자본 (Number input, 기본값 $10,000)
  - 타임프레임 (Select: 1m, 5m, 15m, 1h, 4h, 1d)
  - 수수료 (Number input, 기본값 0.1%)
  - 슬리피지 (Number input, 기본값 0.05%)

**기술 구현:**
```typescript
// Shadcn UI Dialog 활용
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BacktestConfigModalProps {
  open: boolean;
  onClose: () => void;
  strategyId: string;
  onStart: (params: BacktestParams) => void;
}

export function BacktestConfigModal({
  open,
  onClose,
  strategyId,
  onStart
}: BacktestConfigModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>백테스트 실행</DialogTitle>
          <DialogDescription>
            백테스트 파라미터를 설정하고 전략을 검증하세요.
          </DialogDescription>
        </DialogHeader>

        <BacktestParamsForm
          strategyId={strategyId}
          onSubmit={(params) => {
            onStart(params);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### AC 2: 파라미터 검증 (Zod 스키마)

**Given** 백테스트 설정 모달이 열렸다
**When** 사용자가 파라미터를 설정한다
**Then** 시작/종료 날짜의 유효성이 검증된다
**And** 초기 자본이 양수여야 한다
**And** 날짜 범위가 데이터 가용 범위 내인지 확인된다
**And** FR20: 최대 1년 범위로 제한된다 (성능 고려)

**기술 구현:**
```typescript
// src/schemas/backtestSchema.ts
import { z } from 'zod';

export const BacktestParamsSchema = z.object({
  startDate: z.date().max(new Date(), '시작 날짜는 미래일 수 없습니다'),
  endDate: z.date().max(new Date(), '종료 날짜는 미래일 수 없습니다'),
  initialCapital: z.number()
    .positive('초기 자본은 양수여야 합니다')
    .max(1000000, '초기 자본은 $1,000,000을 초과할 수 없습니다'),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']),
  commission: z.number().min(0).max(1).default(0.001),
  slippage: z.number().min(0).max(1).default(0.0005)
}).refine(
  (data) => {
    const maxEndDate = new Date(data.startDate);
    maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
    return data.endDate <= maxEndDate;
  },
  {
    message: '백테스트 기간은 최대 1년으로 제한됩니다',
    path: ['endDate']
  }
).refine(
  (data) => {
    return data.endDate > data.startDate;
  },
  {
    message: '종료 날짜는 시작 날짜보다 늦어야 합니다',
    path: ['endDate']
  }
);

export type BacktestParams = z.infer<typeof BacktestParamsSchema>;
```

**React Hook Form과 통합:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BacktestParamsSchema, type BacktestParams } from '@/schemas/backtestSchema';

function BacktestParamsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<BacktestParams>({
    resolver: zodResolver(BacktestParamsSchema),
    defaultValues: {
      initialCapital: 10000,
      timeframe: '1h',
      commission: 0.001,
      slippage: 0.0005
    }
  });

  const onSubmit = (data: BacktestParams) => {
    console.log('백테스트 파라미터:', data);
    // 백테스트 실행 로직
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 폼 필드들 */}
      {errors.startDate && (
        <p className="text-sm text-red-500">{errors.startDate.message}</p>
      )}
      {/* ... */}
    </form>
  );
}
```

### AC 3: 백테스트 비동기 실행 및 진행 상태 표시

**Given** 파라미터가 설정되었다
**When** "백테스트 시작" 버튼을 클릭한다
**Then** 백테스트가 비동기로 실행된다
**And** 진행 상태가 표시된다 (Progress bar)
**And** FR26: 첫 백테스트 성공률 90%+를 위해 예상 소요 시간이 표시된다
**And** 완료 시 알림이 표시된다
**And** NFR14: 2분 이내에 완료된다 (1년 데이터 기준)

**기술 구현:**

**1. 백엔드 API 호출 (POST /api/v1/backtests):**
```typescript
// src/services/backtestApi.ts
import { api } from '@/utils/api';
import type { BacktestParams } from '@/schemas/backtestSchema';

export interface BacktestExecutionRequest {
  strategyId: string;
  params: BacktestParams;
}

export interface BacktestExecutionResponse {
  backtestId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  estimatedTimeSeconds: number;
}

export async function executeBacktest(
  request: BacktestExecutionRequest
): Promise<BacktestExecutionResponse> {
  const response = await api.post<BacktestExecutionResponse>('/backtests', request);
  return response.data;
}
```

**2. 진행 상태 폴링 (3초마다):**
```typescript
// src/hooks/useBacktestProgress.ts
import { useEffect, useState } from 'react';

export interface BacktestStatusResponse {
  backtestId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  estimatedTimeRemaining?: number;
}

export function useBacktestProgress(backtestId: string) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'queued' | 'running' | 'completed' | 'failed'>('queued');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/v1/backtests/${backtestId}/status`);
        const data: BacktestStatusResponse = await response.json();
        setProgress(data.progress);
        setStatus(data.status);
        setEstimatedTimeRemaining(data.estimatedTimeRemaining ?? null);

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to fetch backtest status:', error);
        clearInterval(interval);
      }
    };

    pollStatus();

    interval = setInterval(pollStatus, 3000);

    return () => clearInterval(interval);
  }, [backtestId]);

  return { progress, status, estimatedTimeRemaining };
}
```

**3. Progress Modal:**
```typescript
// src/components/editor/BacktestProgressModal.tsx
import { Progress } from '@/components/ui/progress';
import { useBacktestProgress } from '@/hooks/useBacktestProgress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BacktestProgressModalProps {
  backtestId: string;
  open: boolean;
  onComplete: (resultId: string) => void;
}

export function BacktestProgressModal({
  backtestId,
  open,
  onComplete
}: BacktestProgressModalProps) {
  const { progress, status, estimatedTimeRemaining } = useBacktestProgress(backtestId);

  useEffect(() => {
    if (status === 'completed') {
      onComplete(backtestId);
    }
  }, [status, backtestId, onComplete]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>백테스트 실행 중</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>진행률: {progress}%</span>
            {estimatedTimeRemaining && (
              <span>예상 시간: {formatTime(estimatedTimeRemaining)}</span>
            )}
          </div>

          {status === 'running' && (
            <Alert>
              <AlertTitle>안내</AlertTitle>
              <AlertDescription>
                백테스트가 백그라운드에서 실행 중입니다.
                완료되면 자동으로 결과 페이지로 이동합니다.
              </AlertDescription>
            </Alert>
          )}

          {status === 'failed' && (
            <Alert variant="destructive">
              <AlertTitle>실패</AlertTitle>
              <AlertDescription>
                백테스트 실행 중 오류가 발생했습니다. 다시 시도해주세요.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}분 ${secs}초`;
}
```

### AC 4: React Hook Form 및 Zod 설치

**Given** 시스템이 설정되어 있다
**When** 개발자가 폼 관리 라이브러리를 설치한다
**Then** react-hook-form이 설치된다
**And** zod가 설치된다
**And** @hookform/resolvers가 설치된다

**기술 구현:**
```bash
# Frontend 라이브러리 설치
npm install react-hook-form zod @hookform/resolvers

# Shadcn UI 컴포넌트 (이미 설치됨)
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert
```

### AC 5: 백엔드 API 엔드포인트 구현

**Given** 백엔드가 설정되어 있다 (Story 4.1, 4.3, 4.6)
**When** 개발자가 백테스트 실행 API를 구현한다
**Then** POST /api/v1/backtests 엔드포인트가 구현된다
**And** GET /api/v1/backtests/{id}/status 엔드포인트가 구현된다
**And** 백그라운드에서 비동기 실행이 지원된다 (BackgroundTasks)
**And** WebSocket으로 진행 상태가 브로드캐스트된다

**기술 구현:**
```python
# app/api/routers/backtest.py
from fastapi import APIRouter, BackgroundTasks, Depends
from app.schemas.backtest import BacktestExecutionRequest, BacktestExecutionResponse
from app.services.backtest_service import BacktestService

router = APIRouter(prefix="/api/v1/backtests", tags=["backtests"])

@router.post("/", response_model=BacktestExecutionResponse)
async def execute_backtest(
    request: BacktestExecutionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    service = BacktestService()

    # 백테스트 레코드 생성
    backtest_id = await service.create_backtest(
        user_id=current_user.wallet_address,
        strategy_id=request.strategyId,
        params=request.params
    )

    # 백그라운드에서 실행
    background_tasks.add_task(
        service.execute_backtest,
        backtest_id=backtest_id
    )

    return BacktestExecutionResponse(
        backtestId=backtest_id,
        status="queued",
        estimatedTimeSeconds=service.estimate_execution_time(request.params)
    )

@router.get("/{backtest_id}/status")
async def get_backtest_status(
    backtest_id: str,
    current_user: User = Depends(get_current_user)
):
    service = BacktestService()
    status = await service.get_status(backtest_id)
    return status
```

### AC 6: 완료 후 결과 페이지로 이동

**Given** 백테스트가 완료되었다
**When** 진행 상태가 'completed'가 되었다
**Then** 백테스트 결과 페이지로 자동 이동한다
**And** Story 4.7에서 구현한 시각화 컴포넌트가 표시된다

**기술 구현:**
```typescript
// BacktestProgressModal의 onComplete 핸들러
useEffect(() => {
  if (status === 'completed') {
    // 결과 페이지로 이동
    navigate(`/backtest/${backtestId}`);
    onComplete(backtestId);
  }
}, [status, backtestId, navigate, onComplete]);
```

### AC 7: 에러 핸들링 및 재시도

**Given** 백테스트 실행 중 에러가 발생했다
**When** 상태가 'failed'가 되었다
**Then** 에러 메시지가 표시된다
**And** "재시도" 버튼이 제공된다
**And** 사용자가 파라미터를 수정하고 다시 시도할 수 있다

**기술 구현:**
```typescript
{status === 'failed' && (
  <Alert variant="destructive">
    <AlertTitle>백테스트 실패</AlertTitle>
    <AlertDescription>
      백테스트 실행 중 오류가 발생했습니다.
      {lastError && <p>오류: {lastError}</p>}
    </AlertDescription>
    <Button onClick={handleRetry} className="mt-2">
      재시도
    </Button>
  </Alert>
)}
```

---

## Tasks / Subtasks

### Task 1: 라이브러리 설치 (AC: #4)
- [ ] Subtask 1.1: react-hook-form 설치
- [ ] Subtask 1.2: zod 설치
- [ ] Subtask 1.3: @hookform/resolvers 설치
- [ ] Subtask 1.4: Shadcn UI 컴포넌트 추가 (dialog, progress, alert)

### Task 2: Zod 스키마 정의 (AC: #2)
- [ ] Subtask 2.1: BacktestParamsSchema 정의 (src/schemas/backtestSchema.ts)
- [ ] Subtask 2.2: 날짜 유효성 검증 (미래 날짜 불가)
- [ ] Subtask 2.3: 1년 범위 제한 검증 (FR20)
- [ ] Subtask 2.4: 초기 자본 양수 검증
- [ ] Subtask 2.5: 종료 날짜 > 시작 날짜 검증

### Task 3: BacktestConfigModal 컴포넌트 구현 (AC: #1, #2)
- [ ] Subtask 3.1: Dialog 레이아웃 구현
- [ ] Subtask 3.2: 시작 날짜 DatePicker 구현
- [ ] Subtask 3.3: 종료 날짜 DatePicker 구현
- [ ] Subtask 3.4: 초기 자본 Input 구현
- [ ] Subtask 3.5: 타임프레임 Select 구현
- [ ] Subtask 3.6: 수수료 Input 구현
- [ ] Subtask 3.7: 슬리피지 Input 구현
- [ ] Subtask 3.8: React Hook Form 통합
- [ ] Subtask 3.9: Zod 검증 에러 표시

### Task 4: 백테스트 API 서비스 구현 (AC: #5)
- [ ] Subtask 4.1: executeBacktest 함수 구현 (POST /api/v1/backtests)
- [ ] Subtask 4.2: getBacktestStatus 함수 구현 (GET /api/v1/backtests/{id}/status)
- [ ] Subtask 4.3: TypeScript 타입 정의 (BacktestExecutionRequest, BacktestExecutionResponse)

### Task 5: useBacktestProgress Hook 구현 (AC: #3)
- [ ] Subtask 5.1: 진행 상태 폴링 로직 구현 (3초마다)
- [ ] Subtask 5.2: progress, status, estimatedTimeRemaining 상태 관리
- [ ] Subtask 5.3: completed/failed 시 clearInterval

### Task 6: BacktestProgressModal 컴포넌트 구현 (AC: #3, #7)
- [ ] Subtask 6.1: Progress bar 구현 (Shadcn UI Progress)
- [ ] Subtask 6.2: 진행률 텍스트 표시
- [ ] Subtask 6.3: 예상 시간 표시 (formatTime 함수)
- [ ] Subtask 6.4: 완료 상태 Alert 표시
- [ ] Subtask 6.5: 실패 상태 Alert 표시 (에러 메시지)
- [ ] Subtask 6.6: 재시도 버튼 구현

### Task 7: 백엔드 API 엔드포인트 구현 (AC: #5)
- [ ] Subtask 7.1: app/api/routers/backtest.py 라우터 생성
- [ ] Subtask 7.2: POST /api/v1/backtests 엔드포인트 구현
- [ ] Subtask 7.3: GET /api/v1/backtests/{id}/status 엔드포인트 구현
- [ ] Subtask 7.4: Pydantic 스키마 구현 (app/schemas/backtest.py)
- [ ] Subtask 7.5: BackgroundTasks를 사용한 비동기 실행

### Task 8: 백테스트 서비스 구현 (AC: #5)
- [ ] Subtask 8.1: app/services/backtest_service.py 생성
- [ ] Subtask 8.2: create_backtest() 메서드 구현 (레코드 생성)
- [ ] Subtask 8.3: execute_backtest() 메서드 구현 (백그라운드 실행)
- [ ] Subtask 8.4: get_status() 메서드 구현 (상태 조회)
- [ ] Subtask 8.5: estimate_execution_time() 메서드 구현 (예상 시간 계산)
- [ ] Subtask 8.6: WebSocket 상태 브로드캐스트 구현

### Task 9: 결과 페이지로 이동 (AC: #6)
- [ ] Subtask 9.1: useNavigate hook 활용
- [ ] Subtask 9.2: status === 'completed' 시 자동 이동
- [ ] Subtask 9.3: Story 4.7의 BacktestResults 컴포넌트와 연결

### Task 10: 단위 테스트 작성
- [ ] Subtask 10.1: Zod 스키마 검증 테스트
- [ ] Subtask 10.2: BacktestConfigModal 컴포넌트 테스트
- [ ] Subtask 10.3: useBacktestProgress hook 테스트
- [ ] Subtask 10.4: 백테스트 API 서비스 테스트 (Mock 사용)
- [ ] Subtask 10.5: vitest 실행 및 커버리지 확인 (> 80% 목표)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스트 실행 및 파라미터 설정 UI를 구현**합니다. 완료되면:
- **백테스트 실행 버튼**: 에디터에서 "백테스트 실행" 버튼 클릭
- **설정 모달**: 파라미터 설정 (날짜, 초기 자본, 타임프레임, 수수료, 슬리피지)
- **진행 상태 표시**: Progress bar, 예상 시간, 현재 단계
- **FR20 만족**: 백테스트 실행 (기간 설정, 초기 자본)
- **FR26 만족**: 첫 백테스트 성공률 90%+ (예상 소요 시간 표시)
- **NFR14 준수**: 2분 이내 완료 (1년 데이터 기준)

### 📚 Story 4.1 (백테스팅 엔진 아키텍처)에서 배운 패턴

**비동기 실행 아키텍처** [Source: 4-1-backtest-engine-architecture.md line 1806-1809]:
```python
# FastAPI BackgroundTasks 또는 Celery for 비동기 실행
from fastapi import BackgroundTasks

@router.post("/")
async def execute_backtest(
    request: BacktestExecutionRequest,
    background_tasks: BackgroundTasks
):
    # 백그라운드에서 실행
    background_tasks.add_task(
        service.execute_backtest,
        backtest_id=backtest_id
    )
```

**폴더 구조** [Source: 4-1-backtest-engine-architecture.md line 1790-1801]:
```
backend/
  app/
    backtest/
      engine.py         # 백테스팅 엔진 코어
      executor.py       # 전략 실행기
      data_fetcher.py   # 과거 데이터 가져오기
      metrics.py        # 성과 지표 계산
      storage.py        # 결과 저장
      api.py           # FastAPI 라우터
```

### 🏗️ 핵심 구현 전략

**1. React Hook Form + Zod 조합**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BacktestParamsSchema } from '@/schemas/backtestSchema';

const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
    resolver: zodResolver(BacktestParamsSchema),
  });

// Zod 스키마와 React Hook Form 완벽 통합
```

**2. FR20: 최대 1년 범위 제한**
```typescript
.refine(
  (data) => {
    const maxEndDate = new Date(data.startDate);
    maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
    return data.endDate <= maxEndDate;
  },
  {
    message: '백테스트 기간은 최대 1년으로 제한됩니다',
    path: ['endDate']
  }
)
```

**3. FR26: 첫 백테스트 성공률 90%+ 목표**
- 예상 소요 시간 표시 (사용자 기대치 관리)
- 포괄적인 에러 핸들링
- 명확하고 조작 가능한 에러 메시지

**4. Polling vs WebSocket**
- **Polling (MVP)**: 3초마다 상태 조회 (구현 간단)
- **WebSocket (권장)**: 실시간 상태 브로드캐스트 (확장성)

**5. NFR14: 2분 이내 완료 보장**
- 병렬 처리 지원
- 캐싱 전략 활용 (Story 4.2의 Redis)
- 데이터 샘플링 (너무 많은 데이터 포인트 다운샘플링)

### 📊 데이터 흐름

```
1. 사용자가 "백테스트 실행" 버튼 클릭
   ↓
2. BacktestConfigModal 표시
   ↓
3. 사용자가 파라미터 입력:
   - startDate: "2024-01-01"
   - endDate: "2024-12-31"
   - initialCapital: 10000
   - timeframe: "1h"
   - commission: 0.001
   - slippage: 0.0005
   ↓
4. Zod 스키마 검증 (클라이언트 사이드)
   ↓
5. POST /api/v1/backtests
   ↓
6. 백엔드 BacktestService.execute_backtest()
   ├─ DataFetcher.fetch()
   ├─ BacktestEngine.run()
   └─ MetricsCalculator.calculate_all_metrics()
   ↓
7. WebSocket/Polling으로 진행 상태 업데이트
   ↓
8. 완료 시 결과 페이지로 이동 (/backtest/:backtestId)
   ↓
9. Story 4.7의 BacktestResults 컴포넌트 표시
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)
- ✅ Story 4-1: 백테스팅 엔진 아키텍처 설계 (API 구조, 비동기 실행)
- ✅ Story 4-2: 과거 시장 데이터 수집 (다양한 타임프레임)
- ⚠️ Story 4-3: 전략 실행 엔진 (BacktestEngine) - **선행 필수**
- ⚠️ Story 4-6: 백테스트 결과 저장 (API 엔드포인트) - **선행 필수**
- ⚠️ Story 4-7: 백테스트 결과 시각화 (차트 컴포넌트) - **선행 필수**

**후속 Stories (이 Story의 결과 활용):**
- Story 4.9: 템플릿 전략 백테스트 결과 제공
- Story 4.10: 백테스트 검증 (자동화된 테스트 케이스)

**파일 생성/수정 목록:**
1. `gr8-frontend/src/schemas/backtestSchema.ts` - 🆕 새로 생성 (Zod 스키마)
2. `gr8-frontend/src/components/editor/BacktestConfigModal.tsx` - 🆕 새로 생성
3. `gr8-frontend/src/components/editor/BacktestProgressModal.tsx` - 🆕 새로 생성
4. `gr8-frontend/src/hooks/useBacktestProgress.ts` - 🆕 새로 생성
5. `gr8-frontend/src/services/backtestApi.ts` - 🆕 새로 생성
6. `gr8-frontend/src/types/backtest.ts` - 🆕 새로 생성
7. `gr8-backend/app/api/routers/backtest.py` - 🆕 새로 생성
8. `gr8-backend/app/schemas/backtest.py` - 🆕 새로 생성
9. `gr8-backend/app/services/backtest_service.py` - 🆕 새로 생성
10. `tests/unit/test_backtestConfig.test.tsx` - 🆕 새로 생성

### ⚠️ 중요 고려사항

**1. 백엔드 의존성:**
- Story 4.8는 백엔드 API와 밀접하게 연결됨
- Story 4.3 (BacktestEngine), Story 4.6 (API)가 먼저 구현되어야 함
- **권장**: Story 4.3 → Story 4.6 → Story 4.8 순서 개발

**2. FR26 성공률 90%+ 달성 전략:**
- 입력 검증 강화 (Zod 스키마)
- 예상 소요 시간 표시 (사용자 기대치 관리)
- 포괄적인 에러 핸들링
- 명확한 에러 메시지
- Datadog/CloudWatch로 성공률 모니터링

**3. NFR14 < 2분 보장:**
- 병렬 처리 지원
- Redis 캐싱 활용
- 데이터 샘플링
- 쿼리 최적화

**4. Polling vs WebSocket:**
- **MVP**: Polling (3초마다, 구현 간단)
- **확장성**: WebSocket (실시간, 확장성)

**5. 날짜 범위 검증:**
- FR20: 최대 1년 제한
- 시작/종료 날짜 유효성
- 종료 > 시작 검증
- 데이터 가용 범위 확인

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.8 요구사항 분석 (epics.md)
2. Story 4.7 문서 분석 (시각화 UI)
3. 이전 Stories (4-1~4-7) 의존성 분석
4. 7개 AC 정의 (설정 모달, 파라미터 검증, 비동기 실행, 진행 상태, 라이브러리, API, 결과 이동, 에러 핸들링)
5. 10개 Task/45개 Subtask 정의
6. Dev Notes 작성 (데이터 흐름, FR26 성공률 전략, NFR14 준수)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- 백테스트 실행 버튼 + 설정 모달
- React Hook Form + Zod 검증
- 비동기 실행 (BackgroundTasks)
- 진행 상태 표시 (Progress bar, 예상 시간)
- WebSocket/Polling 상태 업데이트
- 완료 후 결과 페이지 이동
- FR20 만족, FR26 90%+ 성공률

📋 **다음 단계:**
- Story 4-8 개발 시작 (모달, 폼, API, 진행 상태)
- Story 4-9: 템플릿 전략 백테스트 결과 제공

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-8-backtest-ui.md` - This story file

**Frontend Files to Create (est. 6 files)**
- `gr8-frontend/src/schemas/backtestSchema.ts` - 🆕 새로 생성 (Zod 스키마)
- `gr8-frontend/src/components/editor/BacktestConfigModal.tsx` - 🆕 새로 생성
- `gr8-frontend/src/components/editor/BacktestProgressModal.tsx` - 🆕 새로 생성
- `gr8-frontend/src/hooks/useBacktestProgress.ts` - 🆕 새로 생성
- `gr8-frontend/src/services/backtestApi.ts` - 🆕 새로 생성
- `gr8-frontend/src/types/backtest.ts` - 🆕 새로 생성

**Backend Files to Create (est. 3 files)**
- `gr8-backend/app/api/routers/backtest.py` - 🆕 새로 생성
- `gr8-backend/app/schemas/backtest.py` - 🆕 새로 생성
- `gr8-backend/app/services/backtest_service.py` - 🆕 새로 생성

**Test Files (est. 1 file)**
- `tests/unit/test_backtestConfig.test.tsx` - 🆕 새로 생성

**Total:** 9-11 files to create
