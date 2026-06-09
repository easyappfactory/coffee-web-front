# 20260608-Feature-ManagerPortal

## 개요

**목표:** Manager 역할(POC)로 접속 시 기존 Consumer 레이아웃(Navbar + Feed)이 아닌, **좌측 사이드바 기반의 독립적인 Manager Portal**을 제공한다.

**범위:** POC 단계 — API 연동 없이 데모 데이터만 활용하여 화면을 구성한다.

**브랜치:** `feat/manager-page`

**참고 디자인:** 제공된 "The Sommelier - Seller Portal" HTML 목업

---

## 1. 아키텍처 설계

### 1.1 라우팅 전략

현재 Consumer 라우트는 `(consumer)` 라우트 그룹 하위에 있다. Manager Portal은 **별도의 라우트 그룹 `(manager)`**를 만들어 완전히 독립적인 레이아웃을 적용한다.

```
src/app/
├── (consumer)/          # 기존 Consumer 레이아웃 (Navbar + Footer)
│   ├── layout.tsx
│   ├── feed/
│   ├── slot/[id]/
│   └── checkout/
├── (manager)/           # ★ 신규: Manager Portal 레이아웃 (Sidebar Only)
│   ├── layout.tsx       # ManagerLayout (사이드바 + 콘텐츠 영역)
│   └── manage/
│       ├── page.tsx     # /manage → 운영 현황 대시보드 (Phase 2에서 구현)
│       ├── slots/
│       │   └── page.tsx # /manage/slots → 슬롯 관리 (내 슬롯 목록)
│       ├── slots/new/
│       │   └── page.tsx # /manage/slots/new → 새 슬롯 만들기 (기존 SlotRegistrationForm 활용)
│       ├── orders/
│       │   └── page.tsx # /manage/orders → 주문 및 배송 관리 (스텁)
│       ├── analytics/
│       │   └── page.tsx # /manage/analytics → 판매 및 정산 통계 (스텁)
│       └── settings/
│           └── page.tsx # /manage/settings → 스토어 운영 설정 (스텁)
└── layout.tsx           # Root Layout (Providers, PocRoleSwitcher)
```

**결정 근거:**
- `(consumer)`와 `(manager)`는 레이아웃이 완전히 다름 (Navbar+Footer vs Sidebar Only)
- Next.js Route Groups를 활용하면 URL에 그룹명이 포함되지 않아 깔끔한 URL 유지
- 기존 Consumer 코드에 영향 없이 독립적으로 개발 가능

### 1.2 접근 방식 — PocRoleSwitcher 연동

현재 `PocRoleSwitcher`로 역할을 전환하면 `localStorage`에 `pocUserId`를 저장하고 `window.location.reload()`한다. Manager Portal 진입은 두 가지 방식을 지원한다:

1. **직접 URL 접근:** `/manage/slots`로 직접 이동
2. **역할 전환 시 리다이렉트:** PocRoleSwitcher에서 MANAGER 선택 시 `/manage/slots`로 리다이렉트

> POC 단계이므로 인증/인가 미들웨어는 구현하지 않는다. `usePocRole()` 훅으로 클라이언트 사이드 체크만 수행.

---

## 2. 레이아웃 설계

### 2.1 Manager Layout 구조

TopBar 없이 **사이드바 + 콘텐츠 영역**의 2-zone 구조로 단순화한다. 페이지 타이틀과 프로필 등은 각 페이지 콘텐츠 영역 상단에서 자체 처리한다.

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────────────────────────────────────┐  │
│  │          │ │                                          │  │
│  │  Side    │ │                                          │  │
│  │  Nav     │ │          Main Content Area               │  │
│  │  Bar     │ │          (py-10 px-12, max-w-6xl)        │  │
│  │  (w-72)  │ │                                          │  │
│  │          │ │                                          │  │
│  │  fixed   │ │                                          │  │
│  │  left    │ │                                          │  │
│  │          │ │                                          │  │
│  └──────────┘ └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 컴포넌트 분해

#### `ManagerSidebar` (`src/components/manage/layout/ManagerSidebar.tsx`)

```
┌─────────────────────┐
│  Barista Masters     │  ← 메인 로고 (기존 Navbar 로고 재활용)
│  관리                │  ← 서브텍스트로 "관리" 표시
│                      │
│  📊 운영 현황        │  ← /manage (Phase 2 - 스텁 페이지)
│  📦 슬롯 관리    ◀── │  ← /manage/slots (이번 POC 핵심)
│  🚚 주문 및 배송 관리│  ← /manage/orders (스텁)
│  📈 판매 및 정산 통계│  ← /manage/analytics (스텁)
│  ⚙️ 스토어 운영 설정 │  ← /manage/settings (스텁)
│                      │
│                      │
│                      │
│  ┌─────────────────┐ │
│  │ + Add New Blend │ │  ← 클릭 시 /manage/slots/new 이동
│  └─────────────────┘ │
│  ❓ Help Center      │
└─────────────────────┘
```

- 현재 활성 메뉴는 `border-r-4 border-primary + bg-surface-container-highest/50`로 강조
- `usePathname()`으로 현재 경로 감지하여 active 상태 관리
- Lucide React 아이콘 사용 (프로젝트 일관성)
- "Add New Blend" 버튼은 사이드바 하단 고정, `Next.js Link`로 `/manage/slots/new` 이동

#### `ManagerLayout` (`src/app/(manager)/layout.tsx`)

TopBar 없이 사이드바 + 콘텐츠만으로 구성. 페이지 타이틀은 각 페이지에서 직접 렌더링한다.

```tsx
// 구조 개요
export default function ManagerLayout({ children }) {
  return (
    <>
      <ManagerSidebar />
      <main className="ml-72 py-10 px-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </>
  )
}
```

---

## 3. 페이지별 상세 설계

### 3.1 슬롯 관리 페이지 (`/manage/slots`) — ★ 핵심

**목적:** 매니저 본인이 운영하는 슬롯들을 한눈에 파악하고 관리

#### 3.1.1 페이지 헤더

```
┌──────────────────────────────────────────────────────────┐
│  슬롯 관리                                    [+ 새 슬롯]│
│  내가 등록한 원두 슬롯을 관리하세요.                      │
└──────────────────────────────────────────────────────────┘
```

#### 3.1.2 통계 요약 카드 (상단 4열)

기존 HTML 목업의 Sales 탭 디자인 차용 + 종료 슬롯 카드 추가:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 💰 총 매출액  │  │ 📦 운영 슬롯  │  │ ⏹ 종료 슬롯  │  │ 🛒 이번 달   │
│              │  │              │  │              │  │   주문        │
│ ₩14,200,000  │  │    3 개      │  │    2 개      │  │   428 건     │
│     +12.4%   │  │ Active       │  │ Ended        │  │    +8.1%     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

- 데모 데이터 하드코딩 (mockManagerStats)
- "운영 슬롯"은 `active` 상태만 카운트, "종료 슬롯"은 `ended` 상태만 카운트

#### 3.1.3 내 슬롯 목록 (메인 콘텐츠)

**탭으로 진행중/종료 슬롯 분리:**

```
┌──────────────────────────────────────────────────────┐
│  [진행중 슬롯 (3)]     [종료된 슬롯 (2)]              │
│  ─────────────────                                   │
│  ↑ active tab                                        │
└──────────────────────────────────────────────────────┘
```

- **진행중 슬롯 탭** (기본): `status === "active"` 슬롯만 표시
- **종료된 슬롯 탭**: `status === "ended"` 슬롯만 표시
- 각 탭 라벨 옆에 해당 슬롯 개수를 괄호로 표시
- 탭 전환은 클라이언트 상태로 관리 (URL 변경 없음)

**진행중 슬롯 카드:**

```
┌──────────────────────────────────────────┐
│  [썸네일 이미지]                          │
│                                          │
│  에티오피아 아나에어로빅 네추럴            │
│  Limited Reserve Series                  │
│                                          │
│  ├─ 펀딩 진행률: ████████░░ 127%        │
│  ├─ 서포터: 842명                        │
│  ├─ 남은 일: 14일                        │
│                                          │
│  🟢 Active          [상세 보기] [편집]   │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ 💬 새 댓글 3건 · 📊 투표 +12건  │    │  ← ★ 커뮤니티 알림 영역
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**종료된 슬롯 카드:**

```
┌──────────────────────────────────────────┐
│  [썸네일 이미지]          (약간 dim 처리) │
│                                          │
│  파나마 게이샤 워시드                     │
│  Signature Collection                    │
│                                          │
│  ├─ 최종 달성률: 142%                    │
│  ├─ 총 서포터: 1,204명                   │
│  ├─ 총 매출: ₩8,520,000                 │
│                                          │
│  ⏹ Ended (2026.05.10)  [상세 보기]      │
└──────────────────────────────────────────┘
```

- 종료된 슬롯은 썸네일에 `opacity-70` 적용하여 시각적 구분
- 펀딩 진행률 대신 **최종 달성률**, **총 서포터**, **총 매출** 표시
- [편집] 버튼 없음, [상세 보기]만 표시
- 커뮤니티 알림 영역 없음 (종료된 슬롯은 활동이 없으므로)

**커뮤니티 알림 표시 전략 (진행중 슬롯만):**
- 각 슬롯 카드 하단에 **커뮤니티 업데이트 배지** 표시
- 새 댓글 수, 새 투표 참여 수, 새 좋아요 수를 아이콘+숫자로 표현
- 데모 데이터에 `newComments`, `newVotes`, `newLikes` 필드 추가
- 읽지 않은 알림이 있으면 카드 좌측에 파란 도트(●) 또는 카드 상단에 "NEW" 배지

**데모 데이터 구조 (mock):**

```typescript
interface ManagerSlot extends Slot {
  status: "active" | "draft" | "ended"
  fundingPercent: number
  supporters: number
  daysLeft: number
  // 종료 슬롯 전용 필드
  endedAt?: string              // 종료 일자 (예: "2026-05-10")
  finalPercent?: number         // 최종 달성률
  totalRevenue?: number         // 총 매출액
  // 진행중 슬롯 전용 커뮤니티 알림
  community: {
    newComments: number
    newVotes: number
    newLikes: number
    hasUnread: boolean
  }
}
```

#### 3.1.4 뷰 모드

- **카드 뷰** (기본): 2~3열 그리드
- 리스트 뷰는 Phase 2에서 고려

#### 3.1.5 빈 상태

- **진행중 탭 비어있을 때:** "진행중인 슬롯이 없습니다" + "새 슬롯 만들기" 버튼
- **종료 탭 비어있을 때:** "종료된 슬롯이 없습니다" (버튼 없음)

### 3.2 새 슬롯 만들기 페이지 (`/manage/slots/new`)

- 기존 `SlotRegistrationForm` 컴포넌트를 그대로 재사용
- Manager Layout 안에서 렌더링되므로 사이드바 포함
- 페이지 헤더("신규 블렌드 등록")는 `SlotRegistrationForm` 자체에 이미 포함되어 있음

```tsx
// src/app/(manager)/manage/slots/new/page.tsx
import { SlotRegistrationForm } from "@/components/manage/slot/SlotRegistrationForm"

export default function NewSlotPage() {
  return <SlotRegistrationForm />
}
```

### 3.3 스텁 페이지들

나머지 메뉴 항목은 "준비 중" 스텁으로 구현:

```
┌──────────────────────────────────────┐
│                                      │
│         🚧 준비 중입니다             │
│                                      │
│    이 기능은 곧 제공될 예정입니다.    │
│                                      │
└──────────────────────────────────────┘
```

- `/manage` (운영 현황), `/manage/orders`, `/manage/analytics`, `/manage/settings`
- 공통 `ComingSoon` 컴포넌트 하나로 처리

---

## 4. 컴포넌트 구조

### 4.1 새로 생성할 파일 목록

```
src/
├── app/(manager)/
│   ├── layout.tsx                           # Manager 전용 레이아웃
│   └── manage/
│       ├── page.tsx                         # 운영 현황 (스텁)
│       ├── slots/
│       │   └── page.tsx                     # 슬롯 관리 메인 페이지
│       ├── slots/new/
│       │   └── page.tsx                     # 새 슬롯 등록
│       ├── orders/
│       │   └── page.tsx                     # 주문 관리 (스텁)
│       ├── analytics/
│       │   └── page.tsx                     # 통계 (스텁)
│       └── settings/
│           └── page.tsx                     # 설정 (스텁)
├── components/manage/
│   ├── layout/
│   │   ├── ManagerSidebar.tsx               # 좌측 사이드바 (로고: {메인 로고} + 관리)
│   │   └── SidebarNavItem.tsx               # 사이드바 메뉴 아이템 (재사용)
│   ├── common/
│   │   ├── ComingSoon.tsx                   # "준비 중" 스텁 페이지
│   │   └── StatCard.tsx                     # 통계 요약 카드
│   └── slot/
│       ├── ManagerSlotCard.tsx              # 진행중 슬롯 카드 (펀딩+커뮤니티 알림)
│       ├── EndedSlotCard.tsx               # 종료 슬롯 카드 (최종 달성률+매출, dim)
│       ├── SlotStatusTabs.tsx              # 진행중/종료 탭 전환
│       ├── ManagerSlotGrid.tsx              # 슬롯 카드 그리드 컨테이너
│       ├── CommunityBadge.tsx              # 댓글/투표/좋아요 알림 배지
│       └── (기존) SlotRegistrationForm.tsx  # 기존 파일 그대로 사용
│       └── (기존) StoryTab.tsx
│       └── (기존) FlavorTab.tsx
│       └── (기존) PricingTab.tsx
│       └── (기존) MySlotList.tsx            # 더 이상 사용 안 함 (ManagerSlotGrid가 대체)
└── lib/mock/
    └── manager.ts                           # 매니저 전용 데모 데이터
```

### 4.2 기존 파일 수정 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/common/PocRoleSwitcher.tsx` | MANAGER 선택 시 `/manage/slots`로 리다이렉트 |
| `src/components/slot/feed/FeedContent.tsx` | Manager 분기 제거 (더 이상 feed에서 매니저 뷰 안 보여줌) |
| `src/components/slot/feed/ManagerFeedTabs.tsx` | 삭제 또는 deprecated (역할이 Manager Layout으로 이전) |

---

## 5. 데모 데이터 설계

### 5.1 `src/lib/mock/manager.ts`

```typescript
import { mockSlots } from "./slots"
import { mockSlotFundingData } from "./slots"

// 매니저 프로필 (사이드바 표시용)
export const mockManagerProfile = {
  id: "m1",
  name: "김 바리스타",
  role: "Premium Seller",
  profileImage: "https://picsum.photos/seed/manager/200/200",
}

// 진행중 슬롯 (active) — mockSlots 중 앞 3개 활용
export const mockActiveSlots: ManagerSlot[] = mockSlots.slice(0, 3).map((slot, index) => ({
  ...slot,
  status: "active" as const,
  fundingPercent: mockSlotFundingData[slot.id]?.funding.percent ?? 0,
  supporters: mockSlotFundingData[slot.id]?.funding.supporters ?? 0,
  daysLeft: mockSlotFundingData[slot.id]?.funding.daysLeft ?? 0,
  community: {
    newComments: [3, 1, 0][index],
    newVotes: [12, 5, 0][index],
    newLikes: [24, 8, 3][index],
    hasUnread: index < 2,
  },
}))

// 종료된 슬롯 (ended) — 별도 데모 데이터
export const mockEndedSlots: ManagerSlot[] = [
  {
    ...mockSlots[3],
    status: "ended" as const,
    fundingPercent: 142,
    supporters: 1204,
    daysLeft: 0,
    endedAt: "2026-05-10",
    finalPercent: 142,
    totalRevenue: 8520000,
    community: { newComments: 0, newVotes: 0, newLikes: 0, hasUnread: false },
  },
  {
    ...mockSlots[0],
    id: "5",
    title: "에티오피아 시다모 내추럴 : 베리의 축제",
    status: "ended" as const,
    fundingPercent: 98,
    supporters: 567,
    daysLeft: 0,
    endedAt: "2026-04-20",
    finalPercent: 98,
    totalRevenue: 4230000,
    community: { newComments: 0, newVotes: 0, newLikes: 0, hasUnread: false },
  },
]

// 전체 매니저 슬롯 (탭 필터용)
export const mockManagerSlots: ManagerSlot[] = [...mockActiveSlots, ...mockEndedSlots]

// 대시보드 통계
export const mockManagerStats = {
  totalRevenue: 14200000,
  revenueChange: "+12.4%",
  activeSlots: 3,
  endedSlots: 2,
  monthlyOrders: 428,
  ordersChange: "+8.1%",
}
```

---

## 6. 디자인 토큰 & 스타일 전략

### 6.1 색상

HTML 목업의 Material Design 3 색상 체계가 현재 프로젝트의 커스텀 Tailwind 테마와 다르다. **현재 프로젝트의 기존 디자인 토큰을 유지**하되, Manager Portal에 필요한 추가 토큰만 최소한으로 추가한다.

| 용도 | 기존 토큰 활용 | 비고 |
|------|---------------|------|
| 사이드바 배경 | `bg-gray-light` (#f7f7f7) 또는 새 `bg-surface-muted` | 목업의 surface-container-low 대응 |
| 사이드바 텍스트 | `text-ink-2`, `text-ink-muted` | |
| 활성 메뉴 강조 | `border-brand`, `bg-brand/5` | 목업의 primary 대응 |
| 카드 배경 | `bg-card` (#ffffff) | |
| 통계 카드 배경 | `bg-gray-light` | 목업의 surface-container-low 대응 |
| 커뮤니티 배지 | `bg-blue-50 text-blue-700` (Tailwind 기본) | 새 알림 강조 |
| Unread 도트 | `bg-red-500` | 읽지 않은 알림 표시 |

### 6.2 폰트

- 헤드라인: `font-display` (Manrope) — 기존 프로젝트 설정 유지
- 본문: `font-body` (Noto Sans KR)
- 목업의 Epilogue 폰트는 사용하지 않음 (프로젝트 통일성)

### 6.3 아이콘

- 현재 프로젝트: **Lucide React** 아이콘 사용
- HTML 목업: **Material Symbols Outlined** 사용
- **결정:** Lucide React 유지 (프로젝트 일관성). 목업의 아이콘을 Lucide 대응 아이콘으로 매핑

| 목업 (Material Symbols) | Lucide React 대응 |
|-------------------------|-------------------|
| `dashboard` | `LayoutDashboard` |
| `inventory_2` | `Package` |
| `local_shipping` | `Truck` |
| `bar_chart` | `BarChart3` |
| `settings` | `Settings` |
| `add` | `Plus` |
| `help` | `HelpCircle` |
| `account_balance_wallet` | `Wallet` |
| `shopping_bag` | `ShoppingBag` |

### 6.4 레이아웃 수치

| 요소 | 값 | 비고 |
|------|-----|------|
| 사이드바 너비 | `w-72` (288px) | 목업 동일 |
| 콘텐츠 좌측 마진 | `ml-72` | 사이드바 너비만큼 |
| 콘텐츠 상하 패딩 | `py-10` | TopBar 없으므로 상단 여백 줄임 |
| 콘텐츠 최대 너비 | `max-w-6xl` | 목업 동일 |
| 콘텐츠 좌우 패딩 | `px-12` | 목업 동일 |

---

## 7. 커뮤니티 알림 디자인

### 7.1 슬롯 카드 내 알림 영역

각 매니저 슬롯 카드 하단에 **커뮤니티 업데이트 섹션**:

```
┌──────────────────────────────────────┐
│  💬 새 댓글 3건  │  📊 투표 +12건   │
│  ❤️ 좋아요 +24  │                   │
└──────────────────────────────────────┘
```

- `hasUnread === true`이면 카드 좌측에 파란색 세로 바 (`border-l-4 border-blue-500`) 표시
- 숫자가 0이면 해당 항목 숨김
- 클릭 시 해당 슬롯 상세 페이지의 커뮤니티 탭으로 이동 (consumer 경로 `/slot/[id]` 활용)

### 7.2 사이드바 "슬롯 관리" 메뉴 알림 배지

슬롯 관리 메뉴 항목 옆에 읽지 않은 총 알림 수를 표시:

```
📦 슬롯 관리  [5]   ← 빨간 배지 (unread 합계)
```

---

## 8. 구현 태스크 브레이크다운

### Phase 1: 레이아웃 셸 (기본 골격)

| # | 태스크 | 파일 | 예상 난이도 |
|---|--------|------|------------|
| 1-1 | `ManagerSidebar` 컴포넌트 구현 (로고: {메인 로고} + 관리) | `components/manage/layout/ManagerSidebar.tsx` | 중 |
| 1-2 | `SidebarNavItem` 컴포넌트 구현 (active 상태, 배지 포함) | `components/manage/layout/SidebarNavItem.tsx` | 하 |
| 1-3 | `(manager)` 라우트 그룹 + layout.tsx 생성 (TopBar 없이 Sidebar만) | `app/(manager)/layout.tsx` | 하 |
| 1-4 | 스텁 페이지 (`ComingSoon`) 생성 + 모든 라우트 연결 | 5개 page.tsx + `ComingSoon.tsx` | 하 |

### Phase 2: 슬롯 관리 페이지 (핵심 기능)

| # | 태스크 | 파일 | 예상 난이도 |
|---|--------|------|------------|
| 2-1 | 매니저 전용 데모 데이터 생성 (active + ended 슬롯 분리) | `lib/mock/manager.ts` | 하 |
| 2-2 | `StatCard` 공통 컴포넌트 구현 | `components/manage/common/StatCard.tsx` | 하 |
| 2-3 | `CommunityBadge` 컴포넌트 구현 | `components/manage/slot/CommunityBadge.tsx` | 하 |
| 2-4 | `ManagerSlotCard` 컴포넌트 구현 — 진행중 카드 (펀딩+커뮤니티 알림) | `components/manage/slot/ManagerSlotCard.tsx` | 중 |
| 2-5 | `EndedSlotCard` 컴포넌트 구현 — 종료 카드 (최종 달성률+매출, dim 처리) | `components/manage/slot/EndedSlotCard.tsx` | 중 |
| 2-6 | `SlotStatusTabs` 탭 컴포넌트 구현 (진행중/종료 탭 전환 + 개수 표시) | `components/manage/slot/SlotStatusTabs.tsx` | 하 |
| 2-7 | `ManagerSlotGrid` 컨테이너 구현 (탭 상태에 따라 카드 렌더링) | `components/manage/slot/ManagerSlotGrid.tsx` | 하 |
| 2-8 | `/manage/slots` 페이지 조립 (통계카드 4장 + 탭 + 슬롯그리드) | `app/(manager)/manage/slots/page.tsx` | 중 |

### Phase 3: 새 슬롯 만들기 연결

| # | 태스크 | 파일 | 예상 난이도 |
|---|--------|------|------------|
| 3-1 | `/manage/slots/new` 페이지 생성 (기존 SlotRegistrationForm 연결) | `app/(manager)/manage/slots/new/page.tsx` | 하 |
| 3-2 | 사이드바 "Add New Blend" 버튼 → `/manage/slots/new` 링크 연결 | `ManagerSidebar.tsx` 수정 | 하 |

### Phase 4: 역할 전환 & 기존 코드 정리

| # | 태스크 | 파일 | 예상 난이도 |
|---|--------|------|------------|
| 4-1 | `PocRoleSwitcher` 수정 — MANAGER 선택 시 `/manage/slots`로 리다이렉트 | `PocRoleSwitcher.tsx` | 하 |
| 4-2 | `FeedContent.tsx`에서 매니저 분기 제거 | `FeedContent.tsx` | 하 |
| 4-3 | `ManagerFeedTabs.tsx` 삭제 또는 deprecated 처리 | `ManagerFeedTabs.tsx` | 하 |

---

## 9. 의존성 & 제약사항

- **Material Symbols 폰트 불필요:** Lucide React 아이콘으로 대체
- **추가 라이브러리 없음:** 기존 shadcn/ui, Tailwind, Lucide React로 모두 커버 가능
- **API 연동 없음:** 모든 데이터는 `src/lib/mock/manager.ts`에서 import
- **반응형 불필요:** v1.0 범위 제외 (데스크톱 고정 1280px+)
- **다크 모드:** 기존 class 기반 다크 모드 토큰이 있으므로 신규 컴포넌트에도 `dark:` 변형 고려 (선택적)

---

## 10. 컴포넌트 상세 Props 설계

### ManagerSidebar

```typescript
// 외부 props 없음 — 내부에서 usePathname()으로 active 상태 관리
// mockManagerProfile import하여 프로필 표시
```

### SidebarNavItem

```typescript
interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  badge?: number      // 읽지 않은 알림 수 (optional)
}
```

### StatCard

```typescript
interface StatCardProps {
  icon: LucideIcon
  label: string          // "총 매출액"
  value: string          // "₩14,200,000"
  change?: string        // "+12.4%"
  changeType?: "positive" | "neutral" // 색상 결정
}
```

### ManagerSlotCard (진행중 슬롯)

```typescript
interface ManagerSlotCardProps {
  slot: ManagerSlot      // status === "active" 슬롯
}
```

### EndedSlotCard (종료된 슬롯)

```typescript
interface EndedSlotCardProps {
  slot: ManagerSlot      // status === "ended" 슬롯 (endedAt, finalPercent, totalRevenue 포함)
}
```

### SlotStatusTabs

```typescript
interface SlotStatusTabsProps {
  activeCount: number     // 진행중 슬롯 수
  endedCount: number      // 종료된 슬롯 수
  activeTab: "active" | "ended"
  onTabChange: (tab: "active" | "ended") => void
}
```

### CommunityBadge

```typescript
interface CommunityBadgeProps {
  newComments: number
  newVotes: number
  newLikes: number
  hasUnread: boolean
}
```

---

## 11. 화면 흐름 요약

```
[PocRoleSwitcher: MANAGER 선택]
        │
        ▼
[/manage/slots] ── ManagerLayout (Sidebar Only)
        │
        ├── 통계 카드 3장 (매출, 슬롯 수, 주문)
        ├── 내 슬롯 그리드
        │   ├── ManagerSlotCard #1 (커뮤니티 알림 있음 🔵)
        │   ├── ManagerSlotCard #2 (커뮤니티 알림 있음 🔵)
        │   ├── ManagerSlotCard #3
        │   └── ManagerSlotCard #4 (Draft)
        │
        └── 사이드바 [+ Add New Blend] 클릭
                │
                ▼
        [/manage/slots/new] ── SlotRegistrationForm
                ├── Story 탭
                ├── Flavor 탭
                └── Pricing 탭
```

---

## 12. 확인 체크리스트 (구현 완료 시)

- [ ] `/manage/slots` 접속 시 사이드바 + 슬롯 목록이 정상 표시되는가
- [ ] 사이드바에서 현재 활성 메뉴가 올바르게 강조되는가
- [ ] "슬롯 관리" 메뉴에 읽지 않은 알림 배지가 표시되는가
- [ ] 슬롯 카드에 커뮤니티 알림 (댓글, 투표, 좋아요) 정보가 표시되는가
- [ ] `hasUnread` 슬롯에 시각적 구분이 되는가 (파란 세로바)
- [ ] "Add New Blend" 클릭 시 `/manage/slots/new` 이동하여 SlotRegistrationForm이 표시되는가
- [ ] 스텁 페이지들(`/manage`, `/manage/orders` 등)이 ComingSoon으로 표시되는가
- [ ] PocRoleSwitcher에서 MANAGER 선택 시 `/manage/slots`로 리다이렉트되는가
- [ ] USER 역할일 때 기존 Consumer 피드가 정상 동작하는가 (ManagerFeedTabs 제거 후)
- [ ] 기존 Consumer 페이지에 영향 없는가
