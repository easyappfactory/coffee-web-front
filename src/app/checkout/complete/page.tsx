"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, CalendarDays, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCheckoutStore } from "@/store/checkoutStore"
import { getOrder } from "@/lib/api"
import type { Order } from "@/types/funding"

const PAYMENT_LABEL: Record<string, string> = {
  card: "신용 / 체크카드",
  bank: "계좌이체",
  simple: "간편결제",
  point: "포인트 결제",
}

export default function CheckoutCompletePage() {
  const router = useRouter()
  const { orderId, reset } = useCheckoutStore()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.replace("/feed")
      return
    }
    getOrder(orderId).then(setOrder)
  }, [orderId, router])

  if (!order) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center text-ink-muted">
          로딩 중...
        </div>
      </main>
    )
  }

  const grandTotal = order.totalPrice + order.shippingFee

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[640px] px-6 pb-24 pt-16">

        {/*
         * [TODO: 백엔드 연동]
         * 이 페이지는 TossPay 결제 완료 콜백 이후 진입하는 화면입니다.
         * 실제 연동 시 TossPay successUrl 로 이 경로(/checkout/complete)를 지정하고,
         * URL 파라미터(paymentKey, orderId, amount)를 받아 서버 사이드에서 결제 승인을 처리하세요.
         *
         * 참고: https://docs.tosspayments.com/guides/payment-widget/integration
         */}

        {/* ⚠️ 개발 중 안내 */}
        <div className="mb-8 flex items-start gap-3 rounded-inner border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 text-base leading-none">🚧</span>
          <p className="text-[13px] leading-relaxed text-amber-800">
            <span className="font-bold">임시 완료 화면입니다.</span> TossPay 연동 후 결제 승인
            처리가 추가될 예정입니다.
          </p>
        </div>

        {/* 완료 배너 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-[26px] font-bold text-ink-1">펀딩 참여 완료!</h1>
          <p className="mt-2 text-sm text-ink-muted">
            소중한 참여 감사해요. 마스터가 직접 준비한 원두를 곧 만나보실 수 있어요.
          </p>
        </div>

        {/* 주문 상세 */}
        <div className="rounded-card border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
              주문 상세
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-border">
            {[
              { label: "주문번호", val: order.id },
              { label: "슬롯", val: order.slotTitle },
              { label: "리워드", val: order.rewardLabel },
              {
                label: "결제금액",
                val: `${grandTotal.toLocaleString()}원`,
                highlight: true,
              },
              {
                label: "결제수단",
                val: PAYMENT_LABEL[order.paymentMethod ?? "card"] ?? order.paymentMethod,
              },
            ].map(({ label, val, highlight }) => (
              <div key={label} className="flex items-start justify-between gap-4 px-6 py-4">
                <span className="shrink-0 text-[13px] text-ink-muted">{label}</span>
                <span
                  className={`text-right text-[13px] ${
                    highlight
                      ? "font-display font-extrabold text-brand"
                      : "font-medium text-ink-1"
                  }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 배송 안내 */}
        <div className="mt-5 rounded-card border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
              배송 안내
            </h2>
          </div>
          <div className="space-y-4 px-6 py-5">
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 shrink-0 text-brand" />
              <p className="text-[13px] text-ink-2">
                펀딩 마감 후 마스터가 직접 로스팅하여 발송합니다.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 shrink-0 text-brand" />
              <p className="text-[13px] text-ink-2">
                예상 발송일:{" "}
                <span className="font-semibold text-ink-1">{order.estimatedDelivery}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            render={<Link href={`/slot/${order.slotId}`} />}
            className="w-full rounded-card py-4 font-display text-[15px] font-bold bg-brand text-white hover:bg-brand-dark"
          >
            슬롯으로 돌아가기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-card py-4 font-display text-[15px] font-semibold"
            onClick={() => {
              reset()
              router.push("/feed")
            }}
          >
            슬롯 피드 보기
          </Button>
        </div>
      </div>
    </main>
  )
}
