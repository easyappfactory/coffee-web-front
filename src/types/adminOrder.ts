export type SlotPhase = "PRE" | "FUNDING" | "PENDING" | "FAILED" | "OPERATING" | "CLOSED"

export interface Courier {
  code: string
  name: string
}

export type AdminOrderTab = "all" | "funding" | "pre" | "post" | "cancel" | "exchange"

export interface AdminSlot {
  slotId: string
  productId: string
  name: string
  phase: SlotPhase
  phaseLabel: string
  deadline: string
  thumbnailUrl: string | null
}

export interface AdminOrder {
  orderId: string
  orderNo: string
  orderedAt: string
  receiverName: string | null
  receiverPhone: string | null
  zipcode: string | null
  address: string | null
  addressDetail: string | null
  productName: string
  optionSummary: string | null
  quantity: number
  payAmount: number
  memo: string | null
  courier: string | null
  trackingNumber: string | null
  hasTracking: boolean
  deliveryStatus: string
  sellerDisplay: string
}

export interface AdminSlotSummary {
  slotId: string
  phase: SlotPhase
  phaseLabel: string
  totalCount: number
  fundingCount: number
  preCount: number
  postCount: number
  cancelCount: number
  exchangeCount: number
  revenue: number
  deadline: string
}

// 번호형(offset) 페이지 — 백엔드 AdminOrderPageResponse 와 1:1
export interface AdminOrderPage {
  orders: AdminOrder[]
  page: number
  size: number
  totalCount: number
  totalPages: number
}

// 슬롯 펀딩 상태 — GET /admin/slots/{slotId}/funding-status
export interface SlotFundingStatus {
  slotId: string
  phase: SlotPhase
  phaseLabel: string
  currentAmount: number
  minAmount: number
  maxAmount: number | null
  deadline: string
  minReached: boolean
  maxReached: boolean
  deadlineReached: boolean
  isTerminatable: boolean
  canConfirm: boolean
  canFail: boolean
}

// (다음 슬라이스에서 사용) 송장 일괄등록 미리보기
export interface InvoiceMatchRow {
  orderNo: string
  matched: boolean
  valid: boolean
  reason: string | null
  orderId: string | null
  receiverName: string | null
  courier: string | null
  trackingNumber: string | null
}
export interface InvoiceMatchPreview {
  rows: InvoiceMatchRow[]
  okCount: number
  badCount: number
}

export interface TrackingEvent {
  time: string
  location: string
  description: string
}

export interface TrackingInfo {
  carrierName: string
  trackingNumber: string
  status: string
  tracks: TrackingEvent[]
}
