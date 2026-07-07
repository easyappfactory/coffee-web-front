export interface OrderSummary {
  id: string
  publicOrderNumber: string
  status: OrderStatus
  statusBuyerDisplay: string
  statusSellerDisplay: string
  isAddressEditable: boolean
  payAmount: number
  itemCount: number
  representativeItemName: string
  representativeProductId: string | null
  representativeVariantId: string | null
  representativeOptionSummary: string | null
  createdAt: string
}

export interface OrderDetail {
  id: string
  publicOrderNumber: string
  status: OrderStatus
  statusBuyerDisplay: string
  statusSellerDisplay: string
  isAddressEditable: boolean
  paymentStatus: string
  paymentMethod: string | null
  items: OrderItem[]
  totalAmount: number
  shippingFee: number
  payAmount: number
  cancelledAmount: number
  finalPayAmount: number
  shippingAddress: ShippingAddressInfo | null
  trackingNumber: string | null
  carrierCode: string | null
  carrierName: string | null
  exchangeTrackingNumber: string | null
  paidAt: string | null
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  productName: string
  optionSummary: string
  unitPrice: number
  quantity: number
  subtotal: number
  cancelStatus: string
}

export interface ShippingAddressInfo {
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string | null
  zipcode: string
}

export type OrderStatus =
  | "FUNDING_ING"
  | "FUNDING_SUCCESS"
  | "PREPARING_ITEM"
  | "PREPARING_SHIPPING"
  | "WAYBILL_REGISTERED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CONFIRMED"
  | "CANCEL_REQUESTED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURN_IN_TRANSIT"
  | "RETURNED"
  | "EXCHANGE_REQUESTED"
  | "EXCHANGE_RE_PREPARING"
  | "EXCHANGE_IN_TRANSIT"

export interface CursorMeta {
  nextCursor: string | null
  hasNext: boolean
  reqSize: number
  resCount: number
}

export interface CursorPageResponse<T> {
  success: boolean
  code: string
  message: string
  data: T[]
  meta: CursorMeta
}

export interface TrackingResponse {
  carrierName: string
  trackingNumber: string
  status: string
  tracks: TrackingEvent[]
}

export interface TrackingEvent {
  time: string
  location: string
  description: string
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  FUNDING_ING: "펀딩 참여 중",
  FUNDING_SUCCESS: "펀딩 성공",
  PREPARING_ITEM: "상품 제작/준비 중",
  PREPARING_SHIPPING: "배송 준비 중",
  WAYBILL_REGISTERED: "배송 시작",
  IN_TRANSIT: "배송 중",
  DELIVERED: "배송 완료",
  CONFIRMED: "구매 확정",
  CANCEL_REQUESTED: "취소 요청 중",
  CANCELLED: "취소 완료",
  RETURN_REQUESTED: "반품 신청",
  RETURN_IN_TRANSIT: "반품 수거 중",
  RETURNED: "반품 완료",
  EXCHANGE_REQUESTED: "교환 신청",
  EXCHANGE_RE_PREPARING: "교환 준비 중",
  EXCHANGE_IN_TRANSIT: "교환 배송 중",
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  FUNDING_ING: "bg-blue-100 text-blue-700",
  FUNDING_SUCCESS: "bg-green-100 text-green-700",
  PREPARING_ITEM: "bg-yellow-100 text-yellow-700",
  PREPARING_SHIPPING: "bg-yellow-100 text-yellow-700",
  WAYBILL_REGISTERED: "bg-indigo-100 text-indigo-700",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CONFIRMED: "bg-gray-100 text-gray-600",
  CANCEL_REQUESTED: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURN_REQUESTED: "bg-orange-100 text-orange-700",
  RETURN_IN_TRANSIT: "bg-orange-100 text-orange-700",
  RETURNED: "bg-red-100 text-red-700",
  EXCHANGE_REQUESTED: "bg-purple-100 text-purple-700",
  EXCHANGE_RE_PREPARING: "bg-purple-100 text-purple-700",
  EXCHANGE_IN_TRANSIT: "bg-purple-100 text-purple-700",
}
