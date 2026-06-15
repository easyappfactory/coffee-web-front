"use client"

import { CheckCircle } from "lucide-react"
import type { OrderStatus } from "@/types/order"

// coffee-web-front 전용 표시 텍스트
const STEPS = [
  { label: "결제완료", statuses: ["FUNDING_ING", "FUNDING_SUCCESS"] },
  { label: "원두 볶는 중 🔥", statuses: ["PREPARING_ITEM"] },
  { label: "배송 준비중", statuses: ["PREPARING_SHIPPING"] },
  { label: "배송중", statuses: ["WAYBILL_REGISTERED", "IN_TRANSIT"] },
  { label: "배송완료", statuses: ["DELIVERED"] },
  { label: "구매확정", statuses: ["CONFIRMED"] },
] as const

function getStepIndex(status: OrderStatus): number {
  return STEPS.findIndex((step) => (step.statuses as readonly string[]).includes(status))
}

// 정상 흐름에 해당하는 상태인지 체크
const NORMAL_FLOW_STATUSES: string[] = STEPS.flatMap((s) => [...s.statuses])
export function isNormalFlowStatus(status: OrderStatus): boolean {
  return NORMAL_FLOW_STATUSES.includes(status)
}

interface DeliveryProgressBarProps {
  status: OrderStatus
}

export function DeliveryProgressBar({ status }: DeliveryProgressBarProps) {
  const currentIndex = getStepIndex(status)

  return (
    <div className="flex items-start justify-between">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.label} className="flex flex-1 flex-col items-center gap-1.5 relative">
            {/* 연결선 */}
            {index > 0 && (
              <div
                className={`absolute top-3 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                  isCompleted || isCurrent ? "bg-green-400" : "bg-gray-200"
                }`}
                style={{ zIndex: 0 }}
              />
            )}

            {/* 도트/아이콘 */}
            <div className="relative z-10">
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : isCurrent ? (
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-6 w-6 animate-ping rounded-full bg-green-400 opacity-30" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-gray-200" />
                </div>
              )}
            </div>

            {/* 라벨 */}
            <span
              className={`text-center text-[10px] leading-tight ${
                isCurrent
                  ? "font-bold text-green-600"
                  : isCompleted
                    ? "font-medium text-[var(--ink-1)]"
                    : "text-gray-300"
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
