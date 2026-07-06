export type MySlotPhase = "FUNDING" | "PENDING" | "OPERATING"

export interface MySlotFunding {
  currentAmount: number
  targetAmount: number
  percent: number
}

export interface MySlotActivity {
  lastPostAt: string | null // ISO Instant. null = 글 없음
  recentPostCount: number // 최근 72h 새 글 수
  hasRecentActivity: boolean
}

export interface MySlot {
  slotId: string
  productId: string
  title: string
  thumbnailUrl: string | null
  phase: MySlotPhase
  phaseLabel: string // "펀딩 중" | "최종 확정 대기" | "운영 중"
  deadline: string // YYYY-MM-DD
  funding: MySlotFunding
  activity: MySlotActivity
}
