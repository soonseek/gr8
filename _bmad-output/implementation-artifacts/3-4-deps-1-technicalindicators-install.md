# Story 3-4-deps-1: technicalindicators 라이브러리 설치 및 타입 정의

Status: ready-for-dev

---

## Story

**As a** 개발자 (Developer),
**I want** technicalindicators 라이브러리를 설치하고 TypeScript 타입을 정의하고 싶다,
**so that** Story 3-4에서 기술적 지표 계산 기능을 사용할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3-4(기술적 지표 노드)가 ready-for-dev 상태
- Story 3-4의 AC 7에서 technicalindicators 라이브러리 사용 필요
- Story 3-4의 Task 1.1에서 `npm install technicalindicators` 실행 필요

**문제:**
- technicalindicators npm 패키지가 설치되지 않음
- TypeScript 타입 정의(@types/technicalindicators)가 존재하지 않음
- Story 3-4 구현 시 지표 계산 기능 사용 불가

**해결:**
npm 패키지 설치 및 TypeScript 타입 정의 생성

**중요:**
- 이 Story는 **Story 3-4의 선행 조건**
- 3-4 구현 시작 전에 반드시 완료되어야 함
- Gap-Filler Story: Pre-Implementation Check에서 발견된 Layer 2 Gap 해소

---

## 수용 기준 (Acceptance Criteria)

### AC 1: npm 패키지 설치

**Given** gr8-frontend 프로젝트가 존재한다
**When** 개발자가 `npm install technicalindicators`를 실행한다
**Then** technicalindicators 패키지가 node_modules에 설치된다
**And** package.json의 dependencies에 technicalindicators가 추가된다
**And** 설치 버전이 3.1.0 이상(안정화된 버전)인지 확인한다

### AC 2: TypeScript 타입 정의 생성

**Given** technicalindicators 라이브러리가 설치되었다
**When** 개발자가 `src/types/indicators.ts`를 생성한다
**Then** technicalindicators 관련 TypeScript 타입이 정의된다
**And** RSI, MACD, SMA, EMA 계산 함수 타입이 export된다
**And** TypeScript 컴파일 에러가 발생하지 않는다

### AC 3: 라이브러리 기능 테스트

**Given** technicalindicators 라이브러리와 타입 정의가 준비되었다
**When** 개발자가 간단한 테스트 코드를 실행한다
**Then** RSI, MACD, SMA, EMA 계산이 정상 작동한다
**And** 계산 결과가 기대한 범위 내에 있다 (예: RSI 0~100)

---

## Tasks / Subtasks

### Task 1: npm 패키지 설치 (AC: #1)
- [ ] Subtask 1.1: gr8-frontend 디렉토리로 이동
- [ ] Subtask 1.2: `npm install technicalindicators` 실행
- [ ] Subtask 1.3: package.json 업데이트 확인
- [ ] Subtask 1.4: 설치 버전 확인 (3.1.0 이상)

### Task 2: TypeScript 타입 정의 생성 (AC: #2)
- [ ] Subtask 2.1: `src/types/indicators.ts` 파일 생성
- [ ] Subtask 2.2: RSIInput, RSIOutput 타입 정의
- [ ] Subtask 2.3: MACDInput, MACDOutput 타입 정의
- [ ] Subtask 2.4: SMAInput, SMAOutput 타입 정의
- [ ] Subtask 2.5: EMAInput, EMAOutput 타입 정의
- [ ] Subtask 2.6: 지표 계산 함수 타입 export

### Task 3: 타입 컴파일 검증 (AC: #2, #3)
- [ ] Subtask 3.1: `npx tsc --noEmit` 실행 (TypeScript 컴파일 확인)
- [ ] Subtask 3.2: 타입 에러 수정 (있는 경우)
- [ ] Subtask 3.3: 모든 에러 해소 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **technicalindicators 라이브러리 설치 및 TypeScript 타입 정의**를 완료하여 Story 3-4(기술적 지표 노드)의 선행 조건을 충족합니다. 완료되면:
- Story 3-4에서 바로 technicalindicators를 import하여 사용 가능
- TypeScript 컴파일 에러 없이 지표 계산 코드 작성 가능
- 자동 완성 및 타입 체크 기능 활용 가능

### 📦 technicalindicators 라이브러리 정보

**npm 패키지:**
- 이름: technicalindicators
- 버전: 3.1.0 (안정화된 버전)
- 설치 명령: `npm install technicalindicators`
- 링크: https://www.npmjs.com/package/technicalindicators

**지원되는 지표:**
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- Bollinger Bands
- Stochastic
- ATR (Average True Range)
- 등 50+ 종류의 기술적 지표

### 🏗️ TypeScript 타입 정의 예시

**src/types/indicators.ts:**
```typescript
/**
 * Technical Indicators Type Definitions
 * Based on technicalindicators npm package v3.1.0
 */

// RSI (Relative Strength Index)
export interface RSIInput {
  values: number[];
  period: number;
}

export interface RSIOutput {
  rsi: number;
  timestamp?: number;
}

// MACD (Moving Average Convergence Divergence)
export interface MACDInput {
  values: number[];
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  SimpleMAOscillator?: boolean;
  SimpleMASignal?: boolean;
}

export interface MACDOutput {
  MACD: number;
  signal: number;
  histogram: number;
  timestamp?: number;
}

// SMA (Simple Moving Average)
export interface SMAInput {
  values: number[];
  period: number;
}

export interface SMAOutput {
  sma: number;
  timestamp?: number;
}

// EMA (Exponential Moving Average)
export interface EMAInput {
  values: number[];
  period: number;
}

export interface EMAOutput {
  ema: number;
  timestamp?: number;
}

// Bollinger Bands
export interface BollingerBandsInput {
  values: number[];
  period: number;
  stdDev: number;
}

export interface BollingerBandsOutput {
  upper: number;
  middle: number;
  lower: number;
  timestamp?: number;
}

/**
 * Technical Indicators Calculator Interface
 */
export interface IndicatorCalculator {
  calculate(input: any): any[];
}
```

### 🧪 간단한 기능 테스트 예시

**테스트 코드 (src/utils/__tests__/technicalindicators.test.ts):**
```typescript
import { RSI, SMA, EMA, MACD } from 'technicalindicators';
import { describe, it, expect } from 'vitest';

describe('technicalindicators library', () => {
  const mockPrices = Array.from({ length: 50 }, (_, i) => 100 + Math.random() * 10);

  it('calculates RSI correctly', () => {
    const input = { values: mockPrices, period: 14 };
    const result = RSI.calculate(input);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].rsi).toBeGreaterThanOrEqual(0);
    expect(result[0].rsi).toBeLessThanOrEqual(100);
  });

  it('calculates SMA correctly', () => {
    const input = { values: mockPrices, period: 20 };
    const result = SMA.calculate(input);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].sma).toBeGreaterThan(0);
  });

  it('calculates EMA correctly', () => {
    const input = { values: mockPrices, period: 20 };
    const result = EMA.calculate(input);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].ema).toBeGreaterThan(0);
  });

  it('calculates MACD correctly', () => {
    const input = {
      values: mockPrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    };
    const result = MACD.calculate(input);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].MACD).toBeDefined();
    expect(result[0].signal).toBeDefined();
    expect(result[0].histogram).toBeDefined();
  });
});
```

### ⚠️ 주의사항

**1. 버전 호환성:**
- technicalindicators v3.1.0은 안정화된 버전
- 최신 버전(v4.x)은 breaking changes가 있을 수 있음
- Story 3-4에서는 v3.1.0 사용 권장

**2. TypeScript 타입:**
- @types/technicalindicators 패키지가 존재하지 않음
- 직접 타입 정의 필요 (src/types/indicators.ts)
- 또는 `// @ts-ignore` 사용 (비권장)

**3. 라이브러리 사용법:**
- technicalindicators는 static 메서드 방식 사용
- 예: `RSI.calculate(input)` (인스턴스 생성 불필요)
- 모든 지표가 `calculate()` 메서드 제공

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- 없음 (Leaf Story)

**후속 Stories (이 Story가 완료되어야 시작 가능):**
- Story 3-4: 기술적 지표 노드 구현 (필수 선행 조건)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ Pre-Implementation Check 결과 반영 (Layer 2 Gap)
2. ✅ technicalindicators 라이브러리 연구 완료
3. ✅ TypeScript 타입 정의 예시 작성
4. ✅ 테스트 코드 예시 작성

**实施计划:**
- Task 1: npm install technicalindicators
- Task 2: src/types/indicators.ts 생성
- Task 3: TypeScript 컴파일 검증

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-4-deps-1-technicalindicators-install.md` - This story file

**Frontend Files to Modify/Create (2 files)**
- `gr8-frontend/package.json` - ✅ 수정 (technicalindicators 의존성 추가)
- `gr8-frontend/src/types/indicators.ts` - ✅ 새로 생성 (TypeScript 타입 정의)

**Total:** 2 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-4-deps-1 Created**
- Created Gap-Filler story for technicalindicators library installation
- Identified in Pre-Implementation Check (Layer 2 Gap)
- TypeScript type definitions included
- Simple test cases provided
- Must be completed before Story 3-4 implementation
