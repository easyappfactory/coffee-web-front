"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { format } from "date-fns"
import { useOrderDetail } from "@/hooks/useOrders"
import { OrderStatusBadge } from "@/components/my/OrderStatusBadge"
import { DeliveryProgressBar, isNormalFlowStatus } from "@/components/my/DeliveryProgressBar"
import { ExceptionStatusCard } from "@/components/my/ExceptionStatusCard"
import { TrackingModal } from "@/components/my/TrackingModal"
import { Skeleton } from "@/components/ui/skeleton"
import type { OrderStatus } from "@/types/order"

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()
  const { data: order, isLoading } = useOrderDetail(orderId)
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function copyTracking() {
    if (!order?.trackingNumber) return
    navigator.clipboard?.writeText(order.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[var(--ink-muted)]">
        주문을 찾을 수 없습니다
      </div>
    )
  }

  const status = order.status as OrderStatus
  const isNormal = isNormalFlowStatus(status)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* 헤더 */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-[var(--ink-muted)] hover:text-[var(--ink-1)]"
      >
        ← 주문내역
      </button>
      <h1 className="mb-6 text-2xl font-bold text-[var(--ink-1)]">주문 상세</h1>

      {/* 배송 진행 상태 바 (정상 흐름) or 예외 상태 카드 */}
      {isNormal ? (
        <section className="mb-4 rounded-xl border bg-white p-5">
          <DeliveryProgressBar status={status} />
        </section>
      ) : (
        <section className="mb-4">
          <ExceptionStatusCard status={status} />
        </section>
      )}

      {/* 주문 기본 정보 */}
      <section className="mb-4 rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-[var(--ink-muted)]">주문 정보</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--ink-muted)]">주문번호</span>
            <span className="font-medium">{order.publicOrderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-muted)]">주문일시</span>
            <span>{format(new Date(order.createdAt), "yyyy.MM.dd HH:mm")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--ink-muted)]">주문상태</span>
            <OrderStatusBadge status={status} />
          </div>
        </div>
      </section>

      {/* 배송 정보 (운송장 등록 시에만) */}
      {order.trackingNumber && (
        <section className="mb-4 rounded-xl border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ink-muted)]">배송 정보</h2>
            <button
              onClick={() => setTrackingOpen(true)}
              className="rounded-lg border border-[var(--d-brown)] px-3 py-1.5 text-xs font-semibold text-[var(--d-brown)] transition-colors hover:bg-[var(--d-brown)] hover:text-white"
            >
              배송정보 보기
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">택배사</span>
              <span className="font-medium">{order.carrierName ?? order.carrierCode ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--ink-muted)]">운송장번호</span>
              <span className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyTracking}
                  title="클릭하면 복사됩니다"
                  className="font-medium tabular-nums text-[var(--ink-1)] underline-offset-2 hover:underline"
                >
                  {order.trackingNumber}
                </button>
                <button
                  type="button"
                  onClick={copyTracking}
                  title="송장번호 복사"
                  aria-label="송장번호 복사"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--d-brown)]"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 주문 상품 */}
      <section className="mb-4 rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-[var(--ink-muted)]">주문 상품</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
                ☕
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-[var(--ink-1)]">{item.productName}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {item.optionSummary} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold">{item.subtotal.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </section>

      {/* 결제 정보 */}
      <section className="mb-4 rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-[var(--ink-muted)]">결제 정보</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--ink-muted)]">총 상품금액</span>
            <span>{order.totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-muted)]">배송비</span>
            <span>{order.shippingFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-muted)]">결제금액</span>
            <span>{order.payAmount.toLocaleString()}원</span>
          </div>
          {order.cancelledAmount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>취소금액</span>
              <span>-{order.cancelledAmount.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>실결제금액</span>
            <span>{order.finalPayAmount.toLocaleString()}원</span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">결제수단</span>
              <span>{order.paymentMethod}</span>
            </div>
          )}
          {order.paidAt && (
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">결제일시</span>
              <span>{format(new Date(order.paidAt), "yyyy.MM.dd HH:mm")}</span>
            </div>
          )}
        </div>
      </section>

      {/* 배송지 정보 */}
      {order.shippingAddress && (
        <section className="mb-4 rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--ink-muted)]">배송지 정보</h2>
            {order.isAddressEditable && (
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">배송지 변경</button>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">수령인</span>
              <span>{order.shippingAddress.receiverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">연락처</span>
              <span>{order.shippingAddress.receiverPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">주소</span>
              <span className="text-right">
                {order.shippingAddress.address}
                {order.shippingAddress.addressDetail && ` ${order.shippingAddress.addressDetail}`}{" "}
                ({order.shippingAddress.zipcode})
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 배송추적 모달 */}
      {order.trackingNumber && (
        <TrackingModal
          open={trackingOpen}
          onClose={() => setTrackingOpen(false)}
          orderId={orderId}
          trackingNumber={order.trackingNumber}
        />
      )}
    </div>
  )
}
