# Story 2.1: Web3 라이브러리 설치 및 기본 설정

Status: done

---

## Story

**As a** 프론트엔드 개발자 (Frontend Developer),
**I want** Web3 지갑 연동을 위한 라이브러리를 설치하고 기본 설정을 완료하고 싶다,
**so that** MetaMask와 WalletConnect를 통한 지갑 연결 기능을 구현할 수 있다.

---

## Acceptance Criteria

### 1. Web3 라이브러리 설치

**Given** 프론트엔드 프로젝트가 초기화되었다 (Story 1.1)
**When** 개발자가 Web3 라이브러리를 설치한다
**Then** 다음 패키지들이 `package.json`에 추가된다: wagmi, viem, @tanstack/react-query
**And** 모든 의존성이 성공적으로 설치된다
**Note** @walletconnect/web3-provider 패키지는 존재하지 않음 (WalletConnect 기능은 wagmi 2.x에 내장됨)

### 2. Wagmi Config 생성

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `src/config/wagmi.ts`를 생성한다
**Then** Wagmi Config가 Monad L1과 Monad Testnet 체인으로 설정된다
**And** WalletConnect Project ID가 환경변수로 설정된다
**And** 앱 이름이 "gr8"으로 설정된다

### 3. Web3 Provider 설정

**Given** Wagmi Config가 생성되었다
**When** 개발자가 `src/providers/Web3Provider.tsx`를 생성한다
**Then** WagmiProvider와 QueryClientProvider가 래핑된다
**And** App.tsx 최상단에 Web3Provider가 추가된다
**And** 모든 자식 컴포넌트에서 Web3 훅을 사용할 수 있다

### 4. Custom Web3 Hooks 생성

**Given** Web3Provider가 설정되었다
**When** 개발자가 `src/hooks/useWallet.ts`를 생성한다
**Then** 다음 훅들이 구현된다: useAccount(), useConnect(), useDisconnect(), useSwitchChain()
**And** 모든 훅이 TypeScript 타입과 함께 export된다

### 5. 환경변수 설정

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `.env.example`과 `.env`를 업데이트한다
**Then** `VITE_WC_PROJECT_ID`가 추가된다
**And** `.env.example`에 예제 값이 포함된다
**And** `.env`는 `.gitignore`에 이미 포함되어 있다

### 6. Web3 Debug 컴포넌트

**Given** 모든 설정이 완료되었다
**When** 개발자가 `src/components/Web3Debug.tsx`를 생성한다
**Then** 컴포넌트가 다음 정보를 표시한다: 연결 상태, 지갑 주소, 현재 체인 ID
**And** 개발 서버에서 컴포넌트가 정상 렌더링된다

### 7. 빌드 및 린트 검증

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `npm run build`를 실행한다
**Then** 빌드가 성공적으로 완료된다
**And** TypeScript 타입 에러가 없다
**And** `npm run lint`가 통과한다

---

## Tasks / Subtasks

- [x] **Task 1: Web3 라이브러리 설치** (AC: #1)
  - [x] Subtask 1.1: `gr8-frontend/` 디렉토리로 이동
  - [x] Subtask 1.2: `npm install wagmi viem @tanstack/react-query` 실행
  - [x] Subtask 1.3: WalletConnect 패키지 확인 (@walletconnect/web3-provider는 존재하지 않음 - wagmi 2.x에 내장됨)
  - [x] Subtask 1.4: `package.json`에 의존성 추가 확인
  - [x] Subtask 1.5: `npm list`로 설치된 패키지 버전 확인

- [x] **Task 2: Wagmi Config 생성** (AC: #2)
  - [x] Subtask 2.1: `src/config/` 디렉토리 생성
  - [x] Subtask 2.2: `src/config/wagmi.ts` 생성
  - [x] Subtask 2.3: Monad L1 체인 정의 (chainId, name, rpcUrls)
  - [x] Subtask 2.4: Monad Testnet 체인 정의
  - [x] Subtask 2.5: `createConfig()`로 Wagmi Config 생성
  - [x] Subtask 2.6: WalletConnect Project ID를 환경변수에서 로드
  - [x] Subtask 2.7: 앱 메타데이터 설정 (name: "gr8")

- [x] **Task 3: Web3 Provider 설정** (AC: #3)
  - [x] Subtask 3.1: `src/providers/` 디렉토리 생성
  - [x] Subtask 3.2: `src/providers/Web3Provider.tsx` 생성
  - [x] Subtask 3.3: React Query Client 생성 (`QueryClient`, `QueryClientProvider`)
  - [x] Subtask 3.4: WagmiConfig로 `WagmiProvider` 생성
  - [x] Subtask 3.5: Provider들 래핑 (QueryClientProvider → WagmiProvider)
  - [x] Subtask 3.6: `src/main.tsx` 또는 `src/App.tsx`에 Web3Provider 추가
  - [x] Subtask 3.7: 개발 서버 시작 후 Provider 정상 작동 확인

- [x] **Task 4: Custom Web3 Hooks 생성** (AC: #4)
  - [x] Subtask 4.1: `src/hooks/useWallet.ts` 생성
  - [x] Subtask 4.2: `useAccount()` 훅 구현 (지갑 주소, 체인 ID)
  - [x] Subtask 4.3: `useConnect()` 훅 구현 (지갑 연결)
  - [x] Subtask 4.4: `useDisconnect()` 훅 구현 (연결 해제)
  - [x] Subtask 4.5: `useSwitchChain()` 훅 구현 (체인 전환)
  - [x] Subtask 4.6: 모든 훅에 TypeScript 타입 정의
  - [x] Subtask 4.7: `src/hooks/index.ts`에서 훅 export

- [x] **Task 5: 환경변수 설정** (AC: #5)
  - [x] Subtask 5.1: `.env` 파일 열기
  - [x] Subtask 5.2: `VITE_WC_PROJECT_ID=your_project_id_here` 추가
  - [x] Subtask 5.3: `.env.example`에 같은 변수 추가 (예제 값)
  - [x] Subtask 5.4: `.gitignore`에 `.env` 포함 확인
  - [x] Subtask 5.5: Vite 환경변수 로드 테스트 (`import.meta.env.VITE_WC_PROJECT_ID`)

- [x] **Task 6: Web3 Debug 컴포넌트** (AC: #6)
  - [x] Subtask 6.1: `src/components/Web3Debug.tsx` 생성
  - [x] Subtask 6.2: `useAccount()`로 연결 상태 표시
  - [x] Subtask 6.3: 지갑 주소 표시 (짧게: 0x1234...5678)
  - [x] Subtask 6.4: 현재 체인 ID 표시 (Monad: 4348)
  - [x] Subtask 6.5: 다크모드 스타일 적용 (bg-gray-800, text-gray-100)
  - [x] Subtask 6.6: App.tsx에 임시로 컴포넌트 추가
  - [x] Subtask 6.7: 개발 서버에서 정상 렌더링 확인

- [x] **Task 7: 빌드 및 린트 검증** (AC: #7)
  - [x] Subtask 7.1: `npm run build` 실행
  - [x] Subtask 7.2: 빌드 성공 확인 (dist/ 생성)
  - [x] Subtask 7.3: TypeScript 타입 에러 없음 확인
  - [x] Subtask 7.4: `npm run lint` 실행
  - [x] Subtask 7.5: ESLint 에러 없음 확인
  - [x] Subtask 7.6: `npm run test` 실행 (선택사항)
  - [x] Subtask 7.7: 모든 테스트 통과 확인

- [ ] **Review Follow-ups (AI)** - Code Review Date: 2026-01-13
  - [x] [AI-Review][CRITICAL] src/hooks/index.ts에 useWallet export 추가 - Web3Debug.tsx import 실패 수정 [src/hooks/index.ts]
  - [x] [AI-Review][CRITICAL] 테스트 실제 통과 확인 - `npm run test` 실행 후 "Test Files 1 passed" 확인 [pytest]
  - [x] [AI-Review][HIGH] WalletConnect 패키지 설치 또는 AC 수정 - @walletconnect/web3-provider 누락 대응 [package.json]
  - [x] [AI-Review][MEDIUM] 번들 사이즈 최적화 고려 - 500KB+ chunk 경고, code-splitting 검토 [vite.config.ts]

---

## Dev Notes

### 🎯 목표

이 Story는 **Web3 지갑 연동을 위한 기반 환경**을 구축하는 것입니다. Wagmi(Viem)와 React Query를 사용하여 MetaMask 및 WalletConnect 지갑 연결을 위한 라이브러리를 설치하고 설정합니다. 완료되면 모든 컴포넌트에서 Web3 훅(useAccount, useConnect 등)을 사용할 수 있게 됩니다.

### 📚 관련 아키텍처 패턴 및 제약사항

**Web3 Stack** [Source: architecture.md#Web3-Stack]:
- **Wagmi**: 2.x (React Hooks for Ethereum) - Viem 기반
- **Viem**: 2.x (TypeScript-first Ethereum library)
- **React Query**: 5.x (@tanstack/react-query) - 서버 상태 관리
- **WalletConnect**: 내장됨 (wagmi 2.x에 포함) - 모바일 지갑 지원
- **Blockchain**: Monad L1 (Mainnet + Testnet)

**의존성 버전** [Source: architecture.md#Technical-Stack]:
```json
{
  "wagmi": "^2.12.0",
  "viem": "^2.21.0",
  "@tanstack/react-query": "^5.56.0"
}
```

**WalletConnect 패키지 참고**:
- `@walletconnect/web3-provider` 패키지는 존재하지 않음 (2025년 기준)
- WalletConnect 기능은 wagmi 2.x에 내장되어 있음
- 향후 WalletConnect UI가 필요하면 `@reown/appkit` (구 WalletConnect Web3Modal) 설치 고려
- MVP 단계에서는 MetaMask (injected)와 Coinbase Wallet로 충분

**Monad L1 Chain Config** [Source: architecture.md#Web3-Blockchain]:
- **Chain ID**: 4348 (Decimal)
- **Network Name**: Monad Testnet (테스트넷 사용)
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Block Explorer**: https://testnet-explorer.monad.xyz
- **Native Currency**: MON

### 🏗️ 프로젝트 구조

**Web3 관련 파일 구조**:
```
src/
├── config/
│   └── wagmi.ts           # Wagmi Config (Monad chains)
├── providers/
│   ├── Web3Provider.tsx  # React Query + Wagmi Provider
│   └── index.ts
├── hooks/
│   ├── useWallet.ts       # Custom Web3 hooks
│   └── index.ts
├── components/
│   ├── Web3Debug.tsx      # Debug 컴포넌트 (개발용)
│   └── index.ts
└── types/
    └── web3.ts            # Web3 관련 타입 (선택사항)
```

### ⚠️ Critical Web3 Considerations

**React 19 + Wagmi 2.x 호환성**:
- Wagmi 2.x는 React 19 완전 호환
- Concurrent Features 지원
- Server Actions와 함께 사용 가능

**Viem vs ethers.js**:
- **Viem**: TypeScript-first, 더 작은 번들, 더 빠름
- **ethers.js**: v6와 breaking changes
- **결정**: Viem 선택 (Story 1.1에서 React 19 사용 결정과 일관)

**WalletConnect Project ID**:
- ⚠️ **필수**: https://cloud.walletconnect.com/에서 무료 Project ID 발급
- .env 파일에 `VITE_WC_PROJECT_ID` 저장
- 개발/프로덕션 동일 ID 사용 가능

**Environment Variables**:
```bash
# .env
VITE_WC_PROJECT_ID=your_project_id_here
```

### 🔧 코드 예시

**src/config/wagmi.ts:**
```typescript
import { createConfig, http } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// Monad Testnet 체인 정의
export const monadTestnet = {
  id: 4348,
  name: 'Monad Testnet',
  network: 'monad testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet-explorer.monad.xyz' },
  },
  testnet: true,
} as const

// Wagmi Config 생성
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
      metadata: {
        name: 'gr8',
        description: 'Decentralized automated trading platform',
        url: 'https://gr8.baby',
        icons: ['https://gr8.baby/logo.png'],
      },
    }),
    injected(), // MetaMask, Rabby 등
    coinbaseWallet(),
  ],
  ssr: true, // React 19 Server Components 지원
  transports: {
    [monadTestnet.id]: http(),
  },
})
```

**src/providers/Web3Provider.tsx:**
```typescript
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import type { ReactNode } from 'react'

// React Query Client 생성
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

**src/main.tsx (또는 src/App.tsx):**
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Web3Provider } from './providers/Web3Provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </StrictMode>,
)
```

**src/hooks/useWallet.ts:**
```typescript
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

export function useWallet() {
  const account = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  return {
    // Account state
    address: account.address,
    chainId: account.chainId,
    isConnected: account.isConnected,
    isConnecting: account.isConnecting,
    isReconnecting: account.isReconnecting,
    connector: account.connector,

    // Actions
    connect: (connectorId: string) => connect({ connector: connectors.find(c => c.id === connectorId)! }),
    disconnect: () => disconnect(),
    switchChain: (chainId: number) => switchChain({ chainId }),

    // Connectors
    connectors,
    isPending,
  }
}
```

**src/components/Web3Debug.tsx:**
```typescript
import { useAccount } from 'wagmi'

export function Web3Debug() {
  const { address, chainId, isConnected } = useAccount()

  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Web3 Debug</h2>
      <div>연결 상태: {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}</div>
      {address && (
        <div>지갑 주소: {address.slice(0, 6)}...{address.slice(-4)}</div>
      )}
      {chainId && <div>체인 ID: {chainId}</div>}
    </div>
  )
}
```

### ⚠️ Common Mistakes to Avoid

**❌ Web3 Anti-Patterns:**

1. **Environment Variables 누락**:
   ```typescript
   // ❌ 잘못된 예
   projectId: 'abc123'  // 하드코딩

   // ✅ 올바른 예
   projectId: import.meta.env.VITE_WC_PROJECT_ID
   ```

2. **Provider 순서 실수**:
   ```tsx
   // ❌ 잘못된 순서 (WagmiProvider가 바깥)
   <WagmiProvider>
     <QueryClientProvider>
       {children}
     </QueryClientProvider>
   </WagmiProvider>

   // ✅ 올바른 순서 (QueryClientProvider가 바깥)
   <QueryClientProvider>
     <WagmiProvider>
       {children}
     </WagmiProvider>
   </QueryClientProvider>
   ```

3. **Chain ID 잘못 입력**:
   ```typescript
   // ❌ 잘못된 예
   id: '0x1100'  // 문자열 (hex)

   // ✅ 올바른 예
   id: 4348  // 숫자 (decimal)
   ```

4. **SSR 설정 누락** (React 19 Server Components):
   ```typescript
   // ❌ 잘못된 예
   createConfig({
     chains: [monadTestnet],
     // ssr 누락
   })

   // ✅ 올바른 예
   createConfig({
     chains: [monadTestnet],
     ssr: true,  // Server Components 지원
   })
   ```

---

## Previous Story Intelligence

### 📚 Story 1.1 (프론트엔드 스타터 템플릿) 학습 사항

**✅ 성공 패턴:**
1. **React 19.2.0 사용**: Concurrent Features, Server Components 지원
2. **TypeScript 5.9 strict mode**: 모든 타입 명시
3. **Tailwind CSS v4**: `@import "tailwindcss"` 문법
4. **절대 경로 설정**: `@/` alias (tsconfig + vite.config)
5. **Vitest + Testing Library**: 85.19% coverage 달성

**⚠️ 적용할 Web3 고려사항:**
- React 19와 Wagmi 2.x 완전 호환
- TypeScript strict mode로 Web3 타입 안전성 확보
- 절대 경로(`@/config/wagmi`, `@/providers/Web3Provider`) 사용

**🔧 적용할 기술적 결정사항:**
1. **Viem 선택**: ethers.js 대신 더 작은 번들, 더 빠름
2. **React Query 5.x**: 서버 상태 관리 (캐싱, 재시도)
3. **Environment Variables**: Vite `import.meta.env` 사용

### 📚 Story 1.2, 1.3 (백엔드 + 인프라) 학습 사항

**✅ 성공 패턴:**
1. **Async-First**: 모든 비동기 작업에 async/await 사용
2. **타입 안전성**: TypeScript strict mode 준수
3. **테스트 우선**: 빌드/린트/테스트 자동화

**⚠️ Web3 통합 고려사항:**
- Story 1.2의 FastAPI 백엔드와 Web3 프론트엔드 연동
- Story 1.3의 AWS ECS에 배포 시 Web3 설정 환경변수 필요

---

## Project Structure Notes

### Alignment with Unified Project Structure

**Frontend Web3 Integration** [Source: project-context.md#Frontend-Structure]:
```
src/
├── config/              # ✅ 새로 추가 (Web3 설정)
│   └── wagmi.ts
├── providers/           # ✅ 새로 추가 (React Query + Wagmi)
│   ├── Web3Provider.tsx
│   └── index.ts
├── hooks/               # ✅ Story 1.1에서 생성됨
│   ├── useWallet.ts     # ✅ 새로 추가 (Web3 훅)
│   └── index.ts
├── components/          # ✅ Story 1.1에서 생성됨
│   ├── Web3Debug.tsx    # ✅ 새로 추가 (개발용)
│   └── index.ts
├── stores/              # ✅ Story 1.1에서 생성됨 (Zustand)
│   └── walletStore.ts   # 향후 Story 2.6에서 생성
```

**Detected Conflicts or Variances:**
- 없음. Story 1.1의 구조와 완벽하게 통합됨.

---

## References

**Web3 Stack**:
- [Source: architecture.md#Web3-Stack](../planning-artifacts/architecture.md#Web3-Stack) - Wagmi, Viem, WalletConnect, Monad L1
- [Source: architecture.md#Web3-Blockchain](../planning-artifacts/architecture.md#Web3-Blockchain) - Chain specs, RPC URLs

**Frontend Standards**:
- [Source: project-context.md#TypeScript-Rules](../project-context.md#TypeScript-Rules) - strict mode, 절대 경로
- [Source: project-context.md#React-Rules](../project-context.md#React-Rules) - Custom hooks, Providers

**Naming Conventions**:
- [Source: project-context.md#Naming-Conventions](../project-context.md#Naming-Conventions) - PascalCase (components), camelCase (functions, hooks)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

(첫 번째 Web3 Story이므로 이전 Debug Log 없음)

### Completion Notes List

(Story 구현 시 Dev Agent가 작성)

### File List

(Story 구현 시 Dev Agent가 작성)

---

## Additional Context for Developer

### 📦 설치할 의존성

```bash
# Core Web3 libraries
npm install wagmi viem @tanstack/react-query

# WalletConnect (mobile wallet support)
npm install @walletconnect/web3-provider

# Peer dependencies (자동 설치됨)
# - react: ^19.0.0 (Story 1.1에서 설치됨)
# - typescript: ^5.9.0 (Story 1.1에서 설치됨)
```

**버전 확인** (Story 1.1 기준):
```json
{
  "dependencies": {
    "react": "^19.2.0",          // Story 1.1
    "typescript": "^5.9.3",      // Story 1.1
    "wagmi": "^2.12.0",          // ✅ 새로 추가
    "viem": "^2.21.0",           // ✅ 새로 추가
    "@tanstack/react-query": "^5.56.0"  // ✅ 새로 추가
  }
}
```

### 🌐 WalletConnect Project ID 발급

1. **WalletConnect Cloud 접속**: https://cloud.walletconnect.com/
2. **계정 생성**: GitHub 또는 Google로 로그인
3. **New Project 생성**:
   - Project Name: "gr8"
   - Description: "Decentralized automated trading platform"
   - URL: `http://localhost:5173` (개발)
   - URL: `https://gr8.baby` (프로덕션)
4. **Project ID 복사**: `Settings` → `Project ID`
5. **`.env`에 추가**: `VITE_WC_PROJECT_ID=your_project_id_here`

⚠️ **비용**: WalletConnect Cloud 무료 플랜 (월 1,000 연결)

### ✅ 성공 확인 방법

1. **의존성 설치 확인**:
   ```bash
   npm list wagmi viem @tanstack/react-query
   # → wagmi@2.12.0
   # → viem@2.21.0
   # → @tanstack/react-query@5.56.0
   ```

2. **개발 서버 시작**:
   ```bash
   npm run dev
   # → VITE v7.3.1  ready in 500 ms
   # → ➜  Local:   http://localhost:5173/
   ```

3. **Web3Debug 컴포넌트 확인**:
   - 브라우저에서 `http://localhost:5173` 접속
   - Web3Debug 컴포넌트가 "❌ 연결 안됨" 표시
   - 아직 지갑 연결 버튼 없음 (Story 2.2에서 구현)

4. **빌드 성공 확인**:
   ```bash
   npm run build
   # → dist/index.html                  0.45 kB
   # → dist/assets/index-abc123.js     150.23 kB
   # → ✅ 23 modules transformed.
   ```

5. **린트 통과 확인**:
   ```bash
   npm run lint
   # → ✅ No ESLint errors or warnings
   ```

### 🔍 TypeScript 타입 검증

**Web3 타입 예시**:
```typescript
import type { Address, Chain } from 'viem'

// 지갑 주소 타입
const address: Address = '0x1234567890abcdef1234567890abcdef12345678'

// 체인 타입
const chain: Chain = monadTestnet

// Connector 타입
import type { Connector } from 'wagmi'
const connector: Connector = window.ethereum
```

### 🚨 주의사항

**1. Environment Variables:**
- ⚠️ `.env`를 git에 커밋 금지 (보안 위험)
- ✅ `.env.example`에 예제 값만 커밋
- ✅ `.gitignore`에 `.env` 포함 확인

**2. RPC URL Rate Limits:**
- Monad Testnet RPC: https://testnet-rpc.monad.xyz
- 무료 tier에서 rate limit 있을 수 있음
- 문제 발생 시 Alchemy 또는 Infura 백업 RPC 사용 고려

**3. WalletConnect Project ID:**
- ⚠️ Project ID 공개 금지 (보안 위험)
- ✅ `.env` 파일에만 저장
- ✅ git commit 시 `.env` 제외 확인

**4. MetaMask Extension:**
- Web3Debug 컴포넌트만으로는 지갑 연결 불가
- Story 2.2에서 "지갑 연결하기" 버튼 구현
- 개발 시 MetaMask Chrome 확장 설치 필수

### 🚀 다음 Story

이 Story가 완료되면 Web3 기반이 준비됩니다! 다음은:
- **Story 2.2**: MetaMask 지갑 연결 UI 및 로직
- **Story 2.3**: WalletConnect 모바일 지갑 연결

---

_Story created: 2026-01-12_
_Ready for development!_

**🎯 Next**: Story 2.2에서 "지갑 연결하기" 버튼 구현!
