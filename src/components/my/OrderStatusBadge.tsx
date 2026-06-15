import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, type OrderStatus } from "@/types/order"

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_COLOR[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
