# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm run format   # Prettier (no-semicolon, double-quotes, tailwind class sort)
```

## Stack

- **Next.js 14** App Router with TypeScript (`@/*` aliases to `src/*`)
- **Tailwind CSS** + shadcn/ui components in `src/components/ui/`
- **Zustand** for client/UI state, **TanStack React Query v5** for server state
- **Axios** HTTP client; **React Hook Form 7** for forms
- **Recharts** for Flavor Radar / Bar charts; **Embla Carousel** (via shadcn Carousel)

## Architecture

The app is a coffee creator platform ("바리스타 마스터 / Barista Masters") with a feed of "slots" (content posts with funding/rewards). Desktop-only (1280px fixed-width) — no mobile responsive layout in v1.0 scope.

**Routing** (`src/app/`):
- `/` → redirects to `/feed`
- `/feed` — slot carousel + category filter
- `/slot/[id]` — Slot Detail (3-column layout, components planned in `detail/`)
- `/checkout` — order/payment page
- `/checkout/complete` — funding complete confirmation page

**API layer** (`src/lib/api.ts`):
All backend calls go through this file. `USE_MOCK = true` at the top swaps every endpoint to local mock data in `src/lib/mock/`. To connect a real backend, set `NEXT_PUBLIC_API_URL` in `.env.local` and flip the flag to `false` — no other changes needed.

API contracts (mocked endpoints mirror these exactly):

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/slots` | 슬롯 목록 |
| GET | `/api/slots/{id}` | 슬롯 상세 |
| GET | `/api/slots/{id}/social` | 소셜 데이터 통합 조회 |
| GET | `/api/slots/{id}/funding` | 펀딩 현황 + 리워드 목록 |
| POST | `/api/slots/{id}/likes` | 좋아요 토글 (낙관적 업데이트) |
| POST | `/api/slots/{id}/comments` | 댓글 작성 |
| POST | `/api/slots/{id}/poll/vote` | 투표 참여 |
| GET | `/api/masters/{id}` | 마스터 프로필 |
| POST | `/api/masters/{id}/follow` | 팔로우 토글 |
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/orders/{id}` | 주문 상세 |
| PATCH | `/api/orders/{id}/payment` | 결제 처리 (상태값만, 실제 PG 미연동) |

**State split:**
- Server state (slots, funding, comments, orders) → React Query hooks in `src/hooks/`
- UI state → Zustand in `src/store/`
  - `feedStore.ts` — active category filter + currently playing video ID
  - `checkoutStore.ts` — reward selection, payment method, step (order → payment → complete)

**Component organization:**
- `src/components/common/` — Navbar, Footer, FilterBar, SlotMeta
- `src/components/slot/feed/` — FeaturedSlot, SlotCard, SlotCarousel, VideoPlayer
- `src/components/slot/detail/` — planned: SlotDetailLayout, MasterProfileCard, SlotDetailHero, SlotDescription, FlavorRadarChart, FlavorBars, RoastingLevel, SocialActions, FundingWidget, CommentList, CommentForm, Poll
- `src/components/checkout/` — CheckoutOrderInfo, MasterPledge, PaymentMethods, TermsAccordion, CompleteBanner, UpdateTimeline, MasterQuoteCard
- `src/components/ui/` — shadcn primitives (generated via `npx shadcn@latest add <component>`, do not edit directly)

**Slot Detail layout** (`SlotDetailLayout.tsx`):
3-column sticky grid: `grid-cols-[240px_1fr_320px]`. Left (`MasterProfileCard`) and right (`FundingWidget`) columns are `position: sticky; top: 81px` (Navbar height). Center is the scrollable main content column.

**Types** (`src/types/`):
- `slot.ts` — `Slot`, `SlotDetail`, `Comment`, `Poll`, `FlavorProfile`
- `funding.ts` — `Reward`, `FundingStatus`, `Order`
- `user.ts` — `Master` (creator/barista profile)

## Design tokens

Custom Tailwind theme (see `tailwind.config.ts`):
- Brand brown: `#75584d` → `brand` / `brand-dark: #5b4137`
- Text: `ink-1` (`#1a1c1e`), `ink-2` (`#444748`), `ink-3` (`#504442`), `ink-muted` (`#857370`)
- Surfaces: `surface` (`#f9f9f9`), `card` (`#ffffff`), `gray-light` (`#f7f7f7`)
- Border: `rgba(211,195,192,0.3)` — use `border-border`
- Border radius: `pill` (9999px), `card` (8px), `inner` (12px)
- Fonts: `font-display` → Manrope, `font-body` → Noto Sans KR
- Dark mode is class-based (`dark:`)

## shadcn usage

**Rule: always prefer shadcn/ui over custom implementations.** Before writing any UI primitive (button, input, progress bar, dialog, badge, avatar, etc.), check if shadcn has an equivalent and use it. Only build a custom component when shadcn has no close match.

Add new components with `npx shadcn@latest add <component>` — never edit files in `components/ui/` directly. Override styles via Tailwind on the consumer side using `data-slot` attribute selectors (e.g. `[&_[data-slot=progress-indicator]]:bg-brand` for Progress fill color, `rounded-pill` on Button for pill shape).

This project uses shadcn v4+ which is built on `@base-ui/react` (not `@radix-ui`). Sub-components expose `data-slot` attributes — use those selectors for style overrides instead of `[&>div]` depth-based selectors.

## Project docs

Work tasks are tracked in `~/practice/coffee-web/project-docs/Tasks/` following the naming convention `YYYYMMDD-[Label]-FeatureName.md` where labels are: `Feature`, `Bug`, `Refactor`, `Design`, `QA`.

## v1.0 scope exclusions

Mobile responsive, login/signup UI, my-page, real PG payment integration, image upload for comments, and automated tests are explicitly out of scope for v1.0.

## Code style

Prettier enforces: no semicolons, double quotes, 2-space indent, 80-col width, Tailwind class sorting. Run `npm run format` before committing.
