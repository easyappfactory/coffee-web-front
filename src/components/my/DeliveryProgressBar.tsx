"use client"

import dynamic from "next/dynamic"
import {
  CheckCircle,
  CreditCard,
  Flame,
  Package,
  Truck,
  PackageCheck,
  ThumbsUp,
} from "lucide-react"
import type { OrderStatus } from "@/types/order"
import type { LucideIcon } from "lucide-react"

// Lottie는 CSR 전용 — SSR에서 window 참조 에러 방지
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// coffee-web-front 전용 표시 텍스트 + 아이콘 + Lottie 경로
const STEPS: {
  label: string
  icon: LucideIcon
  lottie: string
  statuses: readonly string[]
}[] = [
  { label: "결제완료", icon: CreditCard, lottie: "/lottie/step-payment.json", statuses: ["FUNDING_ING", "FUNDING_SUCCESS"] },
  { label: "원두 볶는 중", icon: Flame, lottie: "/lottie/step-roasting.json", statuses: ["PREPARING_ITEM"] },
  { label: "배송 준비중", icon: Package, lottie: "/lottie/step-preparing.json", statuses: ["PREPARING_SHIPPING"] },
  { label: "배송중", icon: Truck, lottie: "/lottie/step-shipping.json", statuses: ["WAYBILL_REGISTERED", "IN_TRANSIT"] },
  { label: "배송완료", icon: PackageCheck, lottie: "/lottie/step-delivered.json", statuses: ["DELIVERED"] },
  { label: "구매확정", icon: ThumbsUp, lottie: "/lottie/step-confirmed.json", statuses: ["CONFIRMED"] },
]

function getStepIndex(status: OrderStatus): number {
  return STEPS.findIndex((step) => step.statuses.includes(status))
}

// 정상 흐름에 해당하는 상태인지 체크
const NORMAL_FLOW_STATUSES: string[] = STEPS.flatMap((s) => [...s.statuses])
export function isNormalFlowStatus(status: OrderStatus): boolean {
  return NORMAL_FLOW_STATUSES.includes(status)
}

interface DeliveryProgressBarProps {
  status: OrderStatus
}

// Lottie JSON 캐시 (같은 파일 재요청 방지)
const lottieCache: Record<string, object | null> = {}

export function DeliveryProgressBar({ status }: DeliveryProgressBarProps) {
  const currentIndex = getStepIndex(status)

  return (
    <div className="flex items-start justify-between">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const Icon = step.icon

        return (
          <div key={step.label} className="flex flex-1 flex-col items-center gap-1.5 relative">
            {/* 연결선 */}
            {index > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                  isCompleted || isCurrent ? "bg-green-400" : "bg-gray-200"
                }`}
                style={{ zIndex: 0 }}
              />
            )}

            {/* 아이콘 */}
            <div className="relative z-10">
              {isCompleted ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ) : isCurrent ? (
                <CurrentStepLottie lottie={step.lottie} fallbackIcon={Icon} />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-300" />
                </div>
              )}
            </div>

            {/* 라벨 */}
            <span
              className={`text-center text-[10px] leading-tight max-w-[56px] ${
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

// 현재 단계: Lottie 애니메이션 + 글로우 배경
import { useEffect, useState } from "react"

function CurrentStepLottie({ lottie: lottiePath, fallbackIcon: Icon }: { lottie: string; fallbackIcon: LucideIcon }) {
  const [animationData, setAnimationData] = useState<object | null>(lottieCache[lottiePath] ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (animationData) return
    if (lottieCache[lottiePath] !== undefined) {
      setAnimationData(lottieCache[lottiePath])
      return
    }

    fetch(lottiePath)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed")
        return res.json()
      })
      .then((data) => {
        lottieCache[lottiePath] = data
        setAnimationData(data)
      })
      .catch(() => {
        lottieCache[lottiePath] = null
        setFailed(true)
      })
  }, [lottiePath, animationData])

  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      {/* 글로우 링 */}
      <div className="absolute h-10 w-10 animate-ping rounded-full bg-green-400 opacity-15" />
      <div className="absolute h-10 w-10 animate-pulse rounded-full bg-green-50" />

      {animationData && !failed ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          className="relative h-8 w-8"
        />
      ) : (
        /* Lottie 로딩 전 또는 실패 시 Lucide 아이콘 바운스 */
        <Icon className="relative h-5 w-5 text-green-600 animate-bounce" style={{ animationDuration: "2s" }} />
      )}
    </div>
  )
}
