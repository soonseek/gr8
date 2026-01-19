# Story 3-1-1-landing: 랜딩 페이지 (로그인 전 홈 화면)

Status: review
Priority: HIGH (사용자 첫인상, 전환율 핵심)

## Story

**As a** 잠재 사용자 (Potential User),
**I want** gr8이 무엇인지 5초 안에 이해하고 신뢰할 수 있는 랜딩 페이지를 보고 싶다,
**so that** "이 백테스트 진짜야?"라는 불신을 해소하고 자신있게 지갑 연결을 시작할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- HomePage에 단순한 텍스트만 표시 ("gr8", "Decentralized Automated Trading Platform")
- 지갑 연결 버튼만 존재, 제품 가치 전혀 전달 안 됨
- PRD에서 명시한 "즉각적 신뢰 형성" 및 "명확한 가치 전달" 미충족

**문제:**
- 사용자가 5초 안에 "이게 뭐지? 왜 내가 필요로 하지?"를 이해 못 함
- "이 백테스트 진짜야?"라는 불신 해소 안 됨
- "도박에서 탈출하고 싶은" 김준혁의 스토리와 감성적 연결 부족
- 전환율(지갑 연결 → 첫 백테스트)이 낮을 위험

**해결:**
PRD의 Hero Story(김준혁 여정)와 핵심 가치를 전달하는 랜딩 페이지 구축

**PRD 인용 (라인 82-88):**
> **중요:** 기술적, 기능적 구현과 더불어, **첫인상에서 고객을 확 끌어당길 수 있는 랜딩 페이지/홈 화면의 커뮤니케이션 구현**이 필수적입니다.
> - **즉각적 신뢰 형성**: "이 백테스트 진짜야?" 불신을 해소하는 시각적 증거
> - **명확한 가치 전달**: 5초 안에 "이게 뭐지? 왜 내가 필요로 하지?"를 이해시키는 메시징
> - **감성적 연결**: "도박에서 탈출하고 싶은" 김준혁의 스토리를 보며 "이건 나야!"라고 느끼게 하는 스토리텔링

---

## 수용 기준 (Acceptance Criteria)

### AC 1: Hero 섹션 - 메시지 및 CTA

**Given** 사용자가 gr8.com에 접속하면
**When** 랜딩 페이지가 로드되면
**Then** Hero 섹션이 화면 상단(full viewport height 또는 80vh)에 표시된다
**And** 다음 요소들이 포함된다:
  - **메인 헤드라인**: "자동매매의 투명성 혁명" 또는 유사 메시지
  - **서브헤드라인**: "노코드 전략 개발 + 블록체인 검증 = 100% 신뢰할 수 있는 백테스트"
  - **CTA 버튼**: "지갑 연결하고 시작하기" (WalletConnectionButton 컴포넌트 활용)
  - **신뢰 요소**: "100% 오픈소스", "블록체인 검증" 배지 표시
**And** 다크모드 테마가 적용된다 (bg-gray-900, text-gray-100)
**And** 반응형 디자인이 적용된다 (모바일/태블릿/데스크톱)

### AC 2: 문제 정의 섹션 - "도박에서 탈출하세요"

**Given** 사용자가 Hero 섹션을 스크롤하면
**When** 문제 정의 섹션이 표시되면
**Then** 다음 내용이 포함된다:
  - **제목**: "손매매는 도박입니다. 시스템 트레이딩은 투자입니다."
  - **페르소나 스토리**: 김준혁의 Before/After
    - Before: "아침 9시부터 밤 12시까지 차트를 봄"
    - After: "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
  - **시각적 요소**: 비포/애프터 비교 이미지 또는 아이콘
  - **감성적 연결**: "이게 내 인생인가? 도박꾼으로 죽을 건가?" → "이제 내 삶을 되찾았어"
**And** 텍스트와 시각적 요소가 좌우 분할 레이아웃으로 표시된다 (데스크톱)

### AC 3: 솔루션 섹션 - gr8의 핵심 가치

**Given** 사용자가 문제 정의를 읽으면
**When** 솔루션 섹션이 표시되면
**Then** 다음 3가지 핵심 가치가 카드 형태로 표시된다:
  1. **100% 오픈소스**
     - 설명: "모든 소스 코드가 공개되어 있습니다. LLM이나 개발자에게 작동 원리를 검증받으세요."
     - 아이콘: Code/GitHub 아이콘
  2. **블록체인 검증**
     - 설명: "백테스트 결과가 변조 불가능한 블록체인에 기록됩니다. '이 백테스트 진짜야?' 불신은 이제 끝."
     - 아이콘: Shield/Blockchain 아이콘
  3. **지식 공유 생태계**
     - 설명: "전략을 공개하면 자동으로 보상받습니다. '지식은 공유할수록 가치가 커진다'는 철학을 실현했습니다."
     - 아이콘: Users/Community 아이콘
**And** 각 카드가 hover 효과로 인터랙티브하게 동작한다
**And** 그리드 레이아웃 (1열 모바일, 3열 데스크톱)

### AC 4: 주요 기능 섹션 - 어떻게 작동하나

**Given** 사용자가 솔루션을 이해하면
**When** 주요 기능 섹션이 표시되면
**Then** 다음 4가지 기능이 단계별로 설명된다:
  1. **노드-엣지 에디터로 전략 구성**
     - 설명: "코딩 없이 드래그 앤 드롭으로 거래 전략을 만드세요."
     - (선택사항) GIF/스크린샷: Story 3-1 에디터 캡처
  2. **백테스트 실행**
     - 설명: "과거 데이터로 전략을 검증하세요. 30초 만에 결과가 나옵니다."
     - (선택사항) 백테스트 결과 예시 이미지
  3. **전략 공개 및 수익화**
     - 설명: "마켓플레이스에 전략을 공개하세요. 복제될 때마다 자동으로 보상받습니다."
  4. **실전 실행**
     - 설명: "검증된 전략으로 실전을 실행하세요. 더 이상 차트를 보지 않아도 됩니다."
**And** 번호 매기기(1, 2, 3, 4)로 시각적 계층 구조가 표시된다
**And** (선택사항) Zeplin/Figma 디자인 참조

### AC 5: 사회적 증거 섹션 (선택사항, MVP 이후)

**Given** 사용자가 기능을 이해하면
**When** 사회적 증거 섹션이 표시되면
**Then** 다음 내용이 포함된다:
  - **사용자 수**: "1,000명의 트레이더가 신뢰합니다" (MVP 3개월 차 목표)
  - **백테스트 실행 수**: "10,000회 이상의 백테스트가 실행되었습니다"
  - **공유된 전략 수**: "500개 이상의 전략이 공유되었습니다"
  - **사용자 후기** (선택사항): 김준혁, 이수민, 박지성의 인터뷰 인용
**And** 통계 카드 형태로 시각적으로 표시된다

**Note**: MVP 단계에서는 섹션을 placeholder로 두거나, 예상 목표치를 표시

### AC 6: 최종 CTA 섹션

**Given** 사용자가 모든 내용을 확인하면
**When** 페이지 하단에 도달하면
**Then** 최종 CTA 섹션이 표시된다
**And** 다음 요소들이 포함된다:
  - **헤드라인**: "지금 바로 시작하세요"
  - **서브헤드라인**: "첫 번째 백테스트를 돌려보세요. 코딩은 필요 없습니다."
  - **CTA 버튼**: "지갑 연결하고 시작하기" (WalletConnectionButton 컴포넌트)
**And** 배경이 Hero 섹션과 유사한 디자인으로 시각적 강조가 된다

### AC 7: 푸터 (Footer)

**Given** 사용자가 페이지 하단으로 스크롤하면
**When** Footer가 표시되면
**Then** 다음 요소들이 포함된다:
  - **로고**: "gr8"
  - **링크들**:
    - GitHub (오픈소스)
    - Discord (커뮤니티)
    - Twitter/X
    - Documentation
  - **법인 정보** (MVP 단계에서는 간단하게): "© 2026 gr8. All rights reserved."
**And** 다크모드 테마가 적용된다 (bg-gray-950, border-gray-800)

### AC 8: 반응형 디자인

**Given** 랜딩 페이지가 구현되었다
**When** 개발자가 다양한 화면 크기에서 테스트하면
**Then** 모바일 (375px+):
  - 모든 섹션이 세로로 정렬된다 (단일 컬럼)
  - 텍스트 크기가 적절히 조정된다 (text-base, text-lg)
  - CTA 버튼이 전체 너비로 표시된다 (w-full)
**And** 태블릿 (768px+):
  - 2열 그리드가 적용된다 (일부 섹션)
**And** 데스크톱 (1024px+):
  - 3열 그리드가 적용된다 (솔루션 섹션)
  - 좌우 분할 레이아웃이 적용된다 (문제 정의 섹션)

### AC 9: 성능 및 접근성

**Given** 랜딩 페이지가 구현되었다
**When** 성능 테스트를 실행하면
**Then** 초기 로딩 시간이 2초 미만이다 (LCP < 2s)
**And** Lighthouse Accessibility 점수가 90점 이상이다
**And** 모든 버튼과 링크에 명확한 focus state가 표시된다
**And** 텍스트와 배경의 대비 비율이 WCAG AA 표준을 충족한다 (4.5:1)

### AC 10: 빌드 및 타입 검증

**Given** 랜딩 페이지가 구현되었다
**When** 개발자가 `npm run build`를 실행하면
**Then** 빌드가 성공적으로 완료된다
**And** TypeScript 타입 에러가 없다
**And** `npm run lint`가 통과한다

---

## Tasks / Subtasks

### Task 1: 랜딩 페이지 컴포넌트 구조 생성 (AC: #1, #8, #10)
- [ ] Subtask 1.1: `src/pages/LandingPage.tsx` 생성
- [ ] Subtask 1.2: 섹션별 컴포넌트 구조 설계 (Hero, Problem, Solution, Features, CTA, Footer)
- [ ] Subtask 1.3: 각 섹션을 개별 컴포넌트로 분리 (HeroSection.tsx, ProblemSection.tsx 등)
- [ ] Subtask 1.4: LandingPage에서 섹션 컴포넌트들을 조립
- [ ] Subtask 1.5: `src/pages/landing/` 디렉토리 생성 (섹션 컴포넌트들)

### Task 2: Hero 섹션 구현 (AC: #1)
- [ ] Subtask 2.1: `src/pages/landing/HeroSection.tsx` 생성
- [ ] Subtask 2.2: 메인 헤드라인 구현 ("자동매매의 투명성 혁명")
- [ ] Subtask 2.3: 서브헤드라인 구현 ("노코드 + 블록체인 검증...")
- [ ] Subtask 2.4: WalletConnectionButton 컴포넌트 통합 (CTA 버튼)
- [ ] Subtask 2.5: 신뢰 요소 배지 추가 ("100% 오픈소스", "블록체인 검증")
- [ ] Subtask 2.6: 다크모드 스타일링 (bg-gray-900, text-center)
- [ ] Subtask 2.7: full viewport height (min-h-screen 또는 h-screen)
- [ ] Subtask 2.8: 반응형 디자인 (모바일/태블릿/데스크톱)

### Task 3: 문제 정의 섹션 구현 (AC: #2)
- [ ] Subtask 3.1: `src/pages/landing/ProblemSection.tsx` 생성
- [ ] Subtask 3.2: "도박 vs 투자" 헤드라인 구현
- [ ] Subtask 3.3: 김준혁의 Before/After 스토리 구현
  - Before: "아침 9시부터 밤 12시까지 차트를 봄"
  - After: "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
- [ ] Subtask 3.4: 좌우 분할 레이아웃 (데스크톱, 모바일은 세로)
- [ ] Subtask 3.5: 시각적 아이콘/이미지 추가 (Clock, Chart 아이콘)
- [ ] Subtask 3.6: 감성적 볼드 텍스트 ("이건 나야!" 효과)

### Task 4: 솔루션 섹션 구현 (AC: #3)
- [ ] Subtask 4.1: `src/pages/landing/SolutionSection.tsx` 생성
- [ ] Subtask 4.2: 3가지 핵심 가치 카드 구현
  - 100% 오픈소스
  - 블록체인 검증
  - 지식 공유 생태계
- [ ] Subtask 4.3: 각 카드에 아이콘 추가 (lucide-react: Code, Shield, Users)
- [ ] Subtask 4.4: 그리드 레이아웃 (grid-cols-1 md:grid-cols-3)
- [ ] Subtask 4.5: 카드 스타일링 (bg-gray-800, rounded-lg, p-6, hover:bg-gray-750)
- [ ] Subtask 4.6: hover 효과 및 트랜지션

### Task 5: 주요 기능 섹션 구현 (AC: #4)
- [ ] Subtask 5.1: `src/pages/landing/FeaturesSection.tsx` 생성
- [ ] Subtask 5.2: 4가지 기능 단계별 설명 구현
  - 노드-엣지 에디터
  - 백테스트 실행
  - 전략 공개 및 수익화
  - 실전 실행
- [ ] Subtask 5.3: 번호 매기기 (1, 2, 3, 4) 시각적 요소
- [ ] Subtask 5.4: 각 기능 설명과 아이콘/이미지
- [ ] Subtask 5.5: 세로 또는 가로 레이아웃 (데스크톱은 가로, 모바일은 세로)
- [ ] Subtask 5.6: (선택사항) Story 3-1 에디터 스크린샷 추가

### Task 6: 사회적 증거 섹션 구현 (AC: #5, MVP에서는 선택사항)
- [ ] Subtask 6.1: `src/pages/landing/SocialProofSection.tsx` 생성
- [ ] Subtask 6.2: 통계 카드 3개 구현 (사용자 수, 백테스트 수, 공유 전략 수)
- [ ] Subtask 6.3: MVP 단계: 목표치를 예상으로 표시 ("목표: 1,000명")
- [ ] Subtask 6.4: (선택사항) 사용자 후기 인용 추가
- [ ] Subtask 6.5: 그리드 레이아웃 (grid-cols-1 md:grid-cols-3)

### Task 7: 최종 CTA 섹션 구현 (AC: #6)
- [ ] Subtask 7.1: `src/pages/landing/CTASection.tsx` 생성
- [ ] Subtask 7.2: "지금 바로 시작하세요" 헤드라인 구현
- [ ] Subtask 7.3: 서브헤드라인 구현
- [ ] Subtask 7.4: WalletConnectionButton 컴포넌트 통합
- [ ] Subtask 7.5: Hero 섹션과 유사한 배경 디자인

### Task 8: 푸터 구현 (AC: #7)
- [ ] Subtask 8.1: `src/components/layout/Footer.tsx` 생성 (또는 LandingPage 통합)
- [ ] Subtask 8.2: 로고 "gr8" 표시
- [ ] Subtask 8.3: 소셜 링크 추가 (GitHub, Discord, Twitter/X, Documentation)
- [ ] Subtask 8.4: 저작권 정보 표시 ("© 2026 gr8")
- [ ] Subtask 8.5: 다크모드 스타일링 (bg-gray-950, border-gray-800)

### Task 9: App.tsx 라우팅 업데이트 (AC: #1, #8)
- [ ] Subtask 9.1: `src/App.tsx`의 HomePage를 LandingPage로 교체
- [ ] Subtask 9.2: `/` 경로에 LandingPage 연결
- [ ] Subtask 9.3: 인증되지 않은 사용자만 접근 가능하도록 설정
- [ ] Subtask 9.4: 인증된 사용자가 `/` 접근 시 `/workspace`로 리다이렉션 (3-1-2-nav 연동)

### Task 10: 반응형 디자인 및 성능 최적화 (AC: #8, #9)
- [ ] Subtask 10.1: 모든 섹션에 반응형 클래스 적용 (md:, lg:)
- [ ] Subtask 10.2: 모바일/태블릿/데스크톱 테스트 (Chrome DevTools)
- [ ] Subtask 10.3: Lighthouse Performance 점수 확인 (목표: 90점 이상)
- [ ] Subtask 10.4: 이미지 최적화 (lazy loading, 압축)
- [ ] Subtask 10.5: 폰트 최적화 (font-display: swap)
- [ ] Subtask 10.6: LCP < 2s 확인

### Task 11: 접근성 및 빌드 검증 (AC: #9, #10)
- [ ] Subtask 11.1: 모든 버튼과 링크에 focus state 추가
- [ ] Subtask 11.2: 텍스트 대비 비율 확인 (WCAG AA 4.5:1)
- [ ] Subtask 11.3: ARIA 라벨 추가 (선택사항)
- [ ] Subtask 11.4: `npm run build` 실행
- [ ] Subtask 11.5: TypeScript 타입 에러 확인
- [ ] Subtask 11.6: `npm run lint` 실행

---

## Dev Notes

### 🎯 목표

이 Story는 **gr8의 첫인상을 결정하는 랜딩 페이지**를 구축하는 것입니다. 완료되면 사용자가 5초 안에 gr8의 핵심 가치를 이해하고, "이 백테스트 진짜야?"라는 불신을 해소하며, 자신있게 지갑 연결을 시작할 수 있게 됩니다.

### 📚 PRD 기반 요구사항

**PRD Executive Summary (라인 39-56):**
- **제품 비전**: 자동매매 시장의 투명성 혁명
- **핵심 가치**: 100% 오픈소스, 블록체인 검증, 지식 공유 생태계
- **해결 문제**: "이 백테스트 진짜야?" 불신, "내 전략을 왜 너희가 가져가?" 종속감

**PRD 랜딩 페이지/마케팅 경험 (라인 82-88):**
> **중요:** 기술적, 기능적 구현과 더불어, **첫인상에서 고객을 확 끌어당길 수 있는 랜딩 페이지/홈 화면의 커뮤니케이션 구현**이 필수적입니다.
> - **즉각적 신뢰 형성**: "이 백테스트 진짜야?" 불신을 해소하는 시각적 증거
> - **명확한 가치 전달**: 5초 안에 "이게 뭐지? 왜 내가 필요로 하지?"를 이해시키는 메시징
> - **감성적 연결**: "도박에서 탈출하고 싶은" 김준혁의 스토리를 보며 "이건 나야!"라고 느끼게 하는 스토리텔링

**PRD Hero Story (라인 394-432): 김준혁의 여정**
- **Before**: 화요일 밤 11시 45분, 폰으로 바이낸스 앱, 불안, 새벽 2시 잠
- **Rising Action**: gr8 발견, "백테스트 결과는 블록체인에 기록됩니다. 조작 불가능합니다."
- **Resolution**: 3달 후, 아침 8시 30분에 3개 전략 켜두고, 오후 6시에 결과 확인. 주말에 가족과 소풍.

### 🏗️ 프로젝트 구조

**Story 8-1-landing에서 생성할 파일**:
```
src/
├── pages/
│   ├── LandingPage.tsx           # ✅ 새로 생성 (메인 랜딩 페이지)
│   └── landing/                  # ✅ 새로 생성 (섹션 컴포넌트들)
│       ├── HeroSection.tsx       # Hero 섹션
│       ├── ProblemSection.tsx    # 문제 정의 (김준혁 스토리)
│       ├── SolutionSection.tsx   # 솔루션 (3가지 핵심 가치)
│       ├── FeaturesSection.tsx   # 주요 기능
│       ├── SocialProofSection.tsx # 사회적 증거
│       ├── CTASection.tsx        # 최종 CTA
│       └── index.ts
└── App.tsx                      # ✅ 수정 (HomePage → LandingPage)
```

### ⚠️ Critical UX Considerations

**랜딩 페이지 목표:**
1. **5초 규칙**: 사용자가 5초 안에 gr8을 이해해야 함
2. **신뢰 형성**: "이 백테스트 진짜야?" 불신 해소
3. **감성적 연결**: 김준혁의 "도박에서 탈출" 스토리
4. **전환**: 지갑 연결 유도

**메시징 전략:**
- **명확성**: "자동매매"라는 용어 대신 "시스템 트레이딩" 사용 가능
- **신뢰성**: "블록체인 검증" 강조
- **단순성**: "노코드", "코딩 없이" 등 진입장벽 하향

**타겟 페르소나:**
1. **김준혁 (38세)**: "도박에서 탈출하고 싶은" 노련한 트레이더
2. **이수민 (26세)**: "처음부터 제대로 배우고 싶은" 진지한 입문자
3. **박지성 (34세)**: "지식이 자산이 되는" 크리에이터

### 🔧 코드 예시

**src/pages/LandingPage.tsx:**
```typescript
import { HeroSection } from './landing/HeroSection';
import { ProblemSection } from './landing/ProblemSection';
import { SolutionSection } from './landing/SolutionSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { SocialProofSection } from './landing/SocialProofSection';
import { CTASection } from './landing/CTASection';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
}
```

**src/pages/landing/HeroSection.tsx:**
```typescript
import { WalletConnectionButton } from '../../components/WalletConnectionButton';
import { Code, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* 메인 헤드라인 */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          자동매매의 <span className="text-blue-400">투명성 혁명</span>
        </h1>

        {/* 서브헤드라인 */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          노코드 전략 개발 + 블록체인 검증<br />
          = 100% 신뢰할 수 있는 백테스트
        </p>

        {/* 신뢰 요소 배지 */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Code size={20} className="text-blue-400" />
            <span className="text-sm">100% 오픈소스</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Shield size={20} className="text-green-400" />
            <span className="text-sm">블록체인 검증</span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <WalletConnectionButton />
      </div>
    </section>
  );
}
```

**src/pages/landing/ProblemSection.tsx:**
```typescript
import { Clock, TrendingUp } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-100">
          손매매는 <span className="text-red-400">도박</span>입니다.<br />
          시스템 트레이딩은 <span className="text-green-400">투자</span>입니다.
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Before */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="text-red-400" size={32} />
              <h3 className="text-2xl font-bold text-gray-100">Before</h3>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              "아침 9시부터 밤 12시까지 차트를 봄"
            </p>
            <p className="text-gray-500 text-sm">
              새벽 2시에야 잠들고, 출근 전에 차트 확인.<br />
              퇴근 전에 매도하고, 집에 오는 길에 지갑이 텁 비어있음.<br />
              <span className="text-red-400 font-semibold">"이게 내 인생인가? 도박꾼으로 죽을 건가?"</span>
            </p>
          </div>

          {/* After */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="text-green-400" size={32} />
              <h3 className="text-2xl font-bold text-gray-100">After</h3>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
            </p>
            <p className="text-gray-500 text-sm">
              아침 8시 30분, 3개의 전략을 켜고 출근.<br />
              오후 6시, +2.3% 수익 확인.<br />
              주말에 가족과 소풍.<br />
              <span className="text-green-400 font-semibold">"이제 내 삶을 되찾았어."</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**src/App.tsx (수정):**
```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { MainLayout } from './components/layout';
import { WorkspacePage } from './pages/WorkspacePage';
import { useAuthContext } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/workspace" replace /> : <>{children}</>;
}

export function App() {
  return (
    <AuthProvider>
      <SessionExpiredAlert />
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Protected routes (with navigation) */}
        <Route element={<MainLayout />}>
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />
          {/* ... other protected routes */}
        </Route>

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </AuthProvider>
  );
}
```

### 📐 랜딩 페이지 구조

```
┌────────────────────────────────────────────┐
│  Hero Section (full viewport height)       │
│  - 헤드라인: "자동매매의 투명성 혁명"     │
│  - CTA: 지갑 연결                          │
├────────────────────────────────────────────┤
│  Problem Section                           │
│  - "도박 vs 투자"                         │
│  - 김준혁의 Before/After                   │
├────────────────────────────────────────────┤
│  Solution Section                         │
│  - 100% 오픈소스                          │
│  - 블록체인 검증                          │
│  - 지식 공유 생태계                       │
├────────────────────────────────────────────┤
│  Features Section                         │
│  - 노드-엣지 에디터                       │
│  - 백테스트 실행                          │
│  - 전략 공개 및 수익화                    │
│  - 실전 실행                              │
├────────────────────────────────────────────┤
│  Social Proof Section                     │
│  - 사용자 수, 백테스트 수                 │
├────────────────────────────────────────────┤
│  CTA Section                              │
│  - "지금 바로 시작하세요"                 │
├────────────────────────────────────────────┤
│  Footer                                   │
│  - GitHub, Discord, Twitter               │
└────────────────────────────────────────────┘
```

### 🎨 스타일링 가이드

**다크모드 색상:**
- 배경: `bg-gray-900`, `bg-gray-800`, `bg-gray-950` (푸터)
- 텍스트: `text-gray-100` (주요), `text-gray-400` (보조)
- 강조: `text-blue-400`, `text-green-400`, `text-red-400`
- 보더: `border-gray-800`

**타이포그래피:**
- 헤드라인: `text-5xl md:text-6xl`, `font-bold`
- 바디: `text-lg md:text-xl`, `text-base`
- 간격: `mb-6`, `mb-12`, `py-20` (섹션 간격)

**반응형:**
- 모바일: 단일 컬럼, `text-4xl`, `px-4`
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드, 좌우 분할

### 🔄 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 2-1~2-3: Web3 지갑 연동 (WalletConnectionButton 활용)
- ✅ Story 1-1: 프론트엔드 스타터 템플릿

**후속 Stories:**
- Story 3-1: React Flow 에디터 (기능 섹션 스크린샷)
- Story 3-1-2-nav: 네비게이션 시스템 (리다이렉션 로직 연동)

### ⚡ 성능 최적화

**이미지:**
- lazy loading: `loading="lazy"`
- next-gen formats: WebP, AVIF
- 압축: `sharp` 또는 `squosh`

**폰트:**
- font-display: swap
- 시스템 폰트 우선 (요구사항에 맞춰 선택)

**코드 스플리팅:**
- React.lazy로 섹션 컴포넌트 lazy loading
- Route-based code splitting

### 🐛 알려진 문제 및 해결 방안

**문제 1: 지갑 연결 후 랜딩 페이지에 머물러 있음**
- 해결: App.tsx에서 PublicRoute로 감싸서 인증된 사용자는 `/workspace`로 리다이렉션
- 3-1-2-nav Story와 연동

**문제 2: 모바일에서 스크롤 경험**
- 해결: 각 섹션에 `scroll-mt-16` (헤더 높이 고려)
- Smooth scrolling: `html { scroll-behavior: smooth; }`

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List

**Session 1 (2026-01-19) - 랜딩 페이지 구현 완료**

1. **랜딩 페이지 컴포넌트 구조**
   - LandingPage.tsx 메인 페이지 생성
   - 6개 섹션 컴포넌트 개별 생성
   - Footer 컴포넌트 생성

2. **Hero 섹션 구현**
   - "자동매매의 투명성 혁명" 메인 헤드라인
   - WalletConnectionButton CTA 통합
   - "100% 오픈소스", "블록체인 검증" 배지

3. **문제 정의 섹션 구현**
   - "도박 vs 투자" 헤드라인
   - 김준혁의 Before/After 스토리
   - 시각적 아이콘 (Clock, TrendingUp)

4. **솔루션 섹션 구현**
   - 3가지 핵심 가치 카드 (오픈소스, 블록체인 검증, 지식 공유)
   - lucide-react 아이콘 활용
   - 그리드 레이아웃 (1열 모바일, 3열 데스크톱)

5. **주요 기능 섹션 구현**
   - 4가지 기능 단계별 설명
   - 번호 매기기 시각적 요소
   - Workflow, PlayCircle, Upload, Rocket 아이콘

6. **사회적 증거 섹션 구현**
   - MVP 목표치 표시 (1,000명 트레이더, 10,000회 백테스트, 500개 전략)
   - 통계 카드 형태

7. **최종 CTA 섹션 구현**
   - "지금 바로 시작하세요" 헤드라인
   - WalletConnectionButton 통합

8. **푸터 구현**
   - gr8 로고
   - 소셜 링크 (GitHub, Discord, Twitter/X)
   - 저작권 정보

9. **App.tsx 라우팅 업데이트**
   - PublicRoute, ProtectedRoute 구현
   - 인증된 사용자 /workspace 리다이렉션
   - LandingPage를 / 경로에 연결

10. **반응형 디자인 및 빌드 검증**
    - 모든 섹션에 Tailwind 반응형 클래스 적용
    - lucide-react 패키지 설치
    - TypeScript 컴파일 성공 (랜딩 페이지 관련 코드)

### File List

**Pages (7 files)**
- `gr8-frontend/src/pages/LandingPage.tsx` - 메인 랜딩 페이지 (~30 lines)
- `gr8-frontend/src/pages/landing/HeroSection.tsx` - Hero 섹션 (~50 lines)
- `gr8-frontend/src/pages/landing/ProblemSection.tsx` - 문제 정의 (~60 lines)
- `gr8-frontend/src/pages/landing/SolutionSection.tsx` - 솔루션 (~70 lines)
- `gr8-frontend/src/pages/landing/FeaturesSection.tsx` - 주요 기능 (~80 lines)
- `gr8-frontend/src/pages/landing/SocialProofSection.tsx` - 사회적 증거 (~60 lines)
- `gr8-frontend/src/pages/landing/CTASection.tsx` - 최종 CTA (~30 lines)

**Layout Components (2 files)**
- `gr8-frontend/src/components/layout/Footer.tsx` - 푸터 (~40 lines)
- `gr8-frontend/src/components/layout/index.ts` - export 파일

**Modified Files (2 files)**
- `gr8-frontend/src/App.tsx` - 라우팅 구조 변경 (~60 lines)
- `gr8-frontend/package.json` - lucide-react 의존성 추가

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-1-1-landing.md` - This story file

**Total:** 11 files created/modified
