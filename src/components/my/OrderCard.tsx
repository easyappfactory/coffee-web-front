"use client"

import Link from "next/link"
import { format } from "date-fns"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { OrderSummary, OrderStatus } from "@/types/order"

interface OrderCardProps {
  order: OrderSummary
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/my/orders/${order.id}`}>
      <div className="rounded-xl border bg-white p-4 transition hover:shadow-sm">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--ink-1)]">
            {format(new Date(order.createdAt), "yyyy.MM.dd")}
          </span>
          <span className="text-xs text-[var(--ink-muted)]">{order.publicOrderNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
            ☕
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[var(--ink-1)]">
              {order.representativeItemName}
            </p>
            {order.representativeOptionSummary && (
              <p className="text-xs text-[var(--ink-muted)]">{order.representativeOptionSummary}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold text-[var(--ink-1)]">
              {order.payAmount.toLocaleString()}원
            </span>
            <OrderStatusBadge status={order.status as OrderStatus} />
          </div>
        </div>
      </div>
    </Link>
  )
}
