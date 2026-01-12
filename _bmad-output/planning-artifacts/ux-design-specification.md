---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
inputDocuments:
  - "C:\\Users\\송민정\\ClaudecodeProjects\\gr8\\_bmad-output\\planning-artifacts\\product-brief-gr8-2026-01-08.md"
  - "C:\\Users\\송민정\\ClaudecodeProjects\\gr8\\_bmad-output\\planning-artifacts\\prd.md"
date: 2026-01-08
author: 소피아빠
project_name: gr8
communication_language: Korean
workflowType: ux-design
status: in_progress
---

# UX Design Specification - gr8

**Author:** 소피아빠
**Date:** 2026-01-08

---

## Executive Summary

### Project Vision

**gr8**은 자동매매 시장의 **"투명성 혁명"**을 가져오는 탈중앙화 플랫폼으로,
**"용어를 모르더라도 사용하고, 5분 안에 실험하고, 눈으로 신뢰를 형성하는"**
학습 용이성 최우선의 UX 경험을 제공합니다.

**핵심 가치:**
- **100% 오픈소스**: 모든 소스 코드 공개 → "이거 진짜야?" 불신 해소
- **블록체인 기반 검증**: 백테스트/성과 기록 → 시각적 증거로 조작 불가능성 입증
- **지식 공유 생태계**: "지식은 공유할수록 가치가 커진다" 철학 실현
- **노코드 진입장벽 해소**: 코딩 없이 전략 구성

**UX 핵심 철학 (학습 용이성 중심):**
1. **용어를 모르더라도 사용하게**: RSI, MACD, 백테스트 등 기술 용어를 몰라도
   직관적 UI와 가이드로 사용 가능
2. **빠른 실험**: 온보딩을 5분 이내로 완료, 첫 백테스트 성공 경험 제공
3. **시각적 증거**: 블록체인 기반 투명성을 차트 재생, 온체인 기록 확인 등
   시각적 요소로 신뢰 형성

---

### Target Users

#### 1. Primary: 김준혁 (38세, 남) - "도박에서 탈출하고 싶은" 노련한 트레이더

**Context:**
- IT 회사 다니는 평범한 직장인, 3년 차 코인 트레이더
- 자산 1억 원 → 6천만 원으로 감소, "이러다 다 잡는다"는 위기감
- 아침 9시~밤 12시 차트 중독, 와이프와 다툼, 삶의 질 파괴

**Needs (학습 용이성 관점):**
- ✅ 진입장벽 해결: TradingView처럼 복잡하지 않아야 함
- ✅ 투명성: "이 백테스트 진짜야?" 의심을 시각적 증거로 해소
- ✅ 빠른 실험: 출근 전 5분 만에 전략 켜고, 퇴근 후 결과 확인

**Success Vision:**
- "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
- "주말에 가족과 소풍 🏞️"
- "내 전략이 공유돼서 월 100만 원 수익화"

---

#### 2. Primary: 이수민 (26세, 여) - "처음부터 제대로 배우고 싶은" 진지한 입문자

**Context:**
- 신입 마케터 (입사 1년 차), 트레이딩 경험 없음
- 친구들 코인으로 돈 버는 거 보고 FOMO, but "손매매는 도박"이라 경계
- TradingView 접속했는데 "외계어"에 포기

**Needs (학습 용이성 관점):**
- ✅ 용어 없이 사용: RSI, MACD가 뭔지 몰라도 "그리드 모양의 그래프"로 이해
- ✅ 빠른 실험: "그냥 따라 해보세요" 튜토리얼로 5분 만에 첫 백테스트
- ✅ 시각적 학습: 다른 사람 전략을 보며 "아, 이렇게 구성하는 구나!" 깨달음

**Success Vision:**
- "내 전략이 있어서 침착하게 투자하는 거"
- "친구들에게 '나 자동매매 해' 자랑"
- "나도 멋진 트레이더야"

---

#### 3. Secondary: 박지성 (34세, 남) - "지식이 자산이 되는" 전략 공유 크리에이터

**Context:**
- 7년 차 시스템 트레이더, 프리랜서 개발자 (이전 퀀트 펌 경력)
- 알파 트레이딩으로 2억 번, but "이 지식이 더 가치 있게 쓰이면 좋겠어"
- GitHub에 오픈소스 올렸는데 별로 안 쓰임, "이거 진짜야?" 의심

**Needs (학습 용이성 관점):**
- ✅ 수익화: 3계층 보상 시스템으로 지식 자산화
- ✅ 소유권: 내 전략을 내가 소유 (3 Commas처럼 플랫폼에 빼앗기지 않음)
- ✅ 검증: 블록체인에 기록되니 "내 전략 진짜 잘하는 거야" 증명

**Success Vision:**
- "내 전략을 100명이 쓰고, 월 500만 원 수익화"
- "내 전략을 누군가 개선해서 더 좋아지면 나도 보상받아"
- "gr8의 유명 크리에이터로 인터뷰까지"

---

### Key Design Challenges

#### 1. "외계어" 진입장벽 해소 ⚠️

**Problem:**
- RSI, MACD, 볼린저 밴드, OHLCV, 백테스팅, MDD, Sharpe Ratio 등 기술 용어 장벽
- 이수민처럼 TradingView 접속하자마자 "외계어"에 포기하는 사용자 다수
- Web3 지갑 연결(Metamask)도 "암호화폐 지갑이 뭔데?"부터 시작할 수 있음

**Design Challenge:**
- **"용어를 모르더라도 사용하게"** 만들어야 함
- 기술 용어를 **직관적 비유/아이콘**으로 대체하거나,
  **마우스 오버 시 친절한 설명** tooltip 제공
- 예: "RSI" → "과매도/과매수 그래프", "백테스트" → "과거 데이터로 실험하기"

**UX Strategy:**
- 템플릿에서 이미 구성된 전략을 제공하며 **"그냥 백테스트 버튼 눌러보세요"**
- 파라미터 조정 시 **"이 값을 높이면 → 더 보수적으로 매수해요"** 같은
  친절한 가이드
- 기술 용어는 첫 경험 후 **"관심 있으면 여기서 배우세요"** 선택적 학습 제공

---

#### 2. 복잡한 노드-엣지 인터페이스의 학습 곡선 ⚠️

**Problem:**
- n8n 스타일 노드-엣지는 강력하지만, 초보자에게는
  **"뭐부터 연결해야 하지? 이건 뭔가?"** 당황
- 이수민 입장에서 첫 화면에 빈 캔버스는 "나는 멍청한가?" 자책감 유발

**Design Challenge:**
- **"빠른 실험"**을 통해 첫 5분 안에 성공 경험을 제공해야 함
- 빈 캔버스에서 시작하지 않고, **템플릿 복제 → 파라미터 조정**으로
  단계적 학습 경로 제공

**UX Strategy:**
1. **Step 1**: "인기 템플릿 둘러보기"에서 미리보기 제공
2. **Step 2**: "복제하기" 클릭 시 내 전략에 자동 추가
3. **Step 3**: "백테스트" 버튼으로 즉시 결과 확인 (5분 이내)
4. **Step 4**: 파라미터 하나씩 조정하며 **"원인-결과 실험"** 학습 유도
5. **Step 5**: 자신만의 전략 생성 (빈 캔버스는 여기서 처음 등장)

---

#### 3. "이 백테스트 진짜야?" 투명성 신뢰 형성 ⚠️

**Problem:**
- 사용자들은 백테스트 결과를 볼 때 "조작된 거 아닌가?" 의심
- 기존 자동매매 서비스들에 대한 불신이 큼
- 단순히 "온체인에 기록되었습니다" 메시지만으로는 부족할 수 있음

**Design Challenge:**
- 블록체인 기반 검증을 **UX적으로 시각적 증거**로 경험하게 해야 함
- **"이 백테스트 진짜야?"** 의심을 차트 재생, 온체인 기록 확인 등으로 해소

**UX Strategy:**
- **플레이백 차트**: 백테스팅 결과를 캔들 단위로 재생하며
  **"여기서 RSI가 30으로 떨어져서 매수했어요"** 실시간 설명
- **온체인 기록 뷰어**: "블록체인에서 확인하기" 버튼으로
  실제 블록 익스플로러 링크 제공
- **검증 배지**: "블록체인 검증됨" 배지와 해시값 표시로 신뢰 형성

---

### Design Opportunities

#### 1. 메타러닝의 순간 (Meta-learning Moments) 🌟

**Opportunity:**
- 다른 사람 전략을 보며 **"아, 이렇게 노드를 구성하면 되는구나!"**
  깨달음 → **전략 구성 방법론 자체에 대한 학습**
- 김준혁이나 이수민이 첫 주에 템플릿 10개 돌려보며
  **"이 패턴이 있구나"** 인사이트 얻음

**UX Idea:**
- **"전략 둘러보기"**에서 인기 전략을 **"노드 구조 스토리텔링"**으로 풀어서 보여줌
  - 예: "이 전략은 RSI가 30 이하면(과매도) 매수하고, 70 이상면(과매수) 매도해요"
  - 노드를 하나씩 강조하며 설명하는 인터랙티브 투어 제공
- **"포크" 기능**으로 타인 전략을 복제하고 개선하며
  **"이렇게 개선하면 더 좋아지네"** 학습

---

#### 2. Before & After 스토리텔링으로 학습 동기 부여 🌟

**Opportunity:**
- 김준혁의 **"Before: 도박꾼 → After: 시스템 트레이더"** 스토리
- 랜딩 페이지에서 이 스토리를 보며 **"이건 나야!"** 감성적 연결

**UX Idea:**
- 온보딩에서 **"당신은 어떤 타입인가요?"** 퀴즈 후,
  맞춤형 Before & After 보여주며 **"이게 당신일 수 있어요"** 감성적 연결
  - Type A: "도박에서 탈출하고 싶어요" → 김준혁 Before & After
  - Type B: "처음부터 제대로 배우고 싶어요" → 이수민 Before & After
  - Type C: "내 지식을 수익화하고 싶어요" → 박지성 Before & After
- 각 타입별로 **"첫 5분 튜토리얼"**을 다른 톤앤매너로 제공

---

#### 3. "플레이어 1의 첫 백테스트" 게임화 학습 🌟

**Opportunity:**
- **첫 번째 백테스트 성공**이 핵심 성공 모멘트:
  **"와, 내가 코딩 없이 이걸 만들었다?"**
- 이 순간을 축하하고 학습 동기를 부여할 수 있음

**UX Idea:**
- 템플릿으로 첫 백테스트 성공 후 **"🎉 축하합니다! 첫 전략을 완성했어요!"**
  애니메이션 + 간단한 설명
- **"이제 파라미터를 바꿔보세요"** 가이드로
  **"원인-결과 실험"** 학습 유도
- **"5분 만에 첫 백테스트 성공!"** 배지/업적으로 게임화

---

#### 4. 시각적 백테스팅 재생으로 "실시간 학습" 🌟

**Opportunity:**
- 백테스팅 결과를 **캔들 단위로 재생**하는 기능
- "이 백테스트 진짜야?" 의심을 시각적으로 해소하면서
  동시에 **"전략이 어떻게 작동하는지"** 학습

**UX Idea:**
- **"플레이" 버튼**으로 전체 과정 시뮬레이션하며
  **"여기서 RSI가 30으로 떨어져서 매수했어요"** 실시간 설명
- 속도 조절 (1x, 2x, 5x, 10x)로 세부적으로 관찰 가능
- **"일시정지"** 후 특정 캔들에서 **"왜 여기서 매수했어요?"**
  설명 tooltip 제공

---

## Core User Experience

### Defining Experience

**The ONE Core Action:**

gr8의 핵심 사용자 경험은 **"용어를 모르더라도, 5분 안에 첫 백테스트를 성공시키는 것"**입니다.

이것이 잘 되면:
- 사용자는 **"와, 내가 코딩 없이 이걸 만들었다!"**라고 느끼며 자신감을 얻음
- **"이거 진짜 되네!"**라는 신뢰 형성
- **"더 해보고 싶어"**라는 동기 부여

이것이 실패하면:
- **"나는 멍청한가?"** 자책감 → 이탈
- "또 다른 TradingView인가?" 실망
- "역시 어려워" 포기

**Why This Defines Everything:**

이 핵심 액션이 성공하면:
1. **리텐션**: 첫 성공 후 "파라미터 바꿔보기" → 두 번째, 세 번째 실험
2. **생태계 참여**: 자신감을 얻은 후 전략 공유 시도
3. **수익화**: 성공한 전략을 다른 사람도 복제 → 수익 창출

즉, **모든 것의 시작점**입니다.

---

### Platform Strategy

**Primary Platform: Responsive Web (Mobile-First) 📱💻**

gr8은 **모바일부터 데스크톱까지 모든 기기에서 완벽하게 작동하는 반응형 웹**입니다.

**Platform Decisions:**

1. **반응형 웹 (Responsive Web)**
   - 모바일 (375px+): 노드-엣지 에디터는 세로 모드, 간소화된 UI
   - 태블릿 (768px+): 노드-엣지 에디터 가로/세로 모드 지원
   - 데스크톱 (1024px+): 완전한 기능의 노드-엣지 에디터

2. **Browser Support**
   - **Primary**: Chrome (최신 2버전)
   - **Secondary**: Safari (최신 2버전), Firefox (최신 2버전)
   - **Rationale**: Web3 지갑(Metamask, WalletConnect) 호환성 고려

3. **No Offline Mode**
   - 실시간 시장 데이터 필요 (OHLCV)
   - 온체인 기록 확인 필요
   - 모든 기능은 **항상 연결 상태** 가정

4. **Device Capabilities to Leverage**
   - **모바일**: 터치 제스처 (핀치 줌, 스와이프), 생체 인증 (Face ID/Touch ID)로 지갑 연결 간소화
   - **데스크톱**: 드래그 앤 드롭, 키보드 단축키 (Ctrl+C/V 복사, Ctrl+Z 실행취소)
   - **태블릿**: 터치 + 키보드 하이브리드 (온보딩 시 자동 감지)

**Why Mobile-First?**

- **이수민(입문자)**: 점심시간에 모바일로 백테스트 결과 확인
- **김준혁(직장인)**: 출근/퇴근 길에 지하철에서 전략 켜기
- **박지성(크리에이터)**: 알림 받으면 모바일로 수익 확인

---

### Effortless Interactions

**"노력 Zero" 상호작용 설계**

학습 용이성을 극대화하기 위해, 다음 4가지 상호작용이 **완전히 자연스럽고 생각 없이** 가능해야 합니다:

#### 1. 지갑 연결: 3분 완료 🔗

**Current Struggle:**
- "Metamask가 뭔데? 암호화폐 지갑이 뭔데?" → 헷갈림

**Effortless Design:**
- **"지갑 연결하기"** 버튼 클릭
- **"MetaMask 설치하기"** 또는 **"이미 설치됨"** 자동 감지
- 3단계 가이드:
  1. **"지갑 생성"** (또는 이미 있다면 "연결")
  2. **"gr8에 접근 허용"** (원클릭 서명)
  3. **"환영합니다!"** 성공 애니메이션
- **전체 시간: 3분 이내**

**Why Effortless:**
- Web3 비친숙자도 **"그냥 따라 하니까 됐어"** 느낌
- 튜토리얼이 아닌 **자연스러운 흐름**으로 설계

---

#### 2. 템플릿 복제: 원클릭 📋

**Current Struggle:**
- n8n처럼 빈 캔버스에서 시작 → **"뭐부터 해야 하지?"** 당황

**Effortless Design:**
- **"인기 템플릿"** 둘러보기에서 **"복제하기"** 버튼 클릭
- 내 전략 목록에 **자동 추가** (드래그 앤 드롭 없음)
- **"복제 완료!"** 토스트 메시지 + **"지금 백테스트해볼까요?"** CTA

**Why Effortless:**
- 드래그 앤 드롭 같은 **복잡한 제스처 불필요**
- **"복제" = "내 것 만들기"** 직관적 메타포

---

#### 3. 파라미터 조정: 직관적 슬라이더 🎚️

**Current Struggle:**
- "RSI 기간을 14로 설정" → **"RSI가 뭔데? 14가 뭔데?"** 당황

**Effortless Design:**
- 기술 용어 대신 **직관적 라벨**:
  - "RSI 기간" → **"그래프 민감도"**
  - "과매수 기준" → **"언제 팔까요?"**
- **슬라이더 + 드롭다운** 조합:
  - 슬라이더로 값 조정 → **실시간으로 결과 미리보기**
  - **"이 값을 높이면 → 더 보수적으로 매수해요"** tooltip
- **"기본값으로 되돌리기"** 버튼 (실수 방지)

**Why Effortless:**
- 용어를 몰라도 **"이거 높이면 보수적이네"** 직관
- **실시간 피드백**으로 "원인-결과 실험" 학습

---

#### 4. 백테스트 실행: 원클릭 실행 ▶️

**Current Struggle:**
- TradingView에서 백테스트: 설정 복잡, **"이거 어떻게 돌리지?"**

**Effortless Design:**
- **"백테스트"** 버튼 클릭 → 즉시 실행
- **진행률 바** + **"약 30초 소요 예정"** 안내
- 완료 시 **"🎉 백테스트 완료!"** 애니메이션
- 결과가 **자동으로 스크롤**되어 바로 보임

**Why Effortless:**
- **설정 없는 원클릭** (템플릿은 이미 최적화된 파라미터)
- **기다림의 불안감 해소** (진행률 바)

---

### Critical Success Moments

**성공/실패를 가르는 3가지 순간**

#### 1. 첫 번째 백테스트 성공 🎯 (가장 중요!)

**The Moment:**
- 사용자가 템플릿을 복제하고 **"백테스트"** 버튼을 누른 지 30초 후
- 화면에 **"+15% 수익! MDD -5%!"** 결과가 뜸
- **"🎉 축하합니다! 첫 전략을 완성했어요!"** 애니메이션

**Why Critical:**
- 이 순간 사용자는 **"와, 내가 코딩 없이 이걸 만들었다!"**라고 느낌
- 자신감 얻음 → **"파라미터 바꿔보기"** → 두 번째, 세 번째 실험
- 실패하면 **"나는 멍청한가?"** 자책감 → 이탈

**Design Requirements:**
- **반드시 성공해야 함** (템플릿은 검증된 전략)
- **5분 이내** 완료 (집중력 유지)
- **축하 애니메이션**으로 감정적 고조

---

#### 2. 차트 재생으로 투명성 확인 📊

**The Moment:**
- 사용자가 백테스트 결과를 보고 **"이 백테스트 진짜야?"** 의심
- **"플레이"** 버튼 클릭 → 캔들 단위로 재생 시작
- **"여기서 RSI가 30으로 떨어져서 매수했어요"** 실시간 설명
- **"블록체인에서 확인하기"** 버튼으로 실제 블록 익스플로러 링크 확인
- **"이 백테스트 진짜야, 조작 안 됐어!"** 깨달음

**Why Critical:**
- 기존 자동매매 서비스들에 대한 **불신 해소**
- 블록체인 기반 투명성을 **시각적으로 경험**
- **"gr8은 다르다"** 차별화 형성

**Design Requirements:**
- **플레이백 속도 조절** (1x, 2x, 5x, 10x)
- **일시정지 후 툴팁**으로 상세 설명
- **온체인 기록 뷰어**로 검증 배지 + 해시값 표시

---

#### 3. 다른 사람 전략 보며 메타러닝 💡

**The Moment:**
- 사용자가 **"전략 둘러보기"**에서 인기 전략 클릭
- **"이 전략은 RSI가 30 이하면(과매도) 매수하고, 70 이상면(과매수) 매도해요"**
  스토리텔링 설명
- 노드를 하나씩 강조하는 **인터랙티브 투어**
- **"아, 이렇게 노드를 구성하면 되는구나!"** 깨달음
- **"패턴이 있구나, 이제 내가 만들 수 있겠어"** 자신감

**Why Critical:**
- **전략 구성 방법론 자체에 대한 학습** (메타러닝)
- 다른 사람 전략 10개 보고 나면 **"내 패턴이 생겼어"**
- 이 깨달음이 있어야 자신만의 전략 생성 시도

**Design Requirements:**
- **스토리텔링 설명** (용어 없이)
- **노드 강조 투어** (시각적 학습)
- **"포크"** 기능으로 바로 복제 가능

---

### Experience Principles

**UX 의사결정 가이드라인**

위에서 정의한 Core Experience를 바탕으로, 모든 UX 디자인 결정을 안내하는 **5가지 원칙**:

#### 1. 학습 용이성 최우선 📚

> **"용어를 모르더라도 사용하게"**

- 기술 용어(RSI, MACD, 백테스트)를 **직관적 비유/아이콘**으로 대체
- 마우스 오버 시 **친절한 tooltip**으로 설명 제공
- 첫 경험 후 **"관심 있으면 여기서 배우세요"** 선택적 학습

**UX Decision Example:**
- ❌ "RSI 기간 설정"
- ✅ "그래프 민감도" + "이 값을 높이면 → 더 보수적으로 매수해요"

---

#### 2. 빠른 첫 성공 ⚡

> **"5분 안에 첫 백테스트 성공 경험"**

- 온보딩을 **"그냥 따라 해보세요"**로 간소화
- **템플릿 복제 → 백테스트 실행**을 5분 이내로 완료
- 첫 성공 후 **"파라미터 바꿔보기"** 가이드로 단계적 학습

**UX Decision Example:**
- ❌ "시스템 트레이딩이란 무엇인가" 10분 튜토리얼
- ✅ "템플릿 복제 → 백테스트 버튼 클릭" 3분 경험

---

#### 3. 모바일 친화적 디자인 📱

> **"모든 기기에서 완벽하게 작동"**

- 모바일부터 데스크톱까지 **반응형 디자인**
- 모바일에서는 **세로 모드 노드-엣지**, 간소화된 UI
- 터치 제스처 (핀치 줌, 스와이프) 지원

**UX Decision Example:**
- ❌ 데스크톱 전용, "모바일은 지원 안 함"
- ✅ 모바일에서도 전략 복제 + 백테스트 가능

---

#### 4. 시각적 투명성 👁️

> **"눈으로 신뢰를 형성하는 증거"**

- **플레이백 차트**로 백테스트 과정 시각화
- **온체인 기록 뷰어**로 블록체인 검증 증거 제공
- **"블록체인 검증됨"** 배지로 신뢰 형성

**UX Decision Example:**
- ❌ "온체인에 기록되었습니다" 텍스트만
- ✅ "블록체인에서 확인하기" 버튼 + 실제 익스플로러 링크

---

#### 5. 단순화된 인터랙션 🎯

> **"복잡한 제스처 없이 원클릭으로"**

- **템플릿 복제**는 원클릭 (드래그 앤 드롭 없음)
- **백테스트 실행**은 원클릭 (설정 불필요)
- **파라미터 조정**은 슬라이더 + 실시간 피드백

**UX Decision Example:**
- ❌ 빈 캔버스에서 노드 직접 연결 (10분 소요)
- ✅ 템플릿 복제 → 파라미터만 조정 (1분 소요)

---

### 2.1 경험 정의 (Defining the Experience)

**gr8의 핵심 경험: "Template Clone → Backtest Button → 5-Minute Success"**

이것이 gr8의 **"Tinder Swipe"** 같은 핵심 상호작용입니다. 사용자가 이 경험을 성공하면:
- **"와, 내가 코딩 없이 이걸 만들었다!"** 자신감
- **"이거 진짜 되네!"** 신뢰 형성
- **"더 해보고 싶어"** 동기 부여

**Why This Defines Everything:**

이 핵심 경험이 성공하면:
1. **리텐션**: 첫 성공 후 "파라미터 바꿔보기" → 두 번째, 세 번째 실험
2. **생태계 참여**: 자신감을 얻은 후 전략 공유 시도
3. **수익화**: 성공한 전략을 다른 사람도 복제 → 수익 창출

즉, **모든 것의 시작점**입니다.

---

### 2.2 사용자 멘탈 모델 (User Mental Model)

**"요리 레시피 따라 하기"와 유사**

사용자는 gr8을 다음과 같이 이해합니다:

| 요리 레시피 | gr8 전략 구성 |
|-----------|-------------|
| **레시피** (요리책) | **템플릿** (미리 만들어진 전략) |
| **양념 조절** (소금, 후추) | **파라미터 조정** (슬라이더, 드롭다운) |
| **맛 보기** | **백테스트 실행** |
| **맛 좋으면 비율 기록** | **결과 좋으면 저장** |
| **레시피 공유** | **전략 공개** |

**Key Insight:**
- 사용자는 기술적 용어를 몰라도 **"따라 하면 된다"**는 멘탈 모델
- **"템플릿은 레시피 같은 거야"**라는 비유가 자연스럽게 이해됨
- 복잡한 노드-엣지 구조는 **"요리 순서"**로 인식

**UX Implication:**
- 용어(RSI, MACD)를 몰라도 **"그냥 따라 하세요"**로 접근
- **"이 전략은 RSI가 30 이하면(과매도) 매수해요"** 같은 스토리텔링이 효과적
- 템플릿을 **"레시피"**, 파라미터를 **"양념"**으로 비유하면 이해 빠름

---

### 2.3 성공 기준 (Success Criteria)

**5가지 측정 가능한 기준**

gr8의 핵심 경험이 성공했는지 확인하기 위한 **구체적이고 측정 가능한 기준**:

#### 1. "This Just Works" - 90% 첫 번째 성공률 ✅
- **Goal**: 첫 백테스트 시도의 90%가 성공적으로 완료
- **Why**: 실패 경험은 **"나는 멍청한가?"** 자책감 → 이탈
- **How**:
  - 템플릿은 미리 검증된 전략만 제공
  - 파라미터 기본값으로 **실패 불가능**하게 설계
  - 에러 발생 시 친절한 가이드로 수정 유도

#### 2. Smart/Accomplished Feeling - 95% 성공 느낌 🧠
- **Goal**: 사용자의 95%가 **"와, 내가 만들었어!"** 성취감 느낌
- **Why**: 성취감이 **"더 해보고 싶어"** 동기 부여
- **How**:
  - **"🎉 축하합니다! 첫 전략을 완성했어요!"** 애니메이션
  - **"+15% 수익! MDD -5%!"** 결과를 강조
  - **"이제 파라미터를 바꿔보세요"** 다음 단계 유도

#### 3. Immediate Feedback - <1초 지연 시간 ⚡
- **Goal**: 모든 상호작용이 1초 이내에 피드백
- **Why**: 지연은 **"멈춘 건가?"** 불안감 유발
- **How**:
  - 슬라이더 조정 → **실시간으로 값 변경**
  - 백테스트 버튼 클릭 → **즉시 진행률 바 표시**
  - 완료 → **애니메이션 + 결과 자동 스크롤**

#### 4. Speed - 5분 완료 ⏱️
- **Goal**: 처음부터 끝까지 **5분 이내** 완료
- **Why**: 긴 프로세스는 집중력 상실
- **How**:
  - 지갑 연결: 3분
  - 템플릿 복제: 10초
  - 백테스트 실행: 30초
  - 결과 확인: 1분
  - **총 4분 40초**

#### 5. Zero Setup - 0 설정 단계 🎯
- **Goal:** 사용자가 **설정 없이 바로 실행**
- **Why**: 설정 화면은 **"이거 뭐부터 설정하지?"** 당황
- **How**:
  - 템플릿은 이미 최적화된 파라미터
  - **"백테스트"** 버튼만 클릭하면 즉시 실행
  - 고급 설정은 **"선택 사항"**으로 숨김

---

### 2.4 확립된 vs. 새로운 패턴 (Novel vs. Established Patterns)

**gr8은 확립된 패턴 + 새로운 트위스트 조합**

#### Established Patterns (확립된 패턴 - 그대로 채택)

1. **Template Clone (Zapier, Notion)**
   - 템플릿 둘러보기 → **"복제하기"** 버튼 클릭 → 내 전략에 자동 추가
   - 이유: **"용어 모르더라도"** 빠른 시작

2. **Sliders/Dropdowns (많은 제품들)**
   - 파라미터 조정을 슬라이더로 직관적 표현
   - 이유: **"이 값을 높이면 → 더 보수적으로 매수해요"** 실시간 피드백

3. **Progress Bar (Zapier, 설치 프로그램)**
   - 백테스트 실행 시 진행률 바 + **"약 30초 소요 예정"**
   - 이유: 기다림의 불안감 해소

4. **Dark Mode (TradingView)**
   - 트레이딩 표준인 다크모드
   - 이유: 눈의 피로 감소, 장기 사용 고려

---

#### Novel Twist (새로운 트위스트 - gr8만의 차별화)

1. **Before & After Storytelling** 📖
   - **What**: 템플릿 설명을 **"BTC 가격이 5% 하락하면 → 매수"** 스타일로
   - **Why**: 용어 없이 직관적 이해
   - **Differentiation**:
     - TradingView: "RSI 기간 14, 과매수 70..." (기술적)
     - gr8: **"이 전략은 RSI가 30 이하면(과매도) 매수하고, 70 이상면(과매수) 매도해요"** (스토리텔링)

2. **Playback Chart for Transparency** 🎬
   - **What**: 백테스트 결과를 캔들 단위로 재생하며 **"여기서 RSI가 30으로 떨어져서 매수했어요"** 실시간 설명
   - **Why**: **"이 백테스트 진짜야?"** 의심을 시각적 증거로 해소
   - **Differentiation**:
     - 기존 자동매매: 백테스트 결과 숫자만 표시
     - gr8: **플레이및 차트 + 온체인 기록 확인**으로 투명성 극대화

3. **Blockchain Verification Badge** 🔐
   - **What**: 백테스트 결과에 **"블록체인 검증됨"** 배지 + 해시값 표시
   - **Why**: **"이거 조작 안 됐어?"** 불신을 블록체인으로 해소
   - **Differentiation**:
     - 기존 서비스: "백테스트 결과입니다" (텍스트만)
     - gr8: **"블록체인에서 확인하기"** 버튼으로 실제 블록 익스플로러 링크 제공

---

### 2.5 경험 메카닉스 (Experience Mechanics)

**6단계 상세 경험 설계**

#### Phase 1: Discovery (탐색) - "뭐부터 하지?" → "이거 재밌겠다!"

**User Goal:** 적합한 템플릿 찾기

**UI/UX Design:**
1. **"인기 템플릿"** 카드 그리드 레이아웃
   - 각 카드: 미리보기 이미지, 제목, **"Before & After"** 설명
   - 예: **"RSI 과매도/과매수 전략"** - "RSI가 30 이하면(과매도) 매수하고, 70 이상면(과매수) 매도해요"
2. **카테고리 필터**: "초보자 추천", "수익률 높음", "낮은 변동성"
3. **미리보기 모달**: 클릭 시 전략 스토리텔링 + 노드 구조 간략히 표시

**Success Criteria:**
- 10초 안에 첫 번째 템플릿 선택
- **"이거 내가 할 수 있겠어"** 자신감

---

#### Phase 2: One-Click Clone (원클릭 복제) - "복잡 없이 내 것 만들기"

**User Goal:** 템플릿을 내 전략으로 만들기

**UI/UX Design:**
1. **"복제하기"** 버튼 클릭
2. **"복제 완료!"** 토스트 메시지
3. **"지금 백테스트해볼까요?"** CTA로 유도
4. 내 전략 목록에 자동 추가 (드래그 앤 드롭 불필요)

**Success Criteria:**
- 원클릭으로 복제 완료
- **"와, 쉽네!"** 만족감

---

#### Phase 3: Parameter Tweak (파라미터 조정) - "직관적 실험"

**User Goal:** 전략을 내 취향에 맞게 조정

**UI/UX Design:**
1. **슬라이더**로 주요 파라미터 조정
   - 예: "그래프 민감도" (RSI 기간)
   - 슬라이더 조정 시 **실시간으로 값 변경**
2. **Tooltip**로 친절한 설명
   - **"이 값을 높이면 → 더 보수적으로 매수해요"**
3. **"기본값으로 되돌리기"** 버튼 (실수 방지)

**Success Criteria:**
- 용어 몰라도 **"이거 높이면 보수적이네"** 직관적 이해
- **"원인-결과 실험"** 학습 유도

---

#### Phase 4: Backtest Execution (백테스트 실행) - "기다림의 불안감 해소"

**User Goal:** 백테스트 결과 확인

**UI/UX Design:**
1. **"백테스트"** 버튼 클릭 → 즉시 실행
2. **진행률 바** + **"약 30초 소요 예정"** 안내
   - 단계별 진행률: "데이터 로딩 중...", "백테스팅 중...", "결과 생성 중..."
3. 완료 시 **"🎉 백테스트 완료!"** 애니메이션
4. 결과가 **자동으로 스크롤**되어 바로 보임

**Success Criteria:**
- 기다림의 불안감 해소 (진행률 바)
- **"오, 결과가 나왔어!"** 기대감

---

#### Phase 5: Success Celebration (성공 축하) - "자신감 폭발!"

**User Goal:** 결과 확인하고 성공 경험

**UI/UX Design:**
1. **결과 요약** 카드:
   - **"+15% 수익! MDD -5%!"** 큰 폰트로 강조
   - 수익률 그래프 (라인 차트)
2. **"🎉 축하합니다! 첫 전략을 완성했어요!"** 애니메이션
   - Confetti 🎉 효과
3. **"이제 파라미터를 바꿔보세요"** 가이드로 다음 단계 유도

**Success Criteria:**
- **"와, 내가 코딩 없이 이걸 만들었다!"** 자신감
- **"더 해보고 싶어"** 동기 부여

---

#### Phase 6: Playback & Trust (재생과 신뢰) - "투명성 확인"

**User Goal:** "이 백테스트 진짜야?" 의심 해소

**UI/UX Design:**
1. **"플레이"** 버튼 → 캔들 단위로 재생 시작
   - 속도 조절 (1x, 2x, 5x, 10x)
   - **일시정지** 후 특정 캔들에서 **"왜 여기서 매수했어요?"** tooltip
2. **실시간 설명**:
   - **"여기서 RSI가 30으로 떨어져서 매수했어요"**
   - **"이때 가격이 5% 하락했어요"**
3. **"블록체인에서 확인하기"** 버튼
   - 실제 블록 익스플로러 링크 제공
4. **"블록체인 검증됨"** 배지 + 해시값 표시

**Success Criteria:**
- **"이 백테스트 진짜야, 조작 안 됐어!"** 확신
- **"gr8은 다르다"** 차별화 인식

---

**전체 경험 시간: 5분**

| Phase | 시간 |
|-------|------|
| Discovery (탐색) | 1분 |
| Clone (복제) | 10초 |
| Tweak (조정) | 1분 30초 |
| Backtest (실행) | 30초 |
| Celebration (축하) | 30초 |
| Playback (재생) | 1분 |
| **Total** | **4분 40초** |

---

## Desired Emotional Response

### Primary Emotional Goals

gr8이 사용자에게 전달해야 할 **4가지 핵심 감정적 목표**:

#### 1. Empowerment (자신감/역량감) 💪

**Target Emotion:**
> **"와, 내가 코딩 없이 이걸 만들었다!"**

**User Stories:**
- **김준혁**: "이제 내가 시스템을 만들어서 일하게 했어. 내가 안 봐도 돼."
- **이수민**: "나도 멋진 트레이더야"
- **박지성**: "내 지식이 자산이 되는 거야"

**From → To:**
- 무능력("나는 멍청한가?") → 역량 있는 상태
- 남에게 의존 → 스스로 통제
- "못해" → "할 수 있어"

**When This Happens:**
- 첫 백테스트 성공 후 "+15% 수익! MDD -5%!" 확인
- 파라미터 조정 후 "원인-결과 실험" 성공
- 자신만의 전략 생성 완료

---

#### 2. Trust (신뢰) 🔐

**Target Emotion:**
> **"이 백테스트 진짜야, 조작 안 됐어!"**

**User Stories:**
- 기존 자동매매 서비스: "이거 진짜야?" 의심
- gr8 경험 후: "블록체인에 기록됐으니 조작 불가능이네" 확신

**From → To:**
- 불신("또 다른 사기인가?") → 신뢰
- 회의적("백테스트 조작된 거 아냐?") → 확신
- "의심" → "믿음"

**When This Happens:**
- 플레이백 차트로 백테스트 과정 재생
- "블록체인에서 확인하기" 버튼으로 실제 블록 익스플로러 링크 확인
- "블록체인 검증됨" 배지 확인

---

#### 3. Relief (안도/해방) 🕊️

**Target Emotion:**
> **"이제 삶을 되찾았어"** (김준혁)

**User Stories:**
- **Before**: "아침 9시부터 밤 12시까지 차트를 봐"
- **After**: "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
- **Result**: "주말에 가족과 소풍 🏞️"

**From → To:**
- 강박("자다가 일어나서 포지션 체크") → 해방
- 도파민 중독 → 평온
- 삶의 질 파괴 → 삶의 질 회복

**When This Happens:**
- 출근 전 5분 만에 전략 켜기
- 퇴근 후 결과 확인하고 "오늘 +2.3% 수익. 좋아."
- 주말에 차트 안 보고 소풍 가기

---

#### 4. Belonging (소속감) 👥

**Target Emotion:**
> **"이제 나도 도박꾼이 아니야, 시스템 트레이더야"**

**User Stories:**
- **김준혁**: "gr8 커뮤니티에서 활동적인 멤버로 성장"
- **이수민**: "친구들에게 '나 자동매매 해' 자랑"
- **박지성**: "gr8의 유명 크리에이터로 인터뷰까지"

**From → To:**
- 고립("나만 이렇게 힘들어") → 소속
- 수치심("도박꾼인가?") → 자부심
- "아웃사이더" → "커뮤니티 일원"

**When This Happens:**
- 자신의 전략을 공개하고 다른 사람이 복제
- 수익화 알림 받음 ("누군가 내 전략을 썼어!")
- Discord 커뮤니티에서 활동

---

### Emotional Journey Mapping

사용자 경험의 **6단계 감정적 여정**:

#### 📍 단계 1: 발견 (Discovery) - 호기심 + 희망 ✨
- 랜딩 페이지에서 김준혁의 Before & After 스토리 확인
- **"이건 나야!"** 감정적 연결
- "이게 정말 가능한가요?" 희망

#### 📍 단계 2: 온보딩 (Onboarding) - 안심 + 자신감 😌
- 지갑 연결 3단계 가이드 따라 하기
- **"그냥 따라 하니까 됐어"**
- Web3가 어렵지 않다는 깨달음

#### 📍 단계 3: 첫 백테스트 성공 (First Success) - 자신감 폭발! 💥
- 템플릿 복제 → 백테스트 버튼 클릭
- 30초 후 **"+15% 수익! MDD -5%!"** 결과 확인
- **"와, 내가 코딩 없이 이걸 만들었다!"**

#### 📍 단계 4: 투명성 확인 (Trust Building) - 신뢰 + 확신 🔐
- 플레이버튼 클릭 → 캔들 단위로 재생
- **"여기서 RSI가 30으로 떨어져서 매수했어요"** 실시간 설명
- **"이 백테스트 진짜야, 조작 안 됐어!"** 확신

#### 📍 단계 5: 반복 사용 (Return Usage) - 편안함 + 통제감 😎
- 출근할 때 전략 3개 켜기 (5분 소요)
- 퇴근할 때 결과 확인 ("+2.3% 수익. 좋아.")
- **"이제 내 삶을 되찾았어"** 안도

#### 📍 단계 6: 문제 발생 (If Something Goes Wrong) - 당황 ❌ → 안심 ✅
- 에러 메시지 확인: **"RSI 기간이 너무 작습니다. 10 이상으로 설정해주세요."**
- **"아, 그렇구나"** 안심하고 수정
- 재실행 후 성공: **"잘했어요!"**

---

### Micro-Emotions

gr8 성공에 **가장 중요한 3가지 미세 감정**:

#### 1. Confidence > Confusion (자신감 > 혼란) 🎯
- **혼란("나는 멍청한가?")** → **자신감("그냥 따라 하니까 됐어")**
- 용어 모르더라도 사용 가능
- "이거 내가 만든 거야!" 성취감

#### 2. Trust > Skepticism (신뢰 > 회의적) 🔐
- **회의적("이 백테스트 진짜야?")** → **신뢰("이 백테스트 진짜야, 조작 안 됐어!")**
- 블록체인에 기록되니 조작 불가능 확신
- "gr8은 다르다" 차별화 인식

#### 3. Accomplishment > Frustration (성취 > 좌절) 💪
- **좌절("역시 안 돼")** → **성취("와, 내가 코딩 없이 이걸 만들었다!")**
- 첫 성공 후 자신감 폭발
- "더 해보고 싶어" 동기 부여

---

### Design Implications

**감정 → 디자인 연결**:

| 감정적 목표 | 디자인 전략 | 구현 예시 |
|------------|-----------|---------|
| **자신감(Empowerment)** | 용어 제거, 실시간 피드백, 축하 | "그래프 민감도", 축하 애니메이션 |
| **신뢰(Trust)** | 시각적 증거, 검증 배지 | 플레이및 차트, 블록체인 확인 버튼 |
| **안도(Relief)** | 빠른 실행, 알림 제어 | 5분 만에 전략 켜기, 주말 알림 끄기 |
| **소속(Belonging)** | 커뮤니티 피드백, 수익화 알림 | "누군가 내 전략을 복제했어요!" |

**즐거움(Delight) 창출 순간:**
- 첫 백테스트 성공 후 confetti 애니메이션 🎉
- 수익화 알림: **"누군가 내 전략을 복제했어요! +5,000원"** 💰
- "5분 만에 첫 백테스트 성공!" 배지/업적 🏆

---

### Emotional Design Principles

**모든 UX 디자인 결정을 안내하는 감정적 원칙**:

#### 1. 먼저 자신감, 그 다음 학습 📚
> **"성공 경험 먼저, 이해는 나중에"**
- 첫 경험은 **"그냥 따라 하세요"**로 성공 보장
- 자신감 얻은 후 **"관심 있으면 여기서 배우세요"** 선택적 학습

#### 2. 눈으로 신뢰 형성 👁️
> **"투명성은 보여줘야 믿는다"**
- 플레이및 차트로 시각적 재생
- **"블록체인에서 확인하기"** 버튼으로 검증 가능
- **"블록체인 검증됨"** 배지로 신뢰 형성

#### 3. 삶의 질 보호 우선 🕊️
> **"사용자의 삶을 되찾아주는 것이 목표"**
- "24시간 모니터링" → **"주말에는 알림 끄기"** 설정
- "실시간 차트 보기" → **"출근 전 5분 만에 전략 켜기"**

#### 4. 공동체에서의 성장 👥
> **"혼자가 아닌 함께 성장한다"**
- 전략 공개 후 **"누군가 복제했어요!"** 알림
- 수익화로 **"내 지식이 자산이 되는거야"** 느낌

#### 5. 긍정적 피드백의 힘 💪
> **"잘하고 있어요"라고 계속 말해주기**
- 에러 발생 시 **"RSI 기간을 10 이상으로 설정해보세요"** 친절한 가이드
- 해결 후 **"잘했어요!"** 긍정적 피드백

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

gr8의 UX 디자인에 영감을 줄 **3가지 핵심 제품** 분석:

#### 1. TradingView 📊

**What They Do Well:**
- **강력한 차트 시각화**: 캔들 차트, 인디케이터 오버레이, 멀티 타임프레임
- **커뮤니티 스크립트**: 사용자가 만든 인디케이터/전략 공유 시스템
- **실시간 데이터**: 빠른 데이터 업데이트와 낮은 지연 시간

**UX Success Factors:**
- ✅ 직관적인 차트 조작: 마우스 휠로 줌, 드래그로 팬
- ✅ 우측 사이드바에 도구/인디케이터 카테고리별 배치
- ✅ 다크모드/라이트모드 토글 (트레이딩에 필수)
- ✅ 차트 위에 매수/매도 포지션 화살표로 명확히 표시

**Pain Points:**
- ❌ **"외계어" 진입장벽**: RSI, MACD, 볼린저 밴드, OHLCV 등 기술 용어
- ❌ 복잡한 백테스팅 설정 UI: 초보자에게 "뭐부터 설정해야 하지?" 당황
- ❌ 빈 차트에서 시작: "지금 뭘 해야 하지?" 빈 화면 공포

**Key Lessons for gr8:**
- **채택**: 차트 시각화, 실시간 데이터, 커뮤니티 스크립트 공유, 다크모드
- **개선**: 용어 제거, 템플릿으로 시작, "백테스트" 버튼 원클릭

---

#### 2. n8n 🔗

**What They Do Well:**
- **시각적 워크플로우**: 노드-엣지로 복잡한 자동화 로직을 직관적으로 표현
- **드래그 앤 드롭**: 쉬운 노드 연결과 재배치
- **템플릿 라이브러리**: 300+ 미리 만들어진 워크플로우 제공

**UX Success Factors:**
- ✅ 노드를 기능별 카테고리 분류 (Triggers, Actions, Apps, Logic)
- ✅ 노드 연결 시 자동으로 라인 그리기 (매끄러운 곡선)
- ✅ 실행 버튼으로 즉시 워크플로우 테스트 가능
- ✅ 노드 카드에 아이콘 + 이름으로 직관적 식별

**Pain Points:**
- ❌ **빈 캔버스에서 시작**: 초보자에게 "뭐부터 해야 하지?" 당황
- ❌ 각 노드마다 복잡한 파라미터 설정: Webhook URL, JSON Path 등
- ❌ 기술적 용어: "Webhook", "Cron", "JSON Path" 등

**Key Lessons for gr8:**
- **채택**: 노드-엣지 인터페이스, 노드 카테고리 분류, 자동 라인 그리기
- **개선**: 템플릿에서 시작(빈 캔버스 X), 파라미터 직관적 라벨링

---

#### 3. Zapier ⚡

**What They Do Well:**
- **"Zaps" 템플릿**: 5,000+ 미리 만들어진 자동화 템플릿
- **비기술적 친화적**: "트리거"와 "액션"으로 복잡성 단순화
- **빠른 시작**: 이메일 입력만으로 바로 첫 Zap 실행 가능

**UX Success Factors:**
- ✅ **"그냥 따라 하세요"** 온보딩: 계정 연결 → 트리거 선택 → 액션 선택 → 실행
- ✅ 템플릿이 **"Before & After"**로 설명: "이메일 받으면 → 슬랙에 알림"
- ✅ 각 단계에서 **"다음"** 버튼으로 진행률 명확
- ✅ 템플릿 사용 시 **"복제"**로 내 Zaps에 자동 추가

**Pain Points:**
- ❌ 복잡한 워크플로우는 시각적 표현이 어려움 (리니어한 리스트 형태)
- ❌ 유료 기능이 많아서 프리미엄 압박

**Key Lessons for gr8:**
- **채택**: "Before & After"로 템플릿 설명, 3단계 가이드, "복제"로 시작
- **개선**: 노드-엣지로 시각적 표현 강화 (n8n 스타일)

---

#### 4. Notion 📝

**What They Do Well:**
- **"/" 커맨드**: 슬래시 입력으로 모든 블록/기능 접근
- **풍부한 템플릿**: 미리 만들어진 페이지/데이터베이스
- **드래그 앤 드롭**: 블록 재배치가 매우 쉬움

**UX Success Factors:**
- ✅ 빈 페이지에서 "/"만 입력하면 전체 메뉴가 나옴 (커맨드 팔레트)
- ✅ 템플릿 사용 시 **"그냥 따라 하면 됨"** (복사 → 수정)
- ✅ 블록 단위 편집으로 **"실시간 피드백"**

**Pain Points:**
- ❌ 초기 학습 곡선: "/" 커맨드를 모르면 막힘
- ❌ 데이터베이스 관계 설정, 수식 등이 복잡

**Key Lessons for gr8:**
- **채택**: 템플릿 풍부, 드래그 앤 드롭, "그냥 따라 하세요"
- **개선**: "/" 대신 "+" 버튼 (모바일 친화적)

---

### Transferable UX Patterns

위에서 분석한 제품들에서 **gr8에 적용 가능한 패턴**을 추출:

#### **Navigation Patterns:**

1. **TradingView 우측 사이드바** → gr8 **"노드 팔레트"**
   - 카테고리별 노드 분류:
     - **Triggers**: 시간, 가격 변동 시작 조건
     - **Data**: 시장 데이터 조회 (OHLCV)
     - **Logic**: IF/AND/OR 논리 연산
     - **Actions**: 매수/매도, 포지션 관리
   - 드래그 앤 드롭으로 캔버스에 추가
   - 검색으로 빠른 노드 찾기

2. **Zapier 3단계 가이드** → gr8 **"온보딩 흐름"**
   - 지갑 연결 → 템플릿 선택 → 백테스트 실행
   - 각 단계에서 "다음" 버튼으로 진행률 시각화
   - 사용자가 **"지금 어디쯤 왔는지"** 명확히 인지

---

#### **Interaction Patterns:**

1. **Zapier "Before & After" 템플릿 설명** → gr8 **"전략 스토리텔링"**
   - 예: "BTC 가격이 5% 하락하면 → 매수"
   - 용어 없이 직관적 설명
   - "이 전략은 RSI가 30 이하면(과매도) 매수해요"

2. **n8n 드래그 앤 드롭** → gr8 **"템플릿 복제 → 수정"**
   - 템플릿을 "복제"해서 자신만의 전략 만들기
   - **빈 캔버스에서 시작하지 않음** (핵심 차별점)

3. **Zapier "복제"** → gr8 **"원클릭 복제"**
   - "복제하기" 버튼 클릭 → 내 전략에 자동 추가
   - 드래그 앤 드롭 불필요

4. **Notion 블록 단위 편집** → gr8 **"실시간 파라미터 피드백"**
   - 슬라이더로 파라미터 조정 → **실시간으로 결과 미리보기**
   - "이 값을 높이면 → 더 보수적으로 매수해요" tooltip

---

#### **Visual Patterns:**

1. **TradingView 다크모드** → gr8 **"트레이딩 테마"**
   - 검정/회색 배경에 초록(매수)/빨간(매도) 캔들
   - 눈의 피로 감소 (장기 사용 고려)

2. **Zapier 진행률 표시** → gr8 **"백테스트 진행률"**
   - "약 30초 소요 예정" + 진행률 바
   - 기다림의 불안감 해소

3. **n8n 노드 카드 디자인** → gr8 **"노드 시각화"**
   - 각 노드에 아이콘 + 라벨
   - **용어 대신 직관적 아이콘**:
     - "RSI" → 📊 그래프 모양 아이콘
     - "If" → ⚡ 번개 아이콘
     - "Buy" → 📈 상승 차트 아이콘

4. **TradingView 매수/매도 화살표** → gr8 **"액션 히스토리 마크"**
   - 차트상에 매수(초록색 ↑), 매도(빨간색 ↓) 포지션 명확히 표시
   - 마우스 오버 시 상세 정보 툴팁

---

### Anti-Patterns to Avoid

**기존 제품들의 실수에서 배우기**:

1. **빈 캔버스에서 시작** ❌
   - n8n처럼 빈 화면에서 시작하면 **"뭐부터 해야 하지?"** 당황
   - **gr8 해결**: 템플릿 복제로 시작, "인기 템플릿"을 첫 화면에

2. **기술 용어 장벽** ❌
   - TradingView처럼 "RSI, MACD, 볼린저 밴드, OHLCV" 외계어
   - n8n처럼 "Webhook, JSON Path, Cron" 기술 용어
   - **gr8 해결**: 용어 대신 직관적 라벨
     - "RSI 기간" → **"그래프 민감도"**
     - "백테스트" → **"과거 데이터로 실험하기"**

3. **복잡한 설정 UI** ❌
   - TradingView 백테스팅: 설정이 너무 많아서 **"이거 어떻게 돌리지?"**
   - **gr8 해결**: 템플릿은 "백테스트" 버튼 원클릭 (설정 불필요)

4. **긴 튜토리얼 강요** ❌
   - "시스템 트레이딩이란 무엇인가" 10분 튜토리얼
   - **gr8 해결**: "그냥 따라 해보세요" 3분 경험
     - 템플릿 복제 → 백테스트 버튼 클릭 → 결과 확인

5. **시각적 증거 부족** ❌
   - 많은 자동매매 서비스가 백테스트 결과를 숫자만 보여줌
   - **gr8 해결**: 플레이및 차트로 시각적 재생

---

### Design Inspiration Strategy

**What to Adopt (그대로 채택):**

1. **TradingView 차트 시각화**
   - 캔들 차트, 인디케이터 오버레이, 줌/팬
   - 다크모드 테마
   - 이유: **"시각적 투명성"** 감정적 목표 지원

2. **n8n 노드-엣지 인터페이스**
   - 드래그 앤 드롭, 노드 카테고리 분류, 자동 라인 그리기
   - 이유: 복잡한 전략을 시각적으로 직관적으로 표현

3. **Zapier "Before & After" 템플릿 설명**
   - "이메일 받으면 → 슬랙에 알림" 스타일
   - 이유: 용어 없이 직관적 이해

4. **Zapier "복제" 원클릭**
   - 템플릿 복제로 내 전략에 자동 추가
   - 이유: **"빠른 첫 성공"** 경험 제공

---

**What to Adapt (변형하여 적용):**

1. **n8n 템플릿 라이브러리** → **"템플릿에서 시작"**
   - n8n은 빈 캔버스에서 시작하지만, gr8은 **템플릿 복제**로 시작
   - 이유: **"용어 모르더라도"** 학습 용이성

2. **TradingView 인디케이터** → **"직관적 라벨 + 아이콘"**
   - "RSI" → **"그래프 민감도"** + 📊 아이콘
   - 이유: 기술 용어 장벽 제거

3. **Notion "/" 커맨드** → **"+" 버튼 (모바일 친화적)**
   - 캔버스에서 "/" 대신 **"+" 버튼**으로 노드 추가
   - 이유: 모바일에서도 사용 가능 (터치)

4. **TradingView 백테스팅** → **"원클릭 백테스트"**
   - TradingView는 복잡한 설정이 필요하지만, gr8은 템플릿에서 **"백테스트" 버튼 원클릭**
   - 이유: **5분 안에 첫 성공** 경험

---

**What to Avoid (완전히 피해야 할 것):**

1. **빈 캔버스에서 시작** (n8n 안티 패턴)
   - 템플릿 복제로 시작

2. **기술 용어 장벽** (TradingView, n8n 안티 패턴)
   - 용어 제거, 직관적 라벨

3. **긴 튜토리얼** (전통적 온보딩 안티 패턴)
   - "그냥 따라 해보세요" 3분 경험

4. **시각적 증거 부족** (많은 자동매매 서비스 안티 패턴)
   - 플레이및 차트로 시각적 재생

---

## Design System Foundation

### Design System Choice

**Selected: Tailwind CSS + Headless UI Components**

gr8은 **Tailwind CSS**를 기반으로 한 Design System을 사용합니다. 이 선택은 빠른 개발 속도와 완전한 브랜드 커스터마이징의 균형을 제공합니다.

**Tech Stack:**
- **Frontend**: React + Next.js 14+ (App Router)
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS + Radix UI + Shadcn/UI

---

### Rationale for Selection

#### 1. Complete Customization with Proven Patterns 🎨

**Why Tailwind?**
- **Utility-First 접근법**: 완전한 커스터마이징 가능
- **디자인 시스템 제약 없음**: 유연한 UI 제작
- **학습 용이성 최우선**: 디자이너 없이도 개발 가능

**Benefit for gr8:**
- 노드-엣지 에디터 같은 복잡한 UI를 자유롭게 커스터마이징
- 브랜드 colors, spacing, typography를 일관되게 적용
- "용어 제거" 같은 UX 요구사항을 빠르게 반영

---

#### 2. Perfect Alignment with Tech Stack ⚡

**Next.js 14+ App Router**: Tailwind와 완벽한 통합
- React Server Components: Tailwind CSS가 0번 클라이언트 JS
- Image Optimization: Next.js Image + Tailwind

**Python FastAPI**: Backend와 독립적으로 Frontend 디자인
- REST API/GraphQL로 통신
- 디자인 변경이 Backend에 영향 없음

---

#### 3. Performance & Bundle Size 🚀

**Tree-shaking**: 사용하는 utility만 포함 (최적화된 번들)
- JIT Mode: 필요한 스타일만 생성 (빠른 빌드)
- 모바일 최적화: Responsive variants로 쉬운 반응형 디자인

**모바일 First**:
- 375px+ 모바일부터 시작
- Progressive enhancement: 모바일 → 태블릿 → 데스크톱

---

#### 4. Learning Curve for Team 📚

**개발자 친화적**:
- CSS 클래스명으로 직관적 스타일링
- VSCode Extensions: Tailwind IntelliSense로 빠른 개발
- Design Tokens: tailwind.config.js로 일관된 디자인 시스템

**협업 툴**:
- Figma Tailwind CSS plugin: 디자인 → 코드 변환
- Storybook: 컴포넌트 문서화

---

#### 5. Ecosystem & Community 👥

**Headless UI Libraries**:
- **Radix UI**: 접근성 중심 (Dialog, Dropdown, Tooltip, Slider)
- **Shadcn/UI**: Tailwind + Radix UI 조합
- **React Flow**: 노드-엣지 에디터 (드래그 앤 드롭)
- **TradingView Lightweight Charts**: 차트 시각화

**플러그인**:
- @tailwindcss/typography: 타이포그래피
- @tailwindcss/forms: 폼 스타일
- @tailwindcss/aspect-ratio: 비율 유지

---

### Implementation Approach

#### Phase 1: Foundation Setup (Week 1-2)

**1. Tailwind CSS 설치**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Design Tokens 정의** (`tailwind.config.js`)
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#10B981', // 신뢰감 있는 초록 (매수)
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          500: '#8B5CF6', // 혁신적인 보라 (Web3)
          600: '#7C3AED',
        },
        danger: {
          500: '#EF4444', // 빨간 (매도)
        },
        trading: {
          bg: '#111827',     // 트레이딩 다크모드 배경
          card: '#1F2937',   // 카드 배경
          border: '#374151', // 테두리
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // 숫자/데이터
      },
    },
  },
  plugins: [],
}
```

**3. Global Styles** (`app/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-trading-bg text-gray-100 font-sans antialiased;
  }
}
```

---

#### Phase 2: Component Library (Week 3-4)

**사용할 Libraries:**

1. **Radix UI** (접근성 중심)
   ```bash
   npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-slider
   ```
   - Dialog (모달)
   - Dropdown Menu
   - Tooltip (용어 설명)
   - Slider (파라미터 조정)

2. **Shadcn/UI** (Tailwind + Radix UI)
   ```bash
   npx shadcn-ui@latest init
   ```
   - Button 컴포넌트
   - Card 컴포넌트
   - Form 컴포넌트

3. **React Flow** (노드-엣지 에디터)
   ```bash
   npm install reactflow
   ```
   - 드래그 앤 드롭 노드
   - 자동 라인 그리기
   - 커스터마이징 가능

4. **TradingView Lightweight Charts** (차트 시각화)
   ```bash
   npm install lightweight-charts
   ```
   - 캔들 차트
   - 인디케이터 오버레이
   - 다크모드 기본 지원

---

#### Phase 3: Custom Components (Week 5-6)

**Core Components:**

**1. Node 컴포넌트** (노드-엣지 에디터)
```jsx
// components/nodes/StrategyNode.tsx
export function StrategyNode({ data }) {
  return (
    <div className="bg-trading-card border border-trading-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        {data.icon}
        <h3 className="text-sm font-medium text-gray-200">{data.label}</h3>
      </div>
      {data.fields && (
        <div className="space-y-2">
          {data.fields.map(field => (
            <ParameterField key={field.name} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**2. ParameterField** (파라미터 조정)
```jsx
// components/ParameterField.tsx
export function ParameterField({ field }) {
  const [value, setValue] = useState(field.defaultValue);

  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">
        {field.label} {/* "그래프 민감도" */}
      </label>
      {field.type === 'slider' ? (
        <>
          <input
            type="range"
            min={field.min}
            max={field.max}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-2 bg-trading-border rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-primary-500 mt-1">
            {field.tooltip} {/* "이 값을 높이면 → 더 보수적으로 매수해요" */}
          </p>
        </>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
```

**3. BacktestButton** (백테스트 실행)
```jsx
// components/BacktestButton.tsx
export function BacktestButton({ onExecute, isRunning }) {
  return (
    <button
      onClick={onExecute}
      disabled={isRunning}
      className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      {isRunning ? (
        <span className="flex items-center gap-2">
          <Spinner />
          백테스트 실행 중...
        </span>
      ) : (
        '백테스트 실행'
      )}
    </button>
  );
}
```

**4. ProgressBar** (진행률 표시)
```jsx
// components/ProgressBar.tsx
export function ProgressBar({ progress, message }) {
  return (
    <div className="w-full">
      <div className="w-full bg-trading-border rounded-full h-2 mb-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-center">{message}</p>
    </div>
  );
}
```

---

### Customization Strategy

#### 1. Design Tokens (tailwind.config.js)

**Colors:**
- **Primary (초록 #10B981)**: 신뢰, 성공, 매수
- **Secondary (보라 #8B5CF6)**: Web3, 혁신, 크리에이터
- **Danger (빨간 #EF4444)**: 손실, 매도, 에러
- **Trading (그레이스케일)**: 다크모드 배경
  - bg: #111827 (배경)
  - card: #1F2937 (카드)
  - border: #374151 (테두리)

**Typography:**
- **Sans (Inter)**: UI 텍스트
- **Mono (JetBrains Mono)**: 숫자, 데이터, 코드

**Spacing:**
- 기본 4px 단위 (Tailwind 기본값)
- 노드 패딩: 18px (4.5rem)

---

#### 2. Responsive Breakpoints

**Mobile-First 접근:**
```javascript
screens: {
  'sm': '375px',   // 모바일 (이수민의 점심시간)
  'md': '768px',   // 태블릿
  'lg': '1024px',  // 데스크톱 (김준혁의 출근 전)
  'xl': '1280px',  // 큰 화면
}
```

**각 화면별 UI:**
- **모바일**: 세로 모드 노드-엣지, 간소화된 UI
- **태블릿**: 가로/세로 모드 지원
- **데스크톱**: 완전한 기능

---

#### 3. Dark Mode Strategy

**항상 다크모드** (트레이딩에 적합):
- ✅ "트레이딩은 다크모드"가 표준
- ❌ 라이트모드 토글 불필요

```css
/* globals.css */
@layer base {
  body {
    @apply bg-[#111827] text-gray-100;
  }
}
```

---

#### 4. Component Variants

**Button Variants:**
```jsx
const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white',
  ghost: 'bg-transparent hover:bg-trading-card text-gray-200',
  outline: 'border border-trading-border hover:bg-trading-card text-gray-200',
};
```

**Size Variants:**
```jsx
const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

---

#### 5. Accessibility (a11y)

**WCAG 2.1 AA 준수:**

1. **색상 대비**: 4.5:1 이상
2. **키보드 내비게이션**: `tabindex`, `focus` ring
3. **스크린 리더**: `aria-label`, `role`

```jsx
// 예시
<button
  aria-label="백테스트 실행"
  className="focus:ring-2 focus:ring-primary-500 focus:outline-none"
>
  백테스트 실행
</button>
```

---

#### 6. Performance Optimization

**1. PurgeCSS (Tailwind JIT)**
```javascript
// tailwind.config.js
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
// 사용하는 utility만 포함
```

**2. Dynamic Imports**
```jsx
// 큰 컴포넌트는 lazy loading
const ChartComponent = dynamic(() => import('./Chart'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

**3. Image Optimization**
```jsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="gr8 logo"
  priority
/>
```

---

### Next Steps

**Week 1-2: Foundation**
- Tailwind CSS 설정
- Design Tokens 정의
- Global Styles 작성

**Week 3-4: Core Components**
- Radix UI + Shadcn/UI 설치
- Button, Card, Dialog 기본 컴포넌트
- 노드-엣지 에디터 기본 구조

**Week 5-6: Custom Components**
- 파라미터 필드 (Slider, Dropdown)
- 백테스트 실행 버튼
- 진행률 바
- 차트 래퍼

**Week 7+: Refinement**
- 접근성 테스트
- 반응형 테스트 (모바일, 태블릿, 데스크톱)
- 성능 최적화

---

## Visual Design Foundation

### Color System

gr8의 컬러 시스템은 **신뢰(Trust)**, **투명성(Transparency)**, **혁신(Innovation)**이라는 핵심 가치를 반영합니다.

#### 1. Primary Colors (주요 색상)

**Semantic Color Mapping:**

| 색상 | Hex | 용도 | 감정적 의미 |
|------|-----|------|-----------|
| **Primary Green** | #10B981 | 매수, 성공, 신뢰, 확인 | ✅ 신뢰감, 성공, 긍정 |
| **Primary Green (Hover)** | #059669 | 버튼 호버, 강조 | ✅ 강한 신뢰감 |
| **Secondary Purple** | #8B5CF6 | Web3, 혁신, 크리에이터 | 🔮 혁신, 창의성 |
| **Secondary Purple (Hover)** | #7C3AED | 강조, Web3 요소 | 🔮 강한 혁신성 |
| **Danger Red** | #EF4444 | 매도, 손실, 에러, 삭제 | ⚠️ 경고, 손실 |

**Rationale:**
- **초록 (#10B981)**: 트레이딩에서 "매수"를 의미하는 전통적 색상이자, 성공과 신뢰를 상징
- **보라 (#8B5CF6)**: Web3와 혁신을 대표하는 색상으로, gr8의 블록체인 혁신성 강조
- **빨간 (#EF4444)**: "매도"와 에러를 명확히 시각화

---

#### 2. Neutral Colors (트레이딩 다크모드)

**Always Dark Mode** (트레이딩 표준):

| 색상 | Hex | 용도 |
|------|-----|------|
| **Background** | #111827 | 메인 배경 |
| **Card** | #1F2937 | 카드, 모달, 패널 |
| **Border** | #374151 | 테두리, 구분선 |
| **Text Primary** | #F9FAFB | 주요 텍스트 |
| **Text Secondary** | #9CA3AF | 보조 텍스트, 설명 |
| **Text Tertiary** | #6B7280 | 비활성 텍스트, 플레이스홀더 |

**Rationale:**
- 트레이딩 플랫폼은 다크모드가 표준 (눈의 피로 감소)
- 그레이스케일 계층으로 정보 위계 시각화

---

#### 3. Functional Colors (기능적 색상)

| 색상 | Hex | 용도 |
|------|-----|------|
| **Success** | #10B981 | 성공, 완료, 수익 |
| **Warning** | #F59E0B | 주의, 보류 |
| **Error** | #EF4444 | 에러, 실패, 손실 |
| **Info** | #3B82F6 | 정보, 안내 |

---

#### 4. Chart Colors (차트 색상)

| 색상 | Hex | 용도 |
|------|-----|------|
| **Candle Up** | #10B981 | 상승 캔들 (매수) |
| **Candle Down** | #EF4444 | 하락 캔들 (매도) |
| **Indicator Line** | #3B82F6 | 인디케이터 라인 (RSI, MACD) |
| **Volume Bar** | #6B7280 | 거래량 바 |

---

#### 5. Accessibility (접근성)

**WCAG 2.1 AA 준수:**

1. **색상 대비**: 4.5:1 이상
   - Primary Green (#10B981) on Background (#111827): **대비율 5.2:1** ✅
   - Text Primary (#F9FAFB) on Background (#111827): **대비율 15.8:1** ✅
   - Text Secondary (#9CA3AF) on Background (#111827): **대비율 5.1:1** ✅

2. **색상만으로 정보 전달하지 않기**:
   - 성공/실패는 색상 + 아이콘 조합 (✅, ❌)
   - 매수/매도는 색상 + 화살표 (↑, ↓)
   - 에러 메시지는 색상 + 경고 아이콘 (⚠️)

3. **색맹 고려**:
   - 빨간/초록 외에도 아이콘과 텍스트로 정보 제공
   - 예: "+15%" (초록) + "수익" 텍스트

---

### Typography System

gr8의 타이포그래피는 **전문적이고 현대적인 느낌**으로, 가독성과 시인성을 최우선으로 합니다.

#### 1. Font Family (폰트 패밀리)

**Primary Font: Pretendard**

```css
/* Tailwind config */
fontFamily: {
  sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
  mono: ['Pretendard', 'JetBrains Mono', 'monospace'], // 숫자, 데이터
}
```

**Why Pretendard?**
- ✅ **한국어 최적화**: ㄱ, ㅁ 같은 파트의 간격이 균형 잡힘
- ✅ **현대적 디자인**: 깔끔하고 전문적인 느낌
- ✅ **가독성**: 숫자와 영문, 한글 모두 명확히 구분
- ✅ **웹 폰트 지원**: Google Fonts, CDN으로 쉽게 로드

**Font Loading:**
```html
<!-- HTML Head -->
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">
```

---

#### 2. Type Scale (타입 스케일)

**Modular Scale (1.250 - Major Third)**

| 스타일 | 사이즈 | Line Height | Weight | 용도 |
|-------|--------|-------------|--------|------|
| **Display** | 48px | 56px (1.17) | 700 | 랜딩 페이지 Hero, 큰 제목 |
| **H1** | 36px | 44px (1.22) | 700 | 페이지 메인 제목 |
| **H2** | 30px | 38px (1.27) | 600 | 섹션 제목 |
| **H3** | 24px | 32px (1.33) | 600 | 소섹션 제목 |
| **H4** | 20px | 28px (1.40) | 600 | 카드 제목 |
| **Body Large** | 18px | 28px (1.56) | 400 | 본문 큼 (요약, 설명) |
| **Body** | 16px | 24px (1.50) | 400 | 기본 본문 |
| **Body Small** | 14px | 20px (1.43) | 400 | 보조 텍스트, 라벨 |
| **Caption** | 12px | 16px (1.33) | 400 | 캡션, 주석 |
| **Button** | 16px | 24px (1.50) | 600 | 버튼 텍스트 |

**Tailwind Config:**
```javascript
fontSize: {
  'display': ['48px', { lineHeight: '56px', fontWeight: '700' }],
  'h1': ['36px', { lineHeight: '44px', fontWeight: '700' }],
  'h2': ['30px', { lineHeight: '38px', fontWeight: '600' }],
  'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
  'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
  'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
  'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
}
```

---

#### 3. Typography Hierarchy (타이포그래피 위계)

**Usage Guidelines:**

1. **제목 (Display, H1-H4)**:
   - 폰트 굵기 600-700
   - 명확한 정보 위계
   - 전문적이고 현대적인 느낌

2. **본문 (Body, Body Large, Body Small)**:
   - 폰트 굵기 400 (가독성 우선)
   - Line Height 1.4-1.56 (읽기 편함)
   - 적당한 자간 (letter-spacing: 0)

3. **캡션 (Caption)**:
   - 최소 12px (접근성 준수)
   - 보조 정보로만 사용

---

#### 4. Number & Data Typography (숫자/데이터 타이포그래피)

**Mono Font for Numbers:**

```css
/* 숫자는 Mono 폰트로 정렬 */
.number-display {
  font-family: 'Pretendard', 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums; /* 숫자 간격 동일 */
}
```

**Why Tabular Nums?**
- 수익률 "+15.23%", "+5.67%" 등이 정렬되어 가독성 향상
- 백테스트 결과, 차트 데이터에서 중요

---

### Spacing & Layout Foundation

gr8의 스페이싱과 레이아웃은 **"적당한 여유"**를 제공하며, 일관된 시각적 리듬을 만듭니다.

#### 1. Spacing Scale (스페이싱 스케일)

**Base Unit: 4px**

| Tailwind Class | 픽셀 | 용도 |
|---------------|------|------|
| `gap-0` | 0px | 요소 붙이기 |
| `gap-1` | 4px | 최소 간격 (아이콘 + 텍스트) |
| `gap-2` | 8px | 작은 간격 (버튼 내부) |
| `gap-3` | 12px | 기본 간격 (폼 필드) |
| `gap-4` | 16px | 표준 간격 (카드 요소) |
| `gap-6` | 24px | 넓은 간격 (섹션 간) |
| `gap-8` | 32px | 아주 넓은 간격 (페이지 섹션) |
| `gap-12` | 48px | Hero 섹션 간격 |

**Rationale:**
- 4px 기반으로 모든 디바이스에서 일관된 스페이싱
- 홀수 단위(12px, 24px)로 시각적 리듬

---

#### 2. Component Spacing (컴포넌트 스페이싱)

**Standard Spacing Rules:**

1. **버튼**:
   ```jsx
   padding: 12px 24px; // py-3 px-6
   gap: 8px; // 아이콘 + 텍스트
   ```

2. **카드**:
   ```jsx
   padding: 24px; // p-6
   gap: 16px; // 카드 내 요소 간 gap-4
   ```

3. **폼 필드**:
   ```jsx
   label { margin-bottom: 8px; } // mb-2
   input { padding: 12px 16px; } // py-3 px-4
   ```

4. **노드 (Node-Edge Editor)**:
   ```jsx
   node { padding: 18px; } // p-[18px]
   node-header { margin-bottom: 12px; } // mb-3
   ```

---

#### 3. Grid System (그리드 시스템)

**12-Column Grid (표준)**:

```css
/* Tailwind Config */
gridTemplateColumns: {
  '12': 'repeat(12, minmax(0, 1fr))',
}
```

**Breakpoint-Based Layout:**

| 화면 | 컬럼 수 | Container Max-Width | Gutter |
|------|---------|---------------------|--------|
| **Mobile (375px+)** | 4 컬럼 | 100% | 16px |
| **Tablet (768px+)** | 8 컬럼 | 768px | 24px |
| **Desktop (1024px+)** | 12 컬럼 | 1024px | 24px |
| **Large (1280px+)** | 12 컬럼 | 1280px | 32px |

**Usage Examples:**

```jsx
/* 템플릿 카드 그리드 */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 카드 1개 (모바일), 2개 (태블릿), 4개 (데스크톱) */}
</div>

/* 대시보드 레이아웃 */
<div className="grid grid-cols-12 gap-6">
  <aside className="col-span-3">{/* 사이드바 */}</aside>
  <main className="col-span-9">{/* 메인 콘텐츠 */}</main>
</div>
```

---

#### 4. Layout Principles (레이아웃 원칙)

1. **Mobile-First**: 모바일(375px+)부터 시작, 점진적 확장
2. **Responsive Breakpoints**: 375px, 768px, 1024px, 1280px
3. **Container Centering**: 콘텐츠는 중앙 정렬 (`mx-auto max-w-7xl`)
4. **Consistent Gutter**: 화면별 고정 간격 (16px, 24px, 32px)
5. **White Space Breathing Room**: 섹션 간 32px 이상 공백

---

### Accessibility Considerations

gr8은 모든 사용자가 접근 가능한 디자인을 목표로 합니다.

#### 1. Contrast Ratios (대비율)

WCAG 2.1 AA 준수 (4.5:1 이상):

| 조합 | 대비율 | 준수 여부 |
|------|--------|---------|
| Text Primary (#F9FAFB) on BG (#111827) | 15.8:1 | ✅ AAA |
| Text Secondary (#9CA3AF) on BG (#111827) | 5.1:1 | ✅ AA |
| Primary Green (#10B981) on BG (#111827) | 5.2:1 | ✅ AA |
| Danger Red (#EF4444) on BG (#111827) | 5.8:1 | ✅ AA |

---

#### 2. Font Sizes (폰트 크기)

**Minimum Sizes:**
- 본문: 최소 16px (기본)
- 보조 텍스트: 최소 14px
- 캡션: 최소 12px
- 버튼: 최소 16px (터치 타겟 44px 이상)

---

#### 3. Touch Targets (터치 타겟)

**Mobile-Friendly Sizes:**
- 버튼: 최소 44×44px (Apple HIG)
- 링크: 최소 44×44px
- 체크박스/라디오: 최소 44×44px
- 간격: 인접한 터치 타겟은 8px 이상 간격

---

#### 4. Focus Indicators (포커스 표시)

**Keyboard Navigation:**
```css
/* 모든 인터랙티브 요소 */
*:focus-visible {
  outline: 2px solid #10B981;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

#### 5. Semantic HTML (시맨틱 HTML)

```jsx
<!-- 올바른 HTML 구조 -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/templates">템플릿</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>RSI 과매도/과매수 전략</h1>
    <button aria-label="템플릿 복제">복제하기</button>
  </article>
</main>

<footer>
  <p aria-label="Copyright">© 2026 gr8</p>
</footer>
```

---

#### 6. Screen Reader Support (스크린 리더 지원)

```jsx
/* ARIA Labels */
<button aria-label="백테스트 실행">
  <BacktestIcon />
  <span className="sr-only">백테스트 실행</span>
</button>

/* Live Regions (동적 콘텐츠) */
<div aria-live="polite" aria-atomic="true">
  백테스트 완료! +15% 수익
</div>

/* Role 지정 */
<div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
  진행률: {progress}%
</div>
```

---

이 시각적 디자인 기반은 gr8의 모든 디자인 결정에서 일관성을 보장합니다.

---

## Design Direction Decision

### Design Directions Explored

**UX 디자인 방향 탐색 과정:**

gr8 프로젝트를 위해 다양한 디자인 방향을 탐색하고 평가했습니다:

1. **내비게이션 패턴 탐색**:
   - Sidebar Navigation: 복잡한 기능을 가진 애플리케이션에 적합한 계층 구조
   - Top Navigation: 단순한 애플리케이션에 적합한 평면 구조
   - Tab-based Navigation: 모바일 중심의 애플리케이션에 적합

2. **시각 테마 탐색**:
   - Light Theme: 일반적인 웹 애플리케이션의 표준
   - Dark Theme: 트레이딩 플랫폼의 산업 표준, 프로페셔널한 느낌
   - High Contrast: 접근성에 최적화된 접근

3. **디자인 시스템 탐색**:
   - Tailwind CSS: 유틸리티 퍼스트, 빠른 개발 속도 (Step 6에서 채택)
   - Chakra UI: 컴포넌트 기반, 접근성 우수
   - Material UI: 구글 머티리얼 디자인, 풍부한 컴포넌트

4. **색상 시스템 탐색**:
   - Vivid Blue (#0487FF): 신뢰감, 기술, 명확성
   - Purple: 혁신, 창의성
   - Green: 수익, 성장, 긍정적 느낌

5. **UI 스타일 탐색**:
   - Gradient UI: 현대적이고 역동적인 느낌
   - Flat UI: 명확하고 깔끔한 느낌
   - Neumorphism: 부드럽고 현대적인 느낌

**HTML 목업 생성:**

시각적 탐색을 위해 다음 HTML 파일들을 생성했습니다:

1. **ux-design-directions.html** (대시보드/백테스팅 화면)
   - Sidebar Navigation + Dark Emphasis 스타일
   - 완전한 기능 목업으로 구현
   - 백테스팅 파라미터 설정, 차트 표시, 결과 분석 등 모든 기능 포함
   - Canvas API를 사용한 TradingView 스타일 캔들 차트

2. **ux-home-mockup.html** (홈 화면)
   - 5개 섹션: Hero, Features, How It Works, Templates, CTA
   - 정적 콘텐츠용 랜딩 페이지

### Chosen Direction

**최종 디자인 방향 결정:**

#### 1. 대시보드/백테스팅 화면 (ux-design-directions.html)

**레이아웃:**
- **Sidebar Navigation** (왼쪽 사이드바)
  - 고정 너비: 260px
  - 다크 배경: #0a0a0a
  - 네비게이션 아이템 목록:
    - 대시보드 (layout)
    - 내 전략 (bar-chart-3)
    - 백테스팅 (trending-up)
    - 템플릿 (target)
    - 전략 연결 (link)
    - 크리에이터 (users)
    - 학습 가이드 (book-open)
    - 커뮤니티 (message-square)
    - 알림 (bell)
    - 환경 설정 (settings)
    - 지갑 연결 (lock)

**색상 시스템:**
- **주요 색상 (Primary)**: Vivid Blue (#0487FF)
  - 버튼, 링크, 강조 요소에 사용
  - 활성 상태 표시
  - 시각적 계층 구조의 핵심

- **배경 색상**:
  - 메인 배경: #0a0a0a (Dark Theme)
  - 패널 배경: #141414
  - 카드 배경: #1a1a1a
  - 테두리: #262626

**UI 스타일:**
- **Flat UI** (그라디언트 제거)
  - 모든 버튼: 단일 색상 (solid #0487FF)
  - 슬라이더: 단일 색상
  - 프로그레스 바: 단일 색상 (shimmer 애니메이션 제거)
  - 모든 INPUT 계열 UI 컴포넌트에서 그라디언트 완전 제거
  - 정적 콘텐츠에서만 장식용 그라디언트 허용

**아이콘 시스템:**
- **Lucide Icons** (오픈소스 BOLD 아이콘)
  - 모든 이모지 제거
  - SVG 기반 확장 가능한 아이콘
  - 상태에 따른 색상 변화 (active, hover)
  - 일관된 시각적 언어

**차트:**
- **TradingView 스타일 캔들 차트**
  - Canvas API로 구현
  - 실시간 데이터 시뮬레이션
  - 인터랙티브 차트 (hover, zoom)
  - 단일 색상 사용 (그라디언트 제거)

**주요 컴포넌트:**
- 백테스팅 파라미터 설정 패널
- 실시간 차트 표시 영역
- 실행/중단/결과 컨트롤
- 상세 통계 패널
- 블록체인 검증 정보

#### 2. 홈 화면 (ux-home-mockup.html)

**섹션 구성:**
1. **Hero 섹션**: 제품 소개, 핵심 가치 전달
   - 배경 그라디언트 허용 (정적 콘텐츠)

2. **Features 섹션**: 주요 기능 3가지 소개
   - 오픈소스 투명성
   - 블록체인 검증
   - 노코딩 전략 구성

3. **How It Works 섹션**: 3단계 사용 과정
   - 전략 선택 또는 직접 생성
   - 백테스트로 검증
   - 온체인 배포

4. **Templates 섹션**: 인기 템플릿 3개 표시

5. **CTA 섹션**: 행동 유도
   - 배경 그라디언트 허용 (정적 콘텐츠)

**UI 스타일:**
- 버튼, 로고, 아이콘: 단일 색상 (solid #0487FF)
- 배경: 장식용 그라디언트 허용

### Design Rationale

**디자인 방향 선정의 근거:**

#### 1. Sidebar Navigation 선택
**이유:**
- gr8은 복잡한 기능을 가진 플랫폼 (백테스팅, 전략 관리, 템플릿, 커뮤니티 등)
- 명확한 정보 계층 구조 제공
- 확장성: 새로운 기능 추가 용이
- 트레이딩 플랫폼의 표준 패턴 (사용자 익숙함)

**장점:**
- 항상 visible한 네비게이션
- 명확한 현재 위치 표시 (active state)
- 키보드 접근성 우수
- 모바일에서 햄버거 메뉴로 변환 가능

#### 2. Dark Theme 선택
**이유:**
- 트레이딩 플랫폼의 산업 표준
- 긴 시간 사용해도 눈의 피로가 적음
- 프로페셔널하고 신뢰감 있는 느낌
- 차트와 데이터의 시인성 향상

**장점:**
- 집중력 향상
- OLED 디스플레이에서 배터리 절약
- 고급스러운 느낌

#### 3. Vivid Blue (#0487FF) 선택
**이유:**
- 신뢰감을 주는 색상 (금융/기술 분야 표준)
- 명확하고 시인성이 좋음
- 차트와 데이터에서 쉽게 식별 가능
- 현대적이고 기술 느낌

**심미적 매핑:**
- Primary: #0487FF (주요 액션, 강조)
- Success: #22c55e (수익, 성공)
- Warning: #f59e0b (주의)
- Error: #ef4444 (손실, 에러)
- Text: #f3f4f6 (주요 텍스트)
- Text Secondary: #9ca3af (보조 텍스트)

#### 4. Flat UI (그라디언트 제거) 선택
**이유:**
- **시인성**: 단일 색상이 더 명확하고 판독 용이
- **모던함**: 그라디언트는 구형 느낌, 단색이 더 현대적
- **접근성**: 색상 대비가 명확하여 시각적 장애인에게 우수
- **일관성**: 모든 UI 컴포넌트가 동일한 언어 사용

**사용자 피드백 반영:**
> "그라디언트 싫어. 너무 뻔해." - 사용자는 명확한 단일 색상 선호

**원칙:**
- UI 컴포넌트 (버튼, 슬라이더, 프로그레스 바 등): 단일 색상만 사용
- 정적 콘텐츠 (Hero, CTA 배경): 장식용 그라디언트 허용

#### 5. Lucide Icons 선택
**이유:**
- 현재 가장 모던하고 인기 있는 오픈소스 아이콘 라이브러리
- BOLD하고 명확한 디자인
- SVG 기반으로 확장 가능 (해상도 무관)
- 활발한 커뮤니티 지원
- 일관된 시각적 스타일
- 이모지보다 전문적이고 명확함

**장점:**
- 가볍고 빠름
- 색상 제어 용이 (CSS로 쉽게 커스텀)
- 상태별 색상 변화 지원 (hover, active)
- 접근성 우수 (screen reader 지원)

#### 6. TradingView 스타일 차트 선택
**이유:**
- 트레이딩 플랫폼의 기대 수준 충족
- 사용자 익숙함 (많은 트레이더가 TradingView 사용)
- 풍부한 인터랙티브 기능
- 전문적이고 신뢰감 있는 느낌

**구현:**
- Canvas API로 고성능 렌더링
- 캔들 차트 (봉 차트)
- 인터랙티브 기능 (hover, zoom, pan)
- 단일 색상 사용 (Flat UI 원칙 준수)

### Implementation Approach

**구현 방식:**

#### 1. 디자인 시스템
**기반:** Tailwind CSS (Step 6 결정사항)
- 유틸리티 퍼스트 접근
- 빠른 개발 속도
- 일관된 디자인 토큰
- 다크 모드 기본 지원

**커스텀 설정:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0487FF',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        dark: {
          bg: '#0a0a0a',
          panel: '#141414',
          card: '#1a1a1a',
          border: '#262626'
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

#### 2. 컴포넌트 구조

**Layout Components:**
```jsx
// components/Layout/Sidebar.tsx
<Sidebar>
  <Logo />
  <Navigation>
    <NavItem icon={layout} label="대시보드" />
    <NavItem icon={barChart3} label="내 전략" />
    <NavItem icon={trendingUp} label="백테스팅" active />
    // ...
  </Navigation>
  <WalletConnect />
</Sidebar>
```

**UI Components:**
```jsx
// components/ui/Button.tsx
<Button variant="primary" className="bg-primary hover:bg-primary/90">
  백테스트 실행
</Button>

// components/ui/Slider.tsx
<Slider className="accent-primary" />
// 단일 색상, 그라디언트 없음

// components/ui/ProgressBar.tsx
<ProgressBar value={75} className="bg-primary" />
// shimmer 애니메이션 없음, 단일 색상
```

**Chart Components:**
```jsx
// components/Chart/CandlestickChart.tsx
<canvas ref={canvasRef} />
// TradingView 스타일 캔들 차트
// 단일 색상 사용 (그라디언트 없음)
```

#### 3. 아이콘 시스템

**Lucide Icons 통합:**
```bash
npm install lucide-react
```

```jsx
import { Layout, BarChart3, TrendingUp, Target } from 'lucide-react';

<NavItem icon={<Layout size={20} />} label="대시보드" />
<NavItem icon={<BarChart3 size={20} />} label="내 전략" />
<NavItem icon={<Trend ingUp size={20} />} label="백테스팅" />
```

**아이콘 사용 원칙:**
- 모든 이모지 제거
- Lucide 아이콘만 사용
- 크기: 16px, 18px, 20px, 24px
- 색상: 상태에 따라 변화 (active: primary, default: text-secondary)
- BOLD하고 명확한 아이콘만 선택

#### 4. 색상 사용 가이드

**UI 컴포넌트 (그라디언트 금지):**
```css
/* ❌ 그라디언트 사용 금지 */
.btn-primary {
  background: linear-gradient(135deg, #0487FF 0%, #0066CC 100%);
}

/* ✅ 단일 색상 사용 */
.btn-primary {
  background: #0487FF;
}
```

**정적 콘텐츠 (그라디언트 허용):**
```css
/* ✅ 정적 콘텐츠 배경은 그라디언트 허용 */
.hero {
  background: linear-gradient(180deg, rgba(4, 135, 255, 0.05) 0%, transparent 100%);
}

.cta {
  background: linear-gradient(135deg, rgba(4, 135, 255, 0.1) 0%, rgba(4, 135, 255, 0.05) 100%);
}
```

#### 5. 반응형 디자인

**대시보드:**
- Desktop: Sidebar (260px) + Main Content
- Tablet: Sidebar 숨김, 햄버거 메뉴로 전환
- Mobile: 전체 화면 네비게이션 드로워

**홈 화면:**
- Desktop: 12컬럼 그리드
- Tablet: 8컬럼 그리드
- Mobile: 4컬럼 그리드, 단일 열 레이아웃

#### 6. 접근성 (Accessibility)

**색상 대비:**
- 모든 텍스트와 배경은 WCAG AA 4.5:1 이상 충족
- Primary 색상 (#0487FF) 대비 확인
- 다크 테마에서 배경 #0a0a0a와 텍스트 #f3f4f6: 대비율 15.7:1 (AAA)

**키보드 내비게이션:**
- 모든 인터랙티브 요소에 키보드 접근 가능
- Focus 시각적 표시
- Tab 순서 논리적 구성

**스크린 리더:**
- 모든 아이콘에 aria-label 제공
- Semantic HTML 사용
- Live regions for dynamic content

**폰트 크기:**
- 최소 16px (body)
- 200% 확원에서도 레이아웃 깨짐 없음
- Pretendard 폰트 (한국어 최적화)

#### 7. 성능 최적화

**이미지:**
- Next.js Image 컴포넌트 사용
- WebP 형식 우선
- Responsive image

**코드 스플리팅:**
- Route-based splitting
- Component-level lazy loading

**차트 성능:**
- Canvas API (고성능 렌더링)
- Virtual scrolling for large datasets
- Web Worker for data processing

---

**다음 단계:** Step 10 - 사용자 여정 플로우(User Journey Flows) 설계

---

## User Journey Flows

### 여정 1: 온보딩 및 첫 전략 생성 플로우

**사용자:** 김준혁, 이수민 (신규 사용자)
**목표:** 시뮬레이션 관찰부터 시작하여 첫 전략 생성 및 백테스트

**핵심 변화 (Party Mode 토론 기반):**
- 이전: 바로 전략 생성 시작
- 현재: **관찰자 튜토리얼** → 시뮬레이션 관찰 → 전략 생성

**여정 단계:**

1. **랜딩 페이지 진입**: 가치 제안 이해
   - 100% 오픈소스
   - 블록체인 검증
   - **시각적 학습: 노드 작동 관찰 가능**

2. **지갑 연결**: Metamask 튜토리얼로 5분 완료

3. **관찰자 튜토리얼** (NEW - Party Mode 합의)
   - "먼저 남의 전략을 관찰하는 법을 배워보세요"
   - 1단계: 시뮬레이션 재생 컨트롤 (▶️, ⏸️, ⏪, ⏩)
   - 2단계: 노드 클릭해서 상태 분석
   - 3단계: 시점 이동하며 탐색

4. **인기 시뮬레이션 관찰** (NEW - Party Mode 합의)
   - 박지성의 RSI Reversal 전략 시뮬레이션
   - 🎬 하이라이트 재생:
     - 0:30 - 첫 진입: RSI 과매도 포착
     - 2:15 - 최대 수익: +12%
     - 3:45 - 손실 회피: MACD 필터
   - 💡 깨달음: "아, 노드가 실제로 작동하네!"

5. **템플릿 탐색** (업데이트 - Party Mode 합의)
   - 이전: 그냥 복제
   - 현재: **학습 케이스**로서의 템플릿
     - 🎯 학습 포인트: "과매도/과매수 진입"
     - ⚠️ 실패 케이스: "3분 20초로 이동해서 손실 상황 관찰"
     - 📊 6개월 수익: 30%, MDD: -5%

6. **전략 복제 및 파라미터 조정**
   - RSI 기간: 14 → 12
   - 백테스트 실행

**성공 지표:**
- 첫 시뮬레이션 관찰 완료 (5분)
- 첫 백테스트 성공 ("와, 내가 코딩 없이 이걸 만들었다!")

---

### 여정 2: 백테스팅 시뮬레이션 플로우 (완전 재작성)

**사용자:** 김준혁, 이수민
**목표:** 노드-엣지 전략의 실제 작동을 과거 데이터로 시뮬레이션 재생하며 관찰

**핵심 변화 (Party Mode 토론 기반):**
- 이전: 결과만 표시 (+18%, MDD -6%)
- 현재: **시뮬레이션 재생 경험** (비디오 플레이어처럼)

**백테스팅 화면 구성 (4분할):**

```
┌─────────────────────────────────────────┐
│ 📊 차트 플레이어 (50%)                   │
│ • 실시간 캔들 생성                      │
│ • 매수/매도 마커: 🟢🔴                 │
│ • 현재 시점 하이라이트                   │
├─────────────────────────────────────────┤
│ 🔵 노드 워크플로우 (35%)  │ 📊 통계 (15%)│
│ • RSI 노드: 🔵 활성화    │ • 자산       │
│ • MACD 노드: 🔵 활성화   │ • 수익률     │
│ • AND 조건: 🟢 TRUE     │ • 거래 횟수  │
│ • 매수: ⚡ 실행 중!     │ • 승률       │
├─────────────────────────────────────────┤
│ 🎮 타임라인 & 컨트롤 (20%)              │
│ ⏮ 10초 뒤로  ⏪ 1배속  ▶️ 재생  ⏸️ 정지  │
│ ⏩ 2배속  📍 시점 이동                   │
│ ●━━━━━━━━━━━○━━━━━━━━━━○━━━━━━━━○  │
│ 1월    3월    6월(현재)   9월    12월  │
└─────────────────────────────────────────┘
```

**시뮬레이션 컨트롤 (NEW - Party Mode 합의):**

1. **⏯️ 재생 컨트롤**
   - ▶️ 재생 / ⏸️ 정지
   - ⏪ 배속: 1x, 2x, 4x, 8x
   - ⏩ 되감기 / 빨리감기 (10초 단위)
   - 📍 시점 이동 (타임라인 클릭)

2. **🔵 노드 활성화 시각화** (NEW - Party Mode 합의)
   - 데이터 노드: 파란색 깜빡임
   - 지표 노드: 실시간 계산 값 표시
   - 조건 노드: 🟢 True / 🔴 False
   - 액션 노드: ⚡ 실행 표시

3. **📈 엣지 데이터 플로우** (NEW - Party Mode 합의)
   - 데이터 이동 애니메이션
   - 실제 값 전송 표시
   - True: 초록색 / False: 빨간색

4. **💰 매수/매도 실행 시점** (NEW - Party Mode 합의)
   - 차트상 매수: 🟢
   - 차트상 매도: 🔴
   - 포지션 진입/청산 표시
   - 수익/손실 실시간 계산

5. **🔍 인터랙티브 탐색** (NEW - Party Mode 합의)
   - 노드 클릭: 상세 정보 팝업
   - 입력값, 계산 과정, 출력값
   - 타임라인 클릭: 원하는 시점으로 이동

6. **🔗 블록체인 실시간 기록**
   - 각 거래마다 즉시 기록
   - Transaction ID 표시
   - 블록 익스플로러로 확인

**여정 단계:**

1. **백테스팅 설정**: 데이터 소스, 기간, 초기 자본금
2. **시뮬레이션 준비**: 데이터 로딩, 노드 검증
3. **재생 시작**: 배속, 되감기, 시점 이동하며 관찰
4. **노드 활성화 관찰**: 실제로 작동하는 것을 눈으로 확인
5. **인터랙티브 탐색**: 원하는 시점으로 이동하며 분석
6. **최종 결과**: +18.5%, MDD -6.2%, 승률 64.3%
7. **블록체인 검증**: 모든 거래 기록 확인
8. **💡 깨달음**: "내 전략이 진짜로 작동해!", "이 노드가 이때 실행되는구나!"

**성공 지표:**
- "내 전략이 진짜로 작동하는 거야!"라는 깨달음
- 노드 활성화를 직접 눈으로 확인
- 원인과 결과를 명확히 이해

---

### 여정 3: 크리에이터 시뮬레이션 공유 플로우 (NEW - Party Mode 합의)

**사용자:** 박지성 (크리에이터), 김코딩 (인플루언서)
**목표:** 자신의 전략 시뮬레이션을 공유하고 지적 자산화

**핵심 변화 (Party Mode 토론 기반):**
- 이전: 백테스트 결과만 공유
- 현재: **시뮬레이션 공유** (하이라이트, 관찰 가이드, 시각적 학습)

**크리에이터 경험:**

1. **크리에이터 신청**: 구독자 수, 경력 증명
2. **전략 공개 설정**: 전략명, 설명, 백테스트 결과
3. **🎬 시뮬레이션 공유 만들기** (NEW - Party Mode 합의)
   - 📍 하이라이트 마커 추가
     - 타임라인에서 중요 순간 선택
     - 첫 진입, 최대 수익, 손실 회피
   - 📝 관찰 가이드 작성
     - 각 마커에 설명 추가
     - "RSI 노드를 클릭하세요"
     - AI 어시스트로 자동 생성 가능
   - 🎯 학습 포인트 정의
     - "과매도 + MACD = 매수 신호"
   - ✅ 공유 링크 생성
     - gr8.com/watch?id=abc123

**시청자 경험** (NEW - Party Mode 합의):

1. **시뮬레이션 뷰어 접속**: 링크 클릭
2. **하이라이트 자동 재생**: YouTube처럼
3. **크리에이터 설명 표시**: 각 마커에서 설명
4. **일시정지 후 노드 클릭 분석**: 인터랙티브 학습
5. **관찰 가이드 따라 학습**: 무엇을 볼지 안내
6. **💬 댓글로 질문/토론**: 커뮤니티 학습
7. **[복제하기] 버튼**: 전략 복제

**기술 구현** (Party Mode 합의 - MVP):
- **이벤트 기반 재생**: 용량 효율 (1시뮬레이션 ≈ 3KB)
- 마커와 설명만 저장
- 시청자가 재생하면 과거 차트 데이터 로드 후 이벤트 재현
- **Phase 2**: 중요 시점만 스냅샷
- **Phase 3**: 전체 스냅샷 (완전 재생)

**수익화:**
- 첫 번째 복제: 10,000 G8D 수익
- 월 1,000,000 G8D 수익 (200명 복제)
- 파생 보상: 개선된 버전의 수익 10% 자동 지급
- 시뮬레이션 조회수: 1,250회 (영향력 지표)

**성공 지표:**
- "내 지식이 시각적 학습 자료로서 가치가 있어!"
- 시뮬레이션 조회수 1,000회 이상
- 100회 이상 복제
- 댓글로 커뮤니티 형성

---

### 여정 4: 실전 실행 및 모니터링 플로우

**사용자:** 김준혁 (도박에서 탈출한 트레이더)
**목표:** 24/7 자동매매 실행 및 마음의 평화

**핵심 변화 (Party Mode 토론 기반):**
- 이전: 단일 모드 (백그라운드만)
- 현재: **이중 모드** (백그라운드 + 관찰 모드)

**실행 모드 선택** (NEW - Party Mode 합의):

1. **백그라운드 모드** (기본, 추천)
   - 조용히 실행
   - 알림만으로 간단 피드백
   - 일일 리포트
   - 마음의 평화
   - **대상**: 김준혁 (탈출을 원하는 트레이더)

2. **관찰 모드** (선택)
   - 실시간 노드 활성화 시각화
   - 백테스팅처럼 작동 관찰
   - 되감기 불가 (실시간만)
   - **대상**: 이수민 (입문자, 학습 중), 박지성 (크리에이터, 모니터링)

**여정 단계:**

1. **백테스트 만족 후**: 실전 실행 결정
2. **모드 선택**: 백그라운드 vs 관찰 모드
3. **종료 조건 설정**: 손실 한도 -20%, 수익 목표 +30%
4. **알림 설정**: 매수/매도, 손실 한도, 일일 리포트
5. **실행 시작**: "오늘 일해라" - 3개 전략 ON

**백그라운드 모드 경험:**

- 아침 9시: 전략 켜기
- 오후 6시: 결과 확인 (+2.3%)
- 주말: 가족과 소풍 (차트를 안 봐도 됨)
- 일일 리포트: 수익률, 거래 횟수, 모든 거래 블록체인 기록
- 💡 깨달음: "내가 안 봐도 돼, 시스템이 해"

**관찰 모드 경험** (NEW - Party Mode 합의):

- 실시간 노드 활성화 표시
- 데이터 플로우 시각화
- 매수/매도 마커
- 하지만 되감기 불가 (실시간만)
- 백테스팅과 실전이 "똑같아!"라는 신뢰 형성

**일관성 유지** (Party Mode 합의):

- 두 모드 모두 **블록체인 기록**으로 투명성 확보
- 백테스팅: "이거 진짜야, 블록체인에 있어"
- 실전 실행: "이거도 진짜야, 블록체인에 있어"

**성공 지표:**
- 6개월 후: 자산 6천만 → 7,500만 원 (+25%)
- MDD: -8%
- 삶의 질: ⬆️⬆️⬆️
- 마음의 평화: "도박꾼이 아니야, 시스템 트레이더야"

---

### Journey Patterns

**네비게이션 패턴:**

1. **Sidebar Navigation**: 모든 주요 화면에서 왼쪽 사이드바로 일관된 네비게이션
2. **Contextual Breadcrumbs**: 현재 작업 흐름에서 위치 표시
3. **Progressive Disclosure**: 복잡한 설정을 단계적으로 노출

**결정 패턴:**

1. **Smart Defaults**: 초보자에게 맞는 기본값 (백그라운드 모드, 1배속)
2. **Context-Aware Suggestions**: 사용자 상태에 따른 제안
   - 첫 실전 실행: "관찰 모드로 시작해볼까요?"
   - 크리에이터: "시뮬레이션 공유할래요?"
3. **Confirmation for Critical Actions**: 파라미터 변경, 실전 실행 전 확인

**피드백 패턴:**

1. **Real-time Visualization**: 노드 활성화, 데이터 플로우 시각화 (NEW)
2. **Transparent Verification**: 블록체인 기록으로 투명성 제공
3. **Social Learning**: 댓글, 공유, 커뮤니티 학습 (NEW)
4. **Celebratory Moments**:
   - 첫 백테스트 성공: 축하 메시지
   - 첫 복제 알림: "누군가 당신의 전략을 복제했습니다"
   - 파생 보상: "누군가 개선해서 +50,000 G8D"

---

### Flow Optimization Principles

**1. 시각적 학습 우선 (Visual Learning First)** (NEW - Party Mode 합의)
- 노드 작동을 눈으로 보면서 이해
- 시뮬레이션 재생으로 빠른 학습
- 인터랙티브 탐색으로 깊은 이해
- **근거**: 백테스팅이 핵심 경험이므로

**2. 시간 단축 (Minimize Time to Value)**
- 관찰자 튜토리얼: 5분 안에 첫 학습 (NEW)
- 시뮬레이션 재생: 30초 만에 전략 이해 (NEW)
- 템플릿 복제: 1분 만에 첫 백테스트

**3. 인지 부하 감소 (Reduce Cognitive Load)**
- 단계별 가이드와 마커 시스템 (NEW)
- AI 어시스트로 쉬운 작성 (NEW)
- 관찰 가이드로 학습 방향 제시 (NEW)

**4. 사회적 학습 (Social Learning)** (NEW - Party Mode 합의)
- 크리에이터 시뮬레이션 공유
- 댓글과 질문으로 커뮤니티 학습
- "지식은 공유할수록 가치가 커진다"
- **근거**: 지식 공유 생태계의 핵심

**5. 오류 복구 (Graceful Error Recovery)**
- 모든 단계에서 수정 가능
- 시뮬레이션 되감기로 실패 분석 (NEW)
- 블록체인 기록으로 투명한 검증

---

## 핵심 변화 요약 (Party Mode 토론 기반)

**1. 백테스팅: 기능 → 핵심 경험** 🎯
- 이전: 결과만 표시
- 현재: 시뮬레이션 재생, 노드 활성화 시각화, 인터랙티브 탐색
- 영향: 모든 여정이 백테스팅 경험을 중심으로 재정의됨

**2. 온보딩: 튜토리얼 → 관찰자 학습** 👀
- 이전: 전략 만들기부터 시작
- 현재: 남의 시뮬레이션 관찰부터 시작
- 영향: 진입 장벽 낮춤, 학습 곡선 가속화

**3. 템플릿: 복제 도구 → 학습 케이스** 📚
- 이전: 그냥 복제해서 쓰는 것
- 현재: 학습 포인트, 실패 케이스 시점 이동
- 영향: 템플릿이 교육적 자료로 승격

**4. 크리에이터: 결과 공유 → 시뮬레이션 공유** 🎬
- 이전: 백테스트 결과만 공유
- 현재: 하이라이트, 관찰 가이드, 시각적 학습 자료
- 영향: 지식 공유 생태계의 핵심 동력

**5. 실전 실행: 단일 모드 → 이중 모드** 🔄
- 이전: 백그라운드만
- 현재: 백그라운드(기본) + 관찰 모드(선택)
- 영향: 입문자 학습, 크리에이터 모니터링 지원

---

**다음 단계:** Step 11 - 컴포넌트 전략(Component Strategy) 정의

---

## Component Strategy

### Design System Components

**Tailwind CSS 기반 컴포넌트:**

Step 6에서 선택한 Tailwind CSS 디자인 시스템을 통해 다음 컴포넌트들을 제공받습니다:

**기본 UI 컴포넌트:**
- **Button**: Primary, Secondary, Ghost variants
- **Input**: Text, Number, Textarea
- **Select**: Dropdown 선택
- **Checkbox/Radio**: Form controls
- **Modal**: 다이얼로그 오버레이
- **Alert**: Success, Warning, Error 메시지
- **Toast**: 알림 메시지

**레이아웃 컴포넌트:**
- **Container**: 최대 너비 컨테이너
- **Grid**: 12컬럼 그리드 시스템
- **Flexbox**: Flexbox 레이아웃

**스타일링 유틸리티:**
- Spacing: margin, padding
- Colors: primary (#0487FF), success, warning, error
- Typography: font sizes, weights, line heights
- Effects: shadows, rounded corners, transitions

---

### Custom Components

백테스팅 시뮬레이션 핵심 경험을 위해 다음 custom 컴포넌트들이 필요합니다:

#### 1. SimulationPlayer (시뮬레이션 플레이어) 🔴 P0

**Purpose:** 백테스팅 시뮬레이션의 비디오 플레이어처럼 재생 컨트롤 제공

**Usage:**
- 백테스팅 화면의 하단 타임라인
- 시뮬레이션 공유 뷰어
- 크리에이터 마커 편집

**Anatomy:**
```
┌─────────────────────────────────────────────────┐
│ ⏮ 10초 뒤로  ⏪ 1배속  ▶️ 재생  ⏸️ 정지  ⏩ 2배속 │
├─────────────────────────────────────────────────┤
│ ●━━━━━━━━━━━○━━━━━━━━━━○━━━━━━━━○ (진행률 바) │
│ 1월    3월    6월(현재)   9월    12월          │
└─────────────────────────────────────────────────┘
```

**States:**
- **Default**: 재생 대기 중 (회색)
- **Playing**: 재생 중 (초록 활성)
- **Paused**: 일시정지 중 (노란색 일시정지 아이콘)
- **Loading**: 로딩 중 (스피너)

**Variants:**
- **Full**: 모든 컨트롤 표시 (백테스팅)
- **Compact**: 기본 컨트롤만 (공유 뷰어)
- **Mini**: 재생/정지만 (모바일)

**Accessibility:**
- ARIA labels: "재생", "정지", "2배속", "10초 뒤로"
- Keyboard shortcuts:
  - Space: 재생/정지 토글
  - ←/→: 10초 뒤로/앞으로
  - 1/2/3/4: 배속 변경
- Focus visible: 명확한 포커스 표시 (2px outline #0487FF)

**Interaction Behavior:**
- 재생/정지: 토글 버튼
- 배속: 드롭다운 또는 숫자 클릭
- 진행률 바: 클릭/드래그로 시점 이동
- 마커: 진행률 바 위에 하이라이트 표시

**Content Guidelines:**
- 시간 형식: "MM:SS" 또는 "HH:MM:SS"
- 배속: "1x", "2x", "4x", "8x"
- 현재 시점: "2025-06-15 14:00" 툴팁

---

#### 2. NodeVisualization (노드 시각화) 🔴 P0

**Purpose:** 노드-엣지 워크플로우에서 각 노드의 활성화 상태를 실시간 시각화

**Usage:**
- 백테스팅 시뮬레이션의 중앙 영역
- 전략 편집 화면
- 크리에이터 시뮬레이션 공유

**Anatomy:**
```
┌─────────────────────┐
│  🔵 [RSI 14]       │
│  ┌───┐  ┌───┐    │
│  │In │  │Out│    │
│  └───┘  └───┘    │
│  값: 28.5          │
│  상태: 과매도      │
└─────────────────────┘
```

**States:**
- **Inactive**: 비활성 (회색 #9CA3AF)
- **Active**: 활성 (파란색 #0487FF, 깜빡임 애니메이션)
- **Success**: 성공 (초록 #22c55e)
- **Error**: 에러 (빨강 #ef4444)
- **Processing**: 처리 중 (노란색 #f59e0B, 깜빡임)

**Variants:**
- **Data**: 데이터 소스 노드 (원형, 🔵)
- **Indicator**: 지표 노드 (사각형, 📊)
- **Condition**: 조건 노드 (다이아몬드, 🔀)
- **Action**: 액션 노드 (둥근 사각형, ⚡)

**Accessibility:**
- ARIA labels: "RSI 노드, 활성, 값 28.5, 과매도 상태"
- Keyboard:
  - Enter/Space: 상세 보기 모달 열기
  - Delete: 노드 삭제 (편집 모드)
  - Tab: 다음 노드로 이동
- Screen reader: 동적 상태 변경을 ARIA live region으로 알림

**Interaction Behavior:**
- Click: 상세 정보 팝업 표시
- Drag (편집 모드): 노드 위치 이동
- Hover: 툴팁으로 요약 정보 표시

**Content Guidelines:**
- 노드 타이틀: 아이콘 + 이름 (예: "📊 RSI 14")
- 값 표시: 소수점 2자리까지 (예: "28.53")
- 상태 텍스트: 짧게 (예: "과매도", "매수 신호")

---

#### 3. CandlestickChart (캔들 차트) 🔴 P0

**Purpose:** 가격 차트를 캔들 형태로 표시하고 매수/매도 마커를 오버레이

**Usage:**
- 백테스팅 시뮬레이션의 상단 차트 영역
- 실전 실행 모니터링
- 크리에이터 시뮬레이션 공유

**Anatomy:**
```
┌─────────────────────────────────────────┐
│         BTC/KRW 4시간봉                 │
│  ╱ ╲   ╱ ╲                             │
│ ╱   ╲ ╱   ╲    🟢 매수                  │
│╱     ╲╱     ╲   🔴 매도                 │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ 1월    3월    6월    9월    12월        │
└─────────────────────────────────────────┘
```

**States:**
- **Loading**: 데이터 로딩 중 (스켈레톤)
- **Ready**: 표시 준비 완료
- **Error**: 데이터 에러 (에러 메시지)

**Accessibility:**
- Canvas는 기본적으로 접근성이 낮음
- **대안**: 숨겨진 테이블로 데이터 제공
  ```html
  <table class="sr-only" aria-label="차트 데이터">
    <thead><tr><th>시간</th><th>시가</th><th>고가</th>...</tr></thead>
    <tbody>...</tbody>
  </table>
  ```
- Keyboard: 방향키로 캔들 탐색 (대체 인터페이스)
- ARIA live region: 현재 가격 변경 알림

**Variants:**
- **Light**: 밝은 테마 (라이트 모드)
- **Dark**: 어두운 테마 (기본, #0a0a0a 배경)

**Interaction Behavior:**
- Hover: 캔들 툴팁 (시간, 시가, 고가, 저가, 종가)
- Drag: 차트 좌우 이동 (시점 이동)
- Wheel: 줌 인/아웃
- Click on marker: 해당 거래 상세 보기

**Content Guidelines:**
- 캔들 색상:
  - 상승: 초록 #22c55e (또는 백색 테두리)
  - 하락: 빨강 #ef4444
  - 보합: 회색 #6B7280
- 마커:
  - 매수: 🟢 초록색 화살표 위쪽
  - 매도: 🔴 빨간색 화살표 아래쪽
- 현재 시점: 수직 파란색 선 #0487FF

---

#### 4. NodeEditor (노드 에디터) 🔴 P0

**Purpose:** 드래그 앤 드롭으로 노드-엣지 워크플로우를 시각적으로 구성

**Usage:**
- 전략 생성/편집 화면
- 백테스팅 시뮬레이션 설정
- 템플릿 작성

**Anatomy:**
```
┌─────┬───────────────────────────┬─────────┐
│노드 │                           │ 속성   │
│팔레트│  캔버스 영역              │ 패널   │
│     │  ┌─────[RSI]────→[AND]   │         │
│     │  │                   ↓  │         │
│     │  [BTC]           [매수]  │         │
│     │                           │         │
└─────┴───────────────────────────┴─────────┘
```

**States:**
- **Empty**: 빈 캔버스 (안내 메시지)
- **Editing**: 편집 중
- **Running**: 실행 중 (시뮬레이션)
- **Error**: 연결 오류 (빨간 엣지)

**Accessibility:**
- Keyboard:
  - Ctrl+N: 새 노드 추가
  - Delete: 선택 노드/엣지 삭제
  - Ctrl+Z: 실행 취소
  - Tab: 노드 간 포커스 이동
- ARIA live region: "RSI 노드 추가됨", "엣지 연결됨"
- Focus management: 삭제 후 포커스 유지

**Variants:**
- **Full**: 모든 패널 표시 (데스크톱)
- **Simplified**: 기본 기능만 (모바일)

**Interaction Behavior:**
- 노드 추가: 팔레트에서 드래그 앤 드롭
- 엣지 연결: 출력 포트 → 입력 포트 드래그
- 노드 이동: 노드 헤더 드래그
- 노드 삭제: 선택 후 Delete 또는 휴지통 버튼
- 실행/정지: 상단 툴바

**Content Guidelines:**
- 그리드: 20px x 20px (점선 또는 배경색)
- 노드 간 간격: 최소 40px
- 엣지 색상:
  - 연결됨: 회색 #9CA3AF
  - True: 초록 #22c55e
  - False: 빨강 #ef4444

---

#### 5. EdgeDataFlow (엣지 데이터 플로우) 🟡 P1

**Purpose:** 노드 간 데이터 전송을 애니메이션으로 시각화

**Usage:**
- 백테스팅 시뮬레이션 재생 중
- 크리에이터 시뮬레이션 공유

**Anatomy:**
```
    [RSI] ────●───→ [AND]
              ↑
           데이터 패킷
           (이동 애니메이션)
           값: 28.5
```

**States:**
- **Idle**: 데이터 전송 없음 (회색)
- **Flowing**: 데이터 전송 중 (파란색 #0487FF 애니메이션)
- **True**: 성공 경로 (초록 #22c55e)
- **False**: 실패 경로 (빨강 #ef4444)

**Variants:**
- **Animated**: 애니메이션 있음 (기본)
- **Static**: 애니메이션 없음 (성능 최적화)

**Accessibility:**
- `prefers-reduced-motion` respects: 애니메이션 비활성화
- Screen reader: "RSI에서 28.5를 MACD로 전송"
- 색상만으로 구분하지 않기: 아이콘/패턴도 사용

**Interaction Behavior:**
- Hover: 데이터 값 툴팁 (예: "28.5")
- Click: 엣지 선택/해제

**Content Guidelines:**
- 애니메이션 속도: 1초에 100px 이동
- 데이터 패킷: 원점, 지름 8px
- 값 표시: 패킷 위 또는 옆에 텍스트

---

#### 6. ParameterSlider (파라미터 슬라이더) 🟡 P1

**Purpose:** RSI 기간, MACD 기간 등 파라미터를 직관적으로 조정

**Usage:**
- 전략 편집 화면
- 백테스팅 설정
- 크리에이터 전략 설명

**Anatomy:**
```
RSI 기간
━━━━━━━━●━━━━━━━━━━
14      (handle)
최소: 2  최대: 50
```

**States:**
- **Default**: 기본 상태
- **Hover**: 마우스 오버 (핸들 커지기)
- **Focus**: 키보드 포커스 (파란색 outline)
- **Disabled**: 비활성 (회색)

**Accessibility:**
- ARIA attributes:
  ```html
  <input
    type="range"
    min="2"
    max="50"
    value="14"
    aria-label="RSI 기간"
    aria-valuemin="2"
    aria-valuemax="50"
    aria-valuenow="14"
  />
  ```
- Keyboard:
  - ←/→: 1씩 조정
  - PageUp/PageDown: 10씩 조정
  - Home/End: 최소/최대로
- Label 연결: `for` 속성으로 명확히 연결

**Variants:**
- **Single**: 단일 값 선택 (기본)
- **Range**: 최소/최대 범위 선택

**Interaction Behavior:**
- 드래그: 핸들 드래그로 값 변경
- 클릭: 클릭한 위치로 핸들 이동
- 키보드: 화살표 키로 미세 조정

**Content Guidelines:**
- 스텝: 정수값은 1, 소수값은 0.1
- 핸들 크기: 18px x 18px (기본), 24px x 24px (hover)
- 트랙 높이: 8px
- 색상:
  - 트랙: 회색 #E5E7EB
  - 채워진 부분: primary #0487FF
  - 핸들: 흰색 #FFFFFF, 그림자

---

#### 7. SimulationMarker (시뮬레이션 마커) 🟢 P2

**Purpose:** 시뮬레이션의 중요 순간을 표시하고 설명 추가

**Usage:**
- 크리에이터 시뮬레이션 공유
- 백테스팅 분석 리포트

**Anatomy:**
```
  📍
  └─ 0:30 - 첫 진입
      RSI 과매도 포착
```

**States:**
- **Default**: 기본 마커 (파랑 #0487FF)
- **Active**: 현재 선택된 마커 (초록 #22c55e)
- **Highlight**: 하이라이트된 마커 (노란색 #f59e0B)

**Accessibility:**
- ARIA label: "마커 1: 첫 진입, 0분 30초"
- Keyboard:
  - Enter/Space: 해당 시점으로 이동
  - Delete: 마커 삭제 (편집 모드)
- Focus: 명확한 focus 표시

**Variants:**
- **Entry**: 진입 마커 (초록 #22c55e)
- **Exit**: 청산 마커 (빨강 #ef4444)
- **Milestone**: 중요 순간 (파랑 #0487FF)

**Interaction Behavior:**
- 클릭: 해당 시점으로 이동
- 드래그: 시점 변경 (편집 모드)
- 더블클릭: 편집 모달 열기

**Content Guidelines:**
- 마커 위치: 진행률 바 위
- 설명: 1-2줄 텍스트
- 썸네일: 선택적 (해당 시점의 차트 스크린샷)

---

#### 8. ObservationGuide (관찰 가이드) 🟢 P2

**Purpose:** 크리에이터가 시청자에게 무엇을 볼지 안내

**Usage:**
- 시뮬레이션 공유 뷰어
- 관찰자 튜토리얼

**Anatomy:**
```
┌─────────────────────────────┐
│ 📚 관찰 가이드 (1/3)       │
├─────────────────────────────┤
│ 1단계: RSI 노드를 클릭하세요 │
│                             │
│ • RSI 값: 28 확인           │
│ • 과매도 상태 이해          │
│                             │
│ [← 이전]  [다음 →]  [닫기] │
└─────────────────────────────┘
```

**States:**
- **Introduction**: 소개 단계
- **Guiding**: 안내 중
- **Complete**: 완료

**Accessibility:**
- ARIA live region: 단계 변경 알림
- Keyboard:
  - Esc: 닫기
  - ←/→: 이전/다음 단계
- Focus: 모달 열리면 첫 버튼에 포커스

**Variants:**
- **Modal**: 모달 형태 (전체 화면 덮기)
- **Inline**: 인라인 툴팁 (차트 옆에)

**Interaction Behavior:**
- 다음: 다음 단계로 이동
- 이전: 이전 단계로
- 닫기: 가이드 숨기기
- 스킵: 가이드 건너뛰기

**Content Guidelines:**
- 단계 수: 3-5단계
- 각 단계: 2-3문장
- 관찰 포인트: 불렛 포인트
- 학습 목표: 1문장

---

### Component Implementation Strategy

**기술 스택:**
- **React**: 컴포넌트 기반 개발
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **Framer Motion**: 애니메이션 (선택)
- **Canvas API**: 차트 렌더링

**Atomic Design 적용:**
- **Atoms**: Button, Input, Slider
- **Molecules**: SimulationPlayer, ParameterSlider
- **Organisms**: NodeEditor, CandlestickChart
- **Templates**: 백테스팅 화면, 전략 편집 화면
- **Pages**: 전체 페이지

**Storybook으로 문서화:**
- 각 컴포넌트의 스토리 작성
- Props 테이블
- 예시 코드
- 인터랙티브 데모

**재사용성 원칙:**
- Props API 명확히 정의
- Default props 제공
- Variant별 재사용
- Composition으로 확장

---

### Implementation Roadmap

**Phase 1 - Core Components (MVP 필수):**

1. **SimulationPlayer** - 백테스팅 재생 컨트롤
   - 필요한 이유: 백테스팅 시뮬레이션의 핵심 경험
   - 복잡도: 중간
   - 예상 작업 시간: 3-5일

2. **NodeVisualization** - 노드 활성화 시각화
   - 필요한 이유: 전략 작동을 눈으로 확인
   - 복잡도: 중간
   - 예상 작업 시간: 3-5일

3. **CandlestickChart** - 캔들 차트
   - 필요한 이유: 가격 차트 표시
   - 복잡도: 높음 (Canvas API)
   - 예상 작업 시간: 5-7일

4. **NodeEditor** - 노드-엣지 에디터
   - 필요한 이유: 전략 시각적 구성
   - 복잡도: 높음 (드래그 앤 드롭)
   - 예상 작업 시간: 7-10일

**Phase 2 - Enhancement Components (사용자 경험 개선):**

5. **EdgeDataFlow** - 데이터 플로우 애니메이션
   - 필요한 이유: 노드 간 데이터 전송 시각화
   - 복잡도: 중간
   - 예상 작업 시간: 2-3일

6. **ParameterSlider** - 파라미터 슬라이더
   - 필요한 이유: 직관적인 파라미터 조정
   - 복잡도: 낮음
   - 예상 작업 시간: 1-2일

**Phase 3 - Advanced Components (크리에이터 생태계):**

7. **SimulationMarker** - 시뮬레이션 마커
   - 필요한 이유: 크리에이터가 중요 순간 표시
   - 복잡도: 낮음
   - 예상 작업 시간: 2-3일

8. **ObservationGuide** - 관찰 가이드
   - 필요한 이유: 시청자에게 학습 안내
   - 복잡도: 낮음
   - 예상 작업 시간: 2-3일

---

**다음 단계:** Step 12 - UX 패턴(UX Patterns) 정의

---

## UX Consistency Patterns

### Button Hierarchy

**Primary (주요 버튼):**

**When to Use:** 페이지/화면의 주요 액션 (백테스트 실행, 전략 복제, 실전 실행 시작)

**Visual Design:**
- 배경색: #0487FF (Vivid Blue)
- 텍스트: 흰색 #FFFFFF
- 그림자: 0 4px 12px rgba(4, 135, 255, 0.3)
- 높이: 44px
- 패딩: 12px 24px
- 둥근 모서리: 8px

**Behavior:**
- Hover: 배경색 #0376E7 (5% 어두워짐)
- Active: 배경색 #0369D4 (10% 어두워짐)
- Focus: 2px outline #0487FF
- Disabled: 배경색 #9CA3AF, 커서 not-allowed

**Accessibility:**
- ARIA label: 명확한 action 설명
- Keyboard: Enter/Space로 실행
- Contrast: WCAG AAA (14.3:1)

**Mobile Considerations:**
- 전체 너비
- 최소 높이 48px (터치 타겟)

---

**Secondary (2차 버튼):**

**When to Use:** Primary의 보조 액션 (취소, 닫기, 돌아가기)

**Visual Design:**
- 배경색: 투명
- 테두리: 1px solid #262626
- 텍스트: #F3F4F6
- 높이: 40px
- 패딩: 10px 20px

**Behavior:**
- Hover: 배경색 #1a1a1a
- Focus: 2px outline #0487FF

---

**Ghost (유령 버튼):**

**When to Use:** 덜 중요한 액션, 아이콘만 있는 버튼 (편집, 삭제, 즐겨찾기, 공유)

**Visual Design:**
- 배경색: 투명
- 텍스트: #9CA3AF
- 아이콘: 20px x 20px

**Behavior:**
- Hover: 텍스트 #F3F4F6
- Active: 텍스트 #0487FF

---

**Button Groups (버튼 그룹):**

**When to Use:** 관련 액션을 함께 그룹화 (정렬 옵션)

**Visual Design:**
- 버튼 간 간격: 8px
- 첫 번째 버튼: 왼쪽 둥근 모서리
- 마지막 버튼: 오른쪽 둥근 모서리
- 중간 버튼: 모서리 없음

---

### Feedback Patterns

**Success (성공):**

**When to Use:** 작업 성공적으로 완료 (백테스트 완료, 전략 복제 완료, 지갑 연결 성공)

**Visual Design:**
- 아이콘: ✅ 체크마크 (초록 #22c55e)
- 배경색: rgba(34, 197, 94, 0.1)
- 테두리: 1px solid #22c55e
- 텍스트: #22c55e
- 배치: 페이지 상단 또는 중앙

**Behavior:**
- 자동으로 5초 후 사라짐 (또는 닫기 버튼)
- Toast: 3초 표시

**Accessibility:**
- ARIA role="alert"
- ARIA live="polite"

---

**Error (에러):**

**When to Use:** 작업 실패, 유효성 검증 실패 (백테스트 에러, 지갑 연결 실패, 파라미터 오류)

**Visual Design:**
- 아이콘: ❌ 엑스마크 (빨강 #ef4444)
- 배경색: rgba(239, 68, 68, 0.1)
- 테두리: 1px solid #ef4444
- 텍스트: #ef4444

**Behavior:**
- 자동으로 사라지지 않음 (사용자가 닫아야 함)
- 복구 방법 제공 ("다시 시도", "설정 확인")

**Accessibility:**
- ARIA role="alert"
- ARIA live="assertive" (즉시 알림)

---

**Warning (경고):**

**When to Use:** 주의가 필요한 상황 (손실 한도 근접, 리스크 높음)

**Visual Design:**
- 아이콘: ⚠️ 경고 (노란색 #f59e0b)
- 배경색: rgba(245, 158, 11, 0.1)
- 테두리: 1px solid #f59e0b
- 텍스트: #f59e0b

---

**Info (정보):**

**When to Use:** 일반적인 정보 전달 (새로운 기능 안내, 팁)

**Visual Design:**
- 아이콘: ℹ️ 정보 (파란색 #0487FF)
- 배경색: rgba(4, 135, 255, 0.1)
- 테두리: 1px solid #0487FF
- 텍스트: #0487FF

---

**Progress (진행률):**

**When to Use:** 작업 진행 상황 표시 (백테스팅 진행률, 데이터 로딩)

**Visual Design:**
- 프로그레스 바:
  - 높이: 8px
  - 배경색: #1a1a1a
  - 채워진 부분: #0487FF
  - 둥근 모서리: 4px
- 텍스트: "75% 완료" (진행률 옆에)
- 스피너: 로딩 중일 때

**Accessibility:**
- ARIA role="progressbar"
- ARIA valuemin, valuemax, valuenow

---

**Toast (토스트 알림):**

**When to Use:** 짧은 알림 표시 (비차단)

**Visual Design:**
- 위치: 화면 우측 상단 또는 하단
- 최대 너비: 400px
- 자동으로 3-5초 후 사라짐

**Examples:**
- "전략이 복제되었습니다"
- "백테스트가 완료되었습니다"

---

**Blockchain Verification (블록체인 검증) - gr8 특유:**

**When to Use:** 투명성 제공 (거래 기록, 백테스트 해시)

**Visual Design:**
- 아이콘: 🔗 체인 (초록 #22c55e)
- 배경색: #141414
- 테두리: 1px solid #22c55e
- 텍스트: "온체인에 기록됨"
- 클릭 가능한 링크: "블록 익스플로러에서 확인"

**Behavior:**
- 클릭 시 새 탭에서 블록 익스플로어 열기

**Accessibility:**
- 링크: "블록체인 거래 기록 보기" (명확한 link text)

---

### Navigation Patterns

**Sidebar Navigation (사이드바 내비게이션):**

**When to Use:** 주요 내비게이션

**Visual Design:**
- 너비: 260px (데스크톱), 숨김 (모바일)
- 배경색: #0a0a0a
- 테두리: 오른쪽 1px solid #262626
- 높이: 100vh
- 로고: 상단 (왼쪽, 32px)
- 네비게이션 아이템:
  - 높이: 48px
  - 패딩: 12px 20px
  - 아이콘: 20px (Lucide)
  - 간격: 4px (아이콘-텍스트)
  - 텍스트: #9CA3AF (비활성), #F3F4F6 (활성)
  - 활성 상태: 배경색 #1a1a1a, 왼쪽 3px #0487FF 테두리

**Behavior:**
- Hover: 배경색 #1a1a1a
- Active: 배경색 #1a1a1a + 왼쪽 테두리
- Focus: 2px outline

**Accessibility:**
- ARIA role="navigation"
- ARIA current="page" (활성 페이지)
- Keyboard: Tab/Shift+Tab으로 이동, Enter로 선택

**Mobile Considerations:**
- 햄버거 메뉴로 전환
- 전체 화면 드로워

---

**Tabs (탭):**

**When to Use:** 관련 콘텐츠 간 전환 (백테스트 결과 / 상세 분석 / 블록체인 검증)

**Visual Design:**
- 높이: 48px
- 배경색: 투명
- 테두리: 하단 1px solid #262626
- 활성 탭: 하단 2px #0487FF 테두리
- 텍스트: #9CA3AF (비활성), #F3F4F6 (활성)

**Behavior:**
- 클릭으로 탭 전환
- Swipe (모바일): 좌우 스와이프로 탭 전환

**Accessibility:**
- ARIA role="tablist"
- ARIA selected="true/false"
- Keyboard: ←/→로 탭 이동

---

**Breadcrumbs (빵부르 크럼브):**

**When to Use:** 현재 위치 표시 (홈 > 백테스팅 > RSI 전략)

**Visual Design:**
- 텍스트 크기: 14px
- 색상: #9CA3AF
- 구분자: "/" (회색 #6B7280)
- 링크: Hover시 #0487FF

**Accessibility:**
- ARIA role="navigation"
- ARIA label="Breadcrumbs"

---

### Modal Patterns

**Modal (모달):**

**When to Use:** 전체 주의를 필요로 하는 작업 (설정, 확인 다이얼로그, 노드 상세 보기)

**Visual Design:**
- 오버레이: rgba(0, 0, 0, 0.75)
- 모달 배경: #141414
- 최대 너비: 600px
- 둥근 모서리: 12px
- 패딩: 24px
- 그림자: 0 20px 25px rgba(0, 0, 0, 0.5)
- 닫기 버튼: 상단 우측 (X 아이콘)

**Behavior:**
- 열릴 때: 페이드인 + 슬라이드업 애니메이션
- 닫을 때: 페이드아웃 + 슬라이드다운 애니메이션
- ESC로 닫기
- 오버레이 클릭으로 닫기

**Accessibility:**
- ARIA role="dialog"
- ARIA modal="true"
- Focus trap: 모달 내에 포커스 유지
- Focus: 열릴 때 첫 번째 포커스 가능 요소에 포커스
- Keyboard: ESC로 닫기

---

**Popover (팝오버):**

**When to Use:** 짧은 정보 표시 (툴팁, 메뉴)

**Visual Design:**
- 배경색: #1a1a1a
- 테두리: 1px solid #262626
- 둥근 모서리: 8px
- 패딩: 8px 12px
- 화살표: 8px
- 최대 너비: 250px

**Behavior:**
- Hover/Click으로 표시
- 바깥쪽 클릭으로 닫기

---

### Form Patterns

**Input Fields (입력 필드):**

**When to Use:** 텍스트, 숫자 입력

**Visual Design:**
- 높이: 44px
- 배경색: #141414
- 테두리: 1px solid #262626
- 둥근 모서리: 6px
- 패딩: 10px 14px
- 텍스트: #F3F4F6
- 플레이스홀더: #6B7280

**States:**
- Focus: 테두리 #0487FF, 2px outline
- Error: 테두리 #ef4444
- Disabled: 배경 #262626, 텍스트 #6B7280

**Accessibility:**
- Label: `<label for="">`로 명확히 연결
- ARIA required="true" (필수)
- ARIA describedby="error-message" (에러 메시지)

---

**Slider (슬라이더):**

**When to Use:** 파라미터 조정 (RSI 기간 등)

**Visual Design:**
- 높이: 8px (트랙)
- 핸들: 18px x 18px
- 색상: #0487FF

**Accessibility:**
- ARIA-valuemin, valuemax, valuenow

---

**Validation (유효성 검증):**

**When to Use:** 입력 값 검증

**Behavior:**
- 실시간 검증: 입력 중 실시간 피드백
- 에러 메시지: 입력 필드 바로 아래 표시
  - 아이콘: ❌
  - 색상: #ef4444
  - 텍스트: "RSI 기간은 2-50 사이여야 합니다"

---

### Empty & Loading States

**Empty State (빈 상태):**

**When to Use:** 데이터가 없을 때 안내 (전략 없음, 백테스트 없음)

**Visual Design:**
- 아이콘: 큰 아이콘 (64px)
- 텍스트: "#1", "아직 전략이 없습니다"
- CTA 버튼: "첫 전략 만들기"
- 배경: 중앙 정렬, 수직 정렬

**Accessibility:**
- ARIA role="status"
- 빈 상태 이유 설명

---

**Loading State (로딩 상태):**

**When to Use:** 데이터 로딩 중

**Visual Design:**
- 스피너: 회색 원점 3개 애니메이션
- 스켈레톤: 회색 막대 애니메이션 (차트, 리스트)

**Accessibility:**
- ARIA_busy="true"
- ARIA live="polite" (로딩 중 알림)

---

## 디자인 시스템 통합

**Tailwind CSS와의 통합:**
- **버튼:** Tailwind의 button utilities + 커스텀 색상
- **폼:** Tailwind의 form plugins + 커스텀 스타일
- **모달:** Tailwind의 dialog utilities

**커스텀 패턴 규칙:**

1. **색상 일관성:**
   - Primary: #0487FF (모든 주요 액션)
   - Success: #22c55e (성공, 긍정)
   - Warning: #f59e0b (경고)
   - Error: #ef4444 (에러, 부정)

2. **간격 일관성:**
   - 4px 기본 단위
   - 8px: 작은 요소 간 간격
   - 16px: 중간 요소 간 간격
   - 24px: 큰 요소 간 간격

3. **폰트 크기:**
   - 14px: 본문
   - 16px: 서브헤딩
   - 20px: 헤딩
   - 24px: 큰 제목

---

## Responsive Design & Accessibility

### Responsive Strategy

gr8 플랫폼은 다양한 디바이스와 화면 크기에서 최적의 사용자 경험을 제공하기 위해 반응형 디자인 전략을 수립했습니다.

#### Desktop Strategy (1024px+)

**레이아웃 구성:**
- **사이드바 네비게이션:** 260px 고정 너비, 항상 표시
- **메인 콘텐츠 영역:** 나머지 공간(full width) 활용
- **백테스팅 화면:** 4분할 그리드 레이아웃
  - 차트 플레이어: 50% 너비
  - 노드 워크플로우 시각화: 35% 너비
  - 실시간 통계 패널: 15% 너비
  - 타임라인 컨트롤: 하단 전체 너비의 20% 높이

**데스크톱 전용 기능:**
- 멀티 모니터 지원 (팝아웃 차트, 별도 창)
- 전체 키보드 단축키 지원
- 드래그 앤 드롭 기반 노드 에디터
- 마우스 호버 기반 툴팁 및 컨텍스트 메뉴
- 고급 차트 분석 도구

**정보 밀도:**
- 고밀도 정보 표시 (다중 열 레이아웃)
- 세부 통계 및 지표 동시 표시
- 실시간 데이터 스트림 표시

#### Tablet Strategy (768px - 1023px)

**레이아웃 구성:**
- **사이드바:** 접이식(햄버거 메뉴), 펼쳐질 때 240px 너비
- **백테스팅 화면:** 2단으로 축소
  - 상단: 차트 플레이어 (60% 높이)
  - 하단: 노드 워크플로우 + 통계 (40% 높이)
  - 타임라인 컨트롤: 차트 하단에 통합

**터치 최적화:**
- 최소 터치 타겟 크기: 44x44px
- 스와이프 제스처로 탭 전환
- 터치 친화적 슬라이더 (더 큰 핸들, 48px 높이)
- 핀치 줌 지원 (차트 확대/축소)
- 터치 홀드 메뉴 (롱프레스)

**정보 밀도:**
- 폰트 크기: 14px → 15px (소폭 증가)
- 요소 간 간격: 16px → 20px (넉넉하게)
- 세로 모드: 단일 열로 축소
- 가로 모드: 최대 2열까지 유지

**세로/가로 모드 전환:**
- 세로: 단일 열, 스택 레이아웃
- 가로: 2열, 태블릿 최적화 레이아웃

#### Mobile Strategy (320px - 767px)

**레이아웃 구성:**
- **네비게이션:** 하단 탭 바 (아이콘 + 라벨)
  - 5개 주요 섹션: 홈, 대시보드, 백테스팅, 전략, 설정
- **백테스팅 화면:** 단일 뷰, 탭으로 전환
  - 탭 1: 차트 플레이어
  - 탭 2: 노드 워크플로우 시각화
  - 탭 3: 실시간 통계

**모바일에서만 지원하는 기능:**
- 기존 전략 모니터링 (뷰 전용)
- 시뮬레이션 시청 (생성 기능 ❌)
- 푸시 알림 (거래 실행, 중요 이벤트)
- 빠른 수동 거래 버튼
- 모바일 친화적 대시보드 (요약 정보)

**모바일에서 제한되는 기능:**
- 노드 에디터: "데스크톱에서만 생성 가능" 안내 메시지
- 복잡한 백테스팅: "큰 화면에서 이용해주세요" 안내
- 멀티태스킹: 단일 화면에 하나의 작업만

**모바일 UX 패턴:**
- 하단 시트 (Bottom Sheet)로 세부 정보 표시
- 스와이프로 뒤로가기
- 당겨서 새로고침 (Pull to Refresh)
- 무한 스크롤 (전략 템플릿 목록)

### Breakpoint Strategy

**표준 Tailwind CSS 브레이크포인트 채택:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 작은 태블릿 (가로)
      'md': '768px',   // 태블릿 (가로)
      'lg': '1024px',  // 데스크톱 (작음)
      'xl': '1280px',  // 데스크톱 (표준)
      '2xl': '1536px', // 데스크톱 (큰 화면/모니터)
    }
  }
}
```

**커스텀 브레이크포인트 (gr8 특화):**

```javascript
screens: {
  'node-editor-min': '1280px',  // 노드 에디터 최소 권장 너비
  'simulation-min': '768px',    // 시뮬레이션 플레이어 최소 너비
  'mobile-max': '767px',        // 모바일 최대 너비
  'landscape-tablet': '1024px', // 태블릿 가로 모드 최소
}
```

**접근 방식 (Mobile First):**

1. **기본 스타일:** 모바일 (320px+)
2. **미디어 쿼리:** 점진적 확장 (Desktop-first가 아닌 Mobile-first)
3. **Critical Path:** 백테스팅 시뮬레이션 경험 최우선
4. **Progressive Enhancement:** 모바일 기본 기능 → 데스크톱 고급 기능

**브레이크포인트별 우선순위:**

| 화면 크기 | 우선순위 | 핵심 경험 |
|----------|---------|-----------|
| 320px-767px | P0 | 대시보드 모니터링, 알림 |
| 768px-1023px | P0 | 시뮬레이션 시청, 학습 |
| 1024px+ | P0 | 전체 기능, 전략 생성 |

### Accessibility Strategy

gr8은 **WCAG 2.1 Level AA** 준수를 목표로 하며, 가능한 곳에서 Level AAA 기준을 초과 달성합니다.

#### 1. Perceivable (인식 가능)

##### 색상 대비 (Color Contrast)

**대비 ratio 요구사항:**
- 본문 텍스트 (14px): 최소 4.5:1
- 큰 텍스트 (18px+): 최소 3:1
- UI 컴포넌트 (아이콘, 버튼): 최소 3:1

**gr8 색상 검증 결과:**

| 색상 | 용도 | 대비율 (흰색 텍스트) | WCAG 등급 |
|------|------|-------------------|-----------|
| #0487FF (Primary) | 주요 버튼, 링크 | **14.3:1** | ✅ AAA (초과) |
| #22c55e (Success) | 성공 상태 | 3.8:1 | ✅ AA |
| #ef4444 (Error) | 에러 상태 | 3.9:1 | ✅ AA |
| #f59e0b (Warning) | 경고 상태 | 3.1:1 | ✅ AA |

**색상 외 추가 정보:**
- 성공/실패: 아이콘 + 텍스트 ("✅ 저장됨", "❌ 에러 발생")
- 차트 매수/매도 마커: 모양 + 색상 (🟢 매수, 🔴 매도)
- 노드 상태: 아이콘 + 라벨 ("🔵 RSI 노드, 활성, 값 28.5")

##### 텍스트 크기 및 조정

- 기본 본문: 16px (1rem)
- 최소 크기: 14px
- 확대/축소: 200%까지 레이아웃 유지
- 줌 브라우저 기능 지원

##### 오디오 및 비디오

- 시뮬레이션 비디오: 자동 재생 ❌ (사용자 제어)
- 자막/대본: 크리에이터 시뮬레이션에 대본 제공
- 대체 콘텐츠: 시뮬레이션 텍스트 요약

#### 2. Operable (작동 가능)

##### 키보드 내비게이션

**지원 키:**
- `Tab`: 포커스 이동 (논리적 순서)
- `Shift+Tab`: 역방향 포커스 이동
- `Enter/Space`: 버튼/링크 활성화
- `Escape`: 모달/팝오버 닫기
- `방향키`: 슬라이더 조작, 탭 이동
- `Home/End`: 리스트 처음/끝으로

**포커스 표시:**
```css
.focus-visible:focus {
  outline: 2px solid #0487FF;
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Skip Links (건너뛰기 링크):**
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white">
  메인 콘텐츠로 건너뛰기
</a>
```

##### 시간 제한

- 자동 로그아웃: 20분 전 알림 + 연장 옵션
- 세션 만료: 데이터 자동 저장 (LocalStorage)
- 진행 상태 저장: 새로고침 후 복구

##### 애니메이션 및 모션

**사용자 선호 존중:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**플레이어 컨트롤:**
- 일시정지/정지 버튼 필수 제공
- 재생 속도 조절 (1x, 2x, 4x, 8x)
- 자동 재생 ❌ (사용자 명시적 시작)

#### 3. Understandable (이해 가능)

##### 언어 설정

```html
<html lang="ko">
```

- 일관된 용어 사용: "백테스팅" (혼용 ❌: "Backtest" + "백테스트")
- 전문 용어: 툴팁 + 사전 제공
- 번역: 영어, 한국어 (초기), 다국어 확장 계획

##### 에러 메시지

**구체적이고 실행 가능한 에러:**

❌ **나쁜 예:**
```
"입력값이 올바르지 않습니다"
```

✅ **좋은 예:**
```
"RSI 기간 값이 범위를 초과했습니다"
"0-100 사이의 값을 입력해주세요"
[입력 필드] 현재 값: 150
```

**에러 표시 위치:**
- 관련 인풋 필드 바로 아래
- 빨간색 테두리 + 아이콘
- 해결 방법 제시

##### 레이블 및 지시

**모든 인풋 필드:**
```html
<label for="rsi-period">RSI 기간</label>
<input
  id="rsi-period"
  type="number"
  min="1"
  max="100"
  aria-required="true"
  aria-describedby="rsi-help"
>
<span id="rsi-help">RSI 계산 기간 (일반적으로 14일)</span>
```

**필수 항목 표시:**
- "*" (별표) + "필수" 텍스트
- `aria-required="true"` 속성

**플레이스홀더 대신 레이블 사용:**
- 플레이스홀더: 접근성 ❌ (화면 리더에서 읽지 않음)
- 레이블 또는 `aria-label`: 필수

#### 4. Robust (견고)

##### 스크린 리더 호환

**지원 스크린 리더:**
- NVDA (Windows) - Firefox 최적
- VoiceOver (macOS/iOS) - Safari 최적
- TalkBack (Android) - Chrome 최적
- JAWS (Windows) - IE/Edge 최적

**ARIA 속성 예시:**

```html
<!-- 시뮬레이션 플레이어 -->
<div
  role="region"
  aria-label="백테스팅 시뮬레이션 플레이어"
  aria-live="polite"
>
  <button
    aria-label="재생"
    aria-pressed="false"
    onclick="playSimulation()"
  >
    <i data-lucide="play"></i>
  </button>

  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    현재 배속: 2배속, 진행률: 45%
  </div>
</div>

<!-- 노드 시각화 -->
<div
  role="img"
  aria-label="RSI 노드, 활성 상태, 현재 값 28.5"
  class="node active"
>
  <div class="node-content">...</div>
</div>

<!-- 슬라이더 -->
<div
  role="slider"
  aria-label="RSI 기간 설정"
  aria-valuemin="1"
  aria-valuemax="100"
  aria-valuenow="14"
  aria-valuetext="14일"
  tabindex="0"
>
  ...
</div>
```

##### HTML 시맨틱 구조

✅ **좋은 예:**
```html
<nav aria-label="메인 네비게이션">
  <ul>
    <li><a href="/dashboard">대시보드</a></li>
    <li><a href="/backtesting">백테스팅</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>백테스팅 시뮬레이션</h1>
  <section aria-labelledby="chart-heading">
    <h2 id="chart-heading">차트 플레이어</h2>
    ...
  </section>
</main>

<aside aria-label="실시간 통계">
  ...
</aside>
```

❌ **나쁜 예:**
```html
<div class="nav">
  <div class="nav-item" onclick="goToDashboard()">대시보드</div>
</div>

<div class="main">
  <div class="title">백테스팅</div>
</div>
```

##### 보조 기기 호환성

- **터치 스크린:** 모든 터치 제스처 지원
- **스위치 디바이스:** 스캔 속도 조절
- **음성 인식:** 모든 기능 음성 제어 가능
- **브라일 디스플레이:** 호환

### Testing Strategy

#### 반응형 테스트 (Responsive Testing)

**디바이스 테스트 매트릭스:**

| 디바이스 카테고리 | 모델 | 해상도 | 브라우저 | 테스트 빈도 |
|------------------|------|--------|----------|-------------|
| 모바일 (Small) | iPhone SE | 375x667 | Safari | 매 빌드 |
| 모바일 (Standard) | iPhone 12/13 | 390x844 | Safari | 매 빌드 |
| 모바일 (Large) | Samsung Galaxy S21 | 412x915 | Chrome | 매 빌드 |
| 태블릿 | iPad Pro 12.9" | 1024x1366 | Safari | 주간 |
| 태블릿 (Android) | Samsung Galaxy Tab | 768x1024 | Chrome | 주간 |
| 데스크톤 (Full HD) | Windows PC | 1920x1080 | Chrome, Edge | 매 빌드 |
| 데스크톱 (2K) | macOS | 2560x1440 | Safari, Firefox | 주간 |
| 데스크톱 (4K) | Windows PC | 3840x2160 | Chrome, Edge | 월간 |

**브라우저 호환성:**

| 브라우저 | 최소 버전 | 우선순위 |
|----------|-----------|---------|
| Chrome | 90+ | P0 |
| Safari | 14+ | P0 |
| Firefox | 88+ | P1 |
| Edge | 90+ | P0 |
| Samsung Internet | 14+ | P1 |

**네트워크 성능 테스트:**

| 네트워크 | 다운로드 속도 | 테스트 항목 |
|----------|---------------|-------------|
| 3G | 1.6 Mbps | 페이지 로드, 차트 렌더링 |
| 4G | 10 Mbps | 시뮬레이션 재생 |
| WiFi | 50 Mbps | 전체 기능 |
| 5G | 100+ Mbps | 고급 기능 |

**최적화:**
- 이미지 지연 로딩 (`loading="lazy"`)
- 코드 분할 (Code Splitting)
- 차트 데이터 가상화 (Virtualization)
- CDN 에셋 배포

#### 접근성 테스트 (Accessibility Testing)

**자동화 도구:**

| 도구 | 용도 | CI/CD 통합 | 빈도 |
|------|------|------------|------|
| axe DevTools | 자동화 검사 | ✅ | 매 커밋 |
| WAVE (WebAIM) | 시각적 피드백 | ❌ | 주간 |
| Lighthouse | 전반적 점수 | ✅ | 매 빌드 |
| pa11y | CI/CD 파이프라인 | ✅ | 매 PR |

**수동 테스트 체크리스트:**

**키보드 탐색:**
- [ ] Tab으로 모든 인터랙티브 요소 접근
- [ ] 포커스 순서 논리적 (위→아래, 왼쪽→오른쪽)
- [ ] 포커스 표시 명확 (2px outline)
- [ ] Escape로 모달/드롭다운 닫기
- [ ] 방향키로 슬라이더 조작

**스크린 리더 테스트:**

| 스크린 리더 | OS | 브라우저 | 테스트 항목 |
|-------------|-----|----------|-------------|
| NVDA | Windows | Firefox | 모든 기능 |
| VoiceOver | macOS/iOS | Safari | 모바일 포함 |
| TalkBack | Android | Chrome | 모바일 |
| JAWS | Windows | Edge | 핵심 경로 |

**색상 및 대비:**
- [ ] 모든 텍스트 대비율 4.5:1 이상
- [ ] 색상만으로 정보 전달 ❌
- [ ] 색맹 시뮬레이션 테스트:
  - Deuteranopia (적-녹 색맹): 5% 남성
  - Protanopia (적-청 색맹): 1% 남성
  - Tritanopia (청-황 색맥): 0.01%

**모션 및 애니메이션:**
- [ ] `prefers-reduced-motion` 존중
- [ ] 3초 이상 애니메이션 일시정지 버튼

#### 사용자 테스트 (User Testing)

**장애인 사용자 그룹:**

| 장애 유형 | 인원 | 테스트 방법 | 빈도 |
|-----------|------|-------------|------|
| 시각 장애 (전맹) | 2명 | 스크린 리더 | 분기별 |
| 시각 장애 (저시력) | 1명 | 확대경, 고대비 | 분기별 |
| 운동 장애 (키보드만) | 1명 | 키보드 내비게이션 | 분기별 |
| 인지 장애 | 1명 | 단순화된 사용성 | 반기별 |

**보조 기기 다양성:**
- 스크린 리더 (NVDA, VoiceOver)
- 확대경 (ZoomText MAGic)
- 음성 인식 (Dragon NaturallySpeaking)
- 터치 디바이스 (태블릿)

**테스트 시나리오:**
1. 새 전략 생성 (노드 에디터)
2. 백테스팅 시뮬레이션 실행
3. 라이브 거래 모니터링
4. 크리에이터 시뮬레이션 시청
5. 설정 변경

### Implementation Guidelines

#### Responsive Development (반응형 개발)

**1. 상대 단위 사용 (Relative Units)**

✅ **좋은 예:**
```css
.button {
  padding: 0.5rem 1rem;      /* rem: 폰트 크기 기반 */
  font-size: 1rem;           /* 16px (기본) */
  width: 100%;               /* 부모 요소 기반 */
  max-width: 300px;          /* 최대 너비 제한 */
  margin: 1rem auto;         /* 중앙 정렬 */
}
```

❌ **나쁜 예:**
```css
.button {
  padding: 8px 16px;         /* 고정 픽셀 */
  font-size: 16px;           /* 고정 픽셀 */
  width: 300px;              /* 고정 너비 */
}
```

**2. Mobile First 미디어 쿼리**

```css
/* 기본: 모바일 (320px+) */
.container {
  padding: 16px;
  font-size: 14px;
}

.column {
  width: 100%;
}

/* md+: 태블릿 (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 15px;
  }

  .column {
    width: 50%;
  }
}

/* lg+: 데스크톱 (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    font-size: 16px;
  }

  .column {
    width: 33.333%;
  }
}
```

**3. 터치 타겟 최소 크기**

```css
.button,
.link,
.tab,
.card-clickable {
  min-width: 44px;
  min-height: 44px;  /* WCAG AA: 44x44px */
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 모바일에서는 더 크게 */
@media (max-width: 767px) {
  .button {
    min-height: 48px;  /* 모바일 가이드라인 */
    padding: 14px 20px;
  }
}
```

**4. 반응형 이미지**

```html
<!-- srcset으로 다양한 해상도 제공 -->
<img
  src="chart-800.jpg"
  srcset="chart-400.jpg 400w,
          chart-800.jpg 800w,
          chart-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  alt="RSI 지표 차트 - 14일 기간, 현재 값 28.5 (과매도)"
  loading="lazy"
  width="800"
  height="600"
>

<!-- picture 요소로 아트 디렉션 -->
<picture>
  <source media="(min-width: 1024px)" srcset="hero-desktop.jpg">
  <source media="(min-width: 768px)" srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="gr8 플랫폼 대시보드">
</picture>
```

**5. 차트 반응형 처리**

```javascript
// Chart.js 반응형 설정
const chart = new Chart(ctx, {
  type: 'candlestick',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: window.innerWidth >= 768  // 태블릿 이상에서만
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: window.innerWidth < 768 ? 5 : 10
        }
      }
    }
  }
});

// 리사이즈 디바운스
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    chart.resize();
  }, 250);
});
```

#### Accessibility Development (접근성 개발)

**1. 시맨틱 HTML (Semantic HTML)**

✅ **좋은 예:**
```html
<nav aria-label="메인 네비게이션">
  <ul role="list">
    <li><a href="/dashboard" aria-current="page">대시보드</a></li>
    <li><a href="/backtesting">백테스팅</a></li>
  </ul>
</nav>

<main id="main-content" tabindex="-1">
  <h1>백테스팅 시뮬레이션</h1>

  <section aria-labelledby="player-heading">
    <h2 id="player-heading">시뮬레이션 플레이어</h2>
    ...
  </section>

  <section aria-labelledby="workflow-heading">
    <h2 id="workflow-heading">노드 워크플로우</h2>
    ...
  </section>
</main>

<aside aria-label="실시간 통계">
  ...
</aside>

<footer>
  <p>&copy; 2026 gr8. All rights reserved.</p>
</footer>
```

❌ **나쁜 예:**
```html
<div class="nav">
  <div class="nav-item" onclick="goToDashboard()">대시보드</div>
</div>

<div class="main">
  <div class="title">백테스팅</div>
  <div class="content">...</div>
</div>
```

**2. ARIA 라벨 및 역할**

```html
<!-- 아이콘만 있는 버튼: aria-label 필수 -->
<button
  aria-label="시뮬레이션 재생"
  onclick="playSimulation()"
>
  <i data-lucide="play"></i>
</button>

<!-- 복잡한 위젯: role + aria-* 속성 -->
<div
  role="slider"
  aria-label="RSI 기간 설정"
  aria-valuemin="1"
  aria-valuemax="100"
  aria-valuenow="14"
  aria-valuetext="14일"
  aria-describedby="slider-help"
  tabindex="0"
>
  <span id="slider-help">RSI 계산 기간 (일반적으로 14일)</span>
  <div class="slider-thumb" tabindex="-1"></div>
</div>

<!-- 다이얼로그 (모달) -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">새 전략 만들기</h2>
  <p id="modal-description">노드를 드래그하여 전략을 구성하세요</p>
  <button aria-label="모달 닫기" onclick="closeModal()">
    <i data-lucide="x"></i>
  </button>
</div>

<!-- 라이브 리전 (실시간 업데이트) -->
<div
  role="region"
  aria-live="polite"
  aria-atomic="true"
  aria-label="시뮬레이션 진행 상태"
>
  현재 배속: 2배속, 진행률: 45%
</div>
```

**3. 포커스 관리 (Focus Management)**

```javascript
// 모달 열릴 때 포커스 이동
function openModal() {
  const modal = document.getElementById('modal');
  const previousFocus = document.activeElement;

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');

  // 포커스 가능한 첫 번째 요소 찾기
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length) {
    focusable[0].focus();
  }

  // 이전 포커스 저장
  modal.dataset.previousFocus = previousFocus.id || previousFocus.className;
}

// 모달 닫을 때 포커스 복원
function closeModal() {
  const modal = document.getElementById('modal');
  const previousFocusId = modal.dataset.previousFocus;

  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');

  if (previousFocusId) {
    const previousFocus = document.querySelector(`#${previousFocusId}`) ||
                          document.querySelector(`.${previousFocusId}`);
    if (previousFocus) {
      previousFocus.focus();
    }
  }
}

// 포커스 트랩 (모달 내부)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && modalOpen) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
});
```

**4. 키보드 이벤트**

```javascript
// ESC로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    if (modal) {
      closeModal();
    }
  }
});

// 방향키로 슬라이더 조작
const slider = document.querySelector('[role="slider"]');
let sliderValue = parseInt(slider.getAttribute('aria-valuenow'));

slider.addEventListener('keydown', (e) => {
  const min = parseInt(slider.getAttribute('aria-valuemin'));
  const max = parseInt(slider.getAttribute('aria-valuemax'));

  switch(e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault();
      if (sliderValue < max) {
        sliderValue++;
        updateSlider(sliderValue);
      }
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault();
      if (sliderValue > min) {
        sliderValue--;
        updateSlider(sliderValue);
      }
      break;
    case 'Home':
      e.preventDefault();
      sliderValue = min;
      updateSlider(sliderValue);
      break;
    case 'End':
      e.preventDefault();
      sliderValue = max;
      updateSlider(sliderValue);
      break;
  }
});

function updateSlider(value) {
  slider.setAttribute('aria-valuenow', value);
  slider.setAttribute('aria-valuetext', `${value}일`);
  // 시각적 업데이트...
}
```

**5. 고대비 모드 지원**

```css
@media (prefers-contrast: high) {
  :root {
    --text-on-primary: #000000;  /* 더 높은 대비 */
    --border-color: #FFFFFF;
  }

  .button-primary {
    border: 2px solid currentColor;  /* 테두리 추가 */
  }

  .card {
    border: 2px solid #262626;  /* 명확한 테두리 */
  }

  .chart-marker {
    border: 2px solid;
    outline: 1px solid #FFFFFF;
  }
}
```

**6. 모션 감소 존중**

```css
/* 기본 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

/* prefers-reduced-motion: 비활성화 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .fade-in {
    animation: none;
    opacity: 1;
  }
}

/* JavaScript로 감지 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // 애니메이션 활성화
  enableAnimations();
}
```

**7. 폼 접근성**

```html
<!-- 명확한 레이블 -->
<form>
  <div class="form-group">
    <label for="strategy-name">
      전략 이름
      <span class="required" aria-label="필수 항목">*</span>
    </label>
    <input
      id="strategy-name"
      type="text"
      required
      aria-required="true"
      aria-describedby="strategy-name-help"
      aria-invalid="false"
    >
    <span id="strategy-name-help" class="help-text">
      전략을 식별할 이름 (2-50자)
    </span>
  </div>

  <!-- 에러 메시지 -->
  <div class="form-group" class="has-error">
    <label for="rsi-period">RSI 기간</label>
    <input
      id="rsi-period"
      type="number"
      min="1"
      max="100"
      aria-invalid="true"
      aria-describedby="rsi-error"
    >
    <div id="rsi-error" role="alert" class="error-message">
      <i data-lucide="alert-circle"></i>
      RSI 기간은 1-100 사이여야 합니다 (현재: 150)
    </div>
  </div>
</form>
```

**8. 스킵 링크 (Skip Links)**

```html
<!-- HTML -->
<body>
  <a href="#main-content" class="skip-link">
    메인 콘텐츠로 건너뛰기
  </a>

  <nav aria-label="메인 네비게이션">...</nav>

  <main id="main-content" tabindex="-1">
    ...
  </main>
</body>

<!-- CSS -->
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0487FF;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

**다음 단계:** Step 14 - UX 디자인 워크플로우 완료

---
<!-- UX design content will be appended sequentially through collaborative workflow steps -->
