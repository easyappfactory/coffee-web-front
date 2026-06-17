"use client"

import { OrderStatusBadge } from "@/components/my/OrderStatusBadge"
import { DeliveryProgressBar, isNormalFlowStatus } from "@/components/my/DeliveryProgressBar"
import { ExceptionStatusCard } from "@/components/my/ExceptionStatusCard"
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types/order"

// types/order.ts 의 OrderStatus 전체 — 선언 순서대로
const ALL_STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]

export default function OrderStatusDemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--ink-1)]">
          주문/배송 상태 데모
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          OrderStatus 값별로 소비자 화면에 어떻게 렌더링되는지 모아본 페이지입니다.
          정상 흐름은 <strong>배송 진행 바</strong>, 예외 상태는{" "}
          <strong>예외 상태 카드</strong>로 표시됩니다. (총 {ALL_STATUSES.length}개)
        </p>
      </header>

      <div className="space-y-4">
        {ALL_STATUSES.map((status) => {
          const isNormal = isNormalFlowStatus(status)
          return (
            <section
              key={status}
              className="rounded-xl border bg-white p-5"
            >
              {/* 상태 헤더: 코드 + 한글 라벨 + 배지 */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <code className="text-xs font-mono text-[var(--ink-muted)]">
                    {status}
                  </code>
                  <p className="text-sm font-semibold text-[var(--ink-1)]">
                    {ORDER_STATUS_LABEL[status]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      isNormal
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {isNormal ? "정상 흐름" : "예외 상태"}
                  </span>
                  <OrderStatusBadge status={status} />
                </div>
              </div>

              {/* 실제 렌더링 결과 */}
              {isNormal ? (
                <DeliveryProgressBar status={status} />
              ) : (
                <ExceptionStatusCard status={status} />
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
