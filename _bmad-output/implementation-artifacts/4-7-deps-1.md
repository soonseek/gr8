# Story 4-7-deps-1: React Lightweight Charts 라이브러리 설치

Status: ready-for-dev

---

## Story

**As a** 프론트엔드 개발자 (Frontend Developer),
**I want** react-lightweight-charts 라이브러리를 설치하고 싶다,
**so that** Story 4-7의 백테스트 결과 시각화 UI에서 차트를 렌더링할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS)
- Story 4-7에서 백테스트 결과 시각화 UI 구현 예정 ✅
- Recharts는 이미 설치됨 ✅ (v3.6.0)
- React Query, Axios, lucide-react 이미 설치됨 ✅

**문제:**
- Story 4.7의 핵심 차트 라이브러리인 react-lightweight-charts가 미설치됨
- 캔들스틱 차트, Buy/Sell 마커, Equity Curve 렌더링 불가능
- Story 4.7 개발 차단

**해결:**
react-lightweight-charts 설치 및 TypeScript 타입 정의

**중요:**
- **Story 4-7의 선행 조건**: 이 Story가 완료되어야 Story 4-7 개발 가능
- **TradingView 개발**: 전문 금융 차트 라이브러리
- **고성능**: Canvas 기반 렌더링 (NFR6: < 500ms 만족)
- **TypeScript 지원**: 타입 정의 내장

---

## 수용 기준 (Acceptance Criteria)

### AC 1: package.json에 react-lightweight-charts 추가

**Given** gr8-frontend/package.json이 있다
**When** 개발자가 npm install을 실행한다
**Then** react-lightweight-charts가 추가된다
**And** 버전이 최신 안정 버전이다 (>= 4.0.0)

**기술 구현:**
```bash
# gr8-frontend/

npm install react-lightweight-charts
```

**Expected package.json:**
```json
{
  "dependencies": {
    "react-lightweight-charts": "^4.1.0"  # 또는 최신 버전
  }
}
```

### AC 2: TypeScript 타입 정의 확인

**Given** react-lightweight-charts가 설치되었다
**When** 개발자가 TypeScript에서 import를 실행한다
**Then** import가 성공한다
**And** 타입 추론이 동작한다
**And** 타입 에러가 없다

**기술 구현:**
```typescript
// import_test.tsx
import { Chart, CandlestickSeries, LineSeries } from 'react-lightweight-charts';

// TypeScript 컴파일 테스트
npx tsc --noEmit
```

**Expected Result:** No TypeScript errors

### AC 3: 기본 차트 렌더링 테스트

**Given** react-lightweight-charts가 설치되었다
**When** 개발자가 간단한 차트 컴포넌트를 생성한다
**Then** 차트가 렌더링된다
**And** 캔들스틱 차트가 표시된다
**And** 콘솔에 에러가 없다

**기술 구현:**
```typescript
// test-chart.tsx
import React from 'react';
import { Chart, CandlestickSeries } from 'react-lightweight-charts';

const TestChart: React.FC = () => {
  const data = [
    { time: 1648750500, open: 100, high: 110, low: 90, close: 105 },
    { time: 1648750600, open: 105, high: 115, low: 100, close: 110 },
    { time: 1648750700, open: 110, high: 120, low: 105, close: 115 },
  ];

  return (
    <Chart width={400} height={300}>
      <CandlestickSeries data={data} />
    </Chart>
  );
};

export default TestChart;
```

### AC 4: 다크 모드 지원 확인

**Given** react-lightweight-charts가 설치되었다
**When** 개발자가 차트 테마를 설정한다
**Then** 다크 모드 테마가 적용된다
**And** 라이트 모드 테마가 적용된다

**기술 구현:**
```typescript
import { Chart, CandlestickSeries, createChart } from 'react-lightweight-charts';

// 다크 모드 테마
const darkTheme = {
  layout: {
    background: { color: '#1e1e1e' },
    textColor: '#d1d5db',
  },
  grid: {
    color: '#374151',
  },
};

<Chart width={400} height={300} options={darkTheme}>
  <CandlestickSeries data={data} />
</Chart>
```

---

## Tasks / Subtasks

### Task 1: 라이브러리 설치 (AC: #1)
- [ ] Subtask 1.1: npm install react-lightweight-charts 실행
- [ ] Subtask 1.2: package.json에 버전 확인 (>= 4.0.0)
- [ ] Subtask 1.3: node_modules 폴더에 라이브러리 설치 확인

### Task 2: TypeScript 타입 정의 확인 (AC: #2)
- [ ] Subtask 2.1: TypeScript에서 import 테스트
- [ ] Subtask 2.2: npx tsc --noEmit 실행 및 에러 없음 확인
- [ ] Subtask 2.3: 타입 추론 동작 확인

### Task 3: 기본 차트 렌더링 테스트 (AC: #3)
- [ ] Subtask 3.1: TestChart 컴포넌트 생성
- [ ] Subtask 3.2: 개발 서버 실행 (npm run dev)
- [ ] Subtask 3.3: 브라우저에서 차트 렌더링 확인

### Task 4: 다크 모드 지원 확인 (AC: #4)
- [ ] Subtask 4.1: 다크 모드 테마 적용 테스트
- [ ] Subtask 4.2: 라이트 모드 테마 적용 테스트
- [ ] Subtask 4.3: 테마 전환 동작 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **react-lightweight-charts 라이브러리를 설치**합니다. 완료되면:
- **Story 4-7 개발 가능**: 차트 렌더링 라이브러리 활용 가능
- **고성능 차트**: Canvas 기반 렌더링 (NFR6: < 500ms 만족)
- **전문 금융 차트**: TradingView 개발
- **TypeScript 지원**: 타입 정의 내장

### 📚 라이브러리 선정 이유

**react-lightweight-charts:**
- TradingView 개발 (전문 금융 차트)
- 고성능 렌더링 (Canvas 기반)
- 반응형 디자인 기본 지원
- TypeScript 타입 정의 완벽
- 다크 모드 기본 지원
- 가볍고 빠름 (lightweight 이름에 걸맞음)

**대안 라이브러리:**
- **tradingview-widget**: 기능 풍부하지만 커스터마이징 제한적, 외부 의존성
- **recharts**: D3.js 기반, 추가 지표에 적합하지만 캔들스틱 차트에는 부적절

**결론**: react-lightweight-charts가 백테스트 결과 시각화에 최적

### 🔗 Story 4-7과의 연관성

**Story 4-7에서 react-lightweight-charts를 활용하는 곳:**

1. **메인 차트 (BacktestChart)**: 캔들스틱 차트 렌더링
2. **Buy/Sell 마커**: 거래 시점 시각화
3. **Equity Curve**: 자본 곡선 라인 차트
4. **MDD 하이라이트**: 최대 낙폭 구간 시각화
5. **인터랙티브 기능**: 줌, 범위 선택, 호버

### ⚠️ 중요 고려사항

**1. 버전 호환성:**
- React 19.2.0과 호환성 확인 필요
- TypeScript 5.9.3과 호환성 확인 필요

**2. 번들 사이즈:**
- 라이브러리 크기: ~100KB (gzipped)
- Vite 트리셰이킹으로 번들 크기 최적화

**3. 브라우저 지원:**
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)

**후속 Stories (이 Story의 결과 활용):**
- Story 4-7: 백테스트 결과 시각화 UI (실제 차트 구현)

**파일 수정 목록:**
1. `gr8-frontend/package.json` - ✅ 수정 (react-lightweight-charts 추가)

**예상 소요 시간:** 30분

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Story 4-7 Pre-Implementation Check에서 Gap 발견
2. Gap 해결을 위한 보완 Story 생성
3. 4개 AC 정의 (package.json 추가, TypeScript 타입, 기본 차트 렌더링, 다크 모드)
4. 4개 Task/12개 Subtask 정의
5. Dev Notes 작성 (라이브러리 선정 이유, Story 4-7과의 연관성)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- react-lightweight-charts 설치
- TypeScript 타입 정의 확인
- 기본 차트 렌더링 테스트
- 다크 모드 지원 확인

📋 **다음 단계:**
- Story 4-7-deps-1 개발 시작 (npm install react-lightweight-charts)
- Story 4-7 개발 시작 (백테스트 결과 시각화 UI)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-7-deps-1.md` - This story file

**Frontend Files to Modify (est. 1 file)**
- `gr8-frontend/package.json` - ✅ 수정 (react-lightweight-charts 추가)

**Test Files (optional, est. 1 file)**
- `gr8-frontend/src/test-chart.tsx` - 🆕 새로 생성 (기본 차트 렌더링 테스트)

**Total:** 1-2 files to create/modify
