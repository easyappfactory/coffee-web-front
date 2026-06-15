import type { OrderStatus } from "@/types/order"

interface ExceptionStatusCardProps {
  status: OrderStatus
}

const EXCEPTION_CONFIG: Partial<Record<OrderStatus, { emoji: string; title: string; description: string }>> = {
  CANCEL_REQUESTED: {
    emoji: "⏳",
    title: "취소 요청 중",
    description: "판매자 확인 후 취소가 진행됩니다.",
  },
  CANCELLED: {
    emoji: "❌",
    title: "주문이 취소되었습니다",
    description: "결제 금액은 자동으로 환불됩니다.",
  },
  RETURN_REQUESTED: {
    emoji: "📦",
    title: "반품 신청 완료",
    description: "판매자 확인 후 수거가 진행됩니다.",
  },
  RETURN_IN_TRANSIT: {
    emoji: "🚚",
    title: "반품 수거 중",
    description: "상품이 판매자에게 돌아가고 있습니다.",
  },
  RETURNED: {
    emoji: "✅",
    title: "반품이 완료되었습니다",
    description: "환불이 처리되었습니다.",
  },
  EXCHANGE_REQUESTED: {
    emoji: "🔄",
    title: "교환 신청 완료",
    description: "판매자 확인 후 교환이 진행됩니다.",
  },
  EXCHANGE_RE_PREPARING: {
    emoji: "📦",
    title: "교환 상품 준비 중",
    description: "새 상품이 준비되고 있습니다.",
  },
  EXCHANGE_IN_TRANSIT: {
    emoji: "🚚",
    title: "교환 상품 배송 중",
    description: "새 상품이 배송되고 있습니다.",
  },
}

export function ExceptionStatusCard({ status }: ExceptionStatusCardProps) {
  const config = EXCEPTION_CONFIG[status]
  if (!config) return null

  return (
    <div className="rounded-xl border bg-white p-6 text-center">
      <div className="text-4xl mb-3">{config.emoji}</div>
      <h3 className="text-lg font-semibold text-[var(--ink-1)] mb-1">{config.title}</h3>
      <p className="text-sm text-[var(--ink-muted)]">{config.description}</p>
    </div>
  )
}
