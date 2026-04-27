"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, CreditCard, Building2, Zap, Coins, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCheckoutStore } from "@/store/checkoutStore"
import { getOrder, processPayment } from "@/lib/api"
import type { Order } from "@/types/funding"

const PAYMENT_METHODS = [
  { id: "card", label: "신용 / 체크카드", icon: CreditCard },
  { id: "bank", label: "계좌이체", icon: Building2 },
  { id: "simple", label: "간편결제", icon: Zap },
  { id: "point", label: "포인트 결제", icon: Coins },
] as const

export default function CheckoutPage() {
  const router = useRouter()
  const { orderId, selectedReward, paymentMethod, setPaymentMethod } = useCheckoutStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {
    if (!orderId) {
      router.replace("/feed")
      return
    }
    getOrder(orderId).then(setOrder)
  }, [orderId, router])

  if (!orderId || !order) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center text-ink-muted">
          로딩 중...
        </div>
      </main>
    )
  }

  const shippingFee = order.shippingFee
  const grandTotal = order.totalPrice + shippingFee

  async function handlePay() {
    if (!orderId || !agreed || isPaying) return
    setIsPaying(true)
    try {
      await processPayment(orderId, paymentMethod)
      router.push("/checkout/complete")
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[640px] px-6 pb-24">
        <Link
          href={`/slot/${order.slotId}`}
          className="inline-flex items-center gap-1.5 pb-1 pt-5 font-display text-[13px] font-medium text-ink-muted transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" />
          슬롯으로 돌아가기
        </Link>

        <h1 className="mt-4 font-display text-2xl font-bold text-ink-1">결제하기</h1>

        {/*
         * [TODO: 백엔드 연동]
         * 결제수단 선택 UI 및 약관 동의 섹션은 임시 플레이스홀더입니다.
         * TossPay SDK 연동 시 아래 "결제수단" · "약관 동의" · "결제 버튼" 섹션을
         * TossPay에서 제공하는 결제 위젯(PaymentWidget)으로 교체하세요.
         *
         * 연동 흐름:
         *   1. POST /api/orders → orderId 수신 (이미 완료)
         *   2. TossPay PaymentWidget.requestPayment({ orderId, amount, ... })
         *   3. 결제 성공 콜백 → PATCH /api/orders/{orderId}/payment
         *   4. router.push("/checkout/complete")
         */}

        {/* ⚠️ 개발 중 안내 */}
        <div className="mt-5 flex items-start gap-3 rounded-inner border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 text-base leading-none">🚧</span>
          <p className="text-[13px] leading-relaxed text-amber-800">
            <span className="font-bold">임시 결제 화면입니다.</span> 결제수단 선택 영역은 TossPay
            SDK 연동 후 토스페이 제공 위젯으로 교체될 예정입니다.
          </p>
        </div>

        {/* 주문 요약 */}
        <section className="mt-6 rounded-card border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
              주문 상품
            </h2>
          </div>
          <div className="flex gap-4 p-6">
            <div className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-inner bg-surface">
              {order.slotThumbnail && (
                <Image
                  src={order.slotThumbnail}
                  alt={order.slotTitle}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
                {order.masterName}
              </p>
              <p className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-1">
                {order.slotTitle}
              </p>
            </div>
          </div>

          {/* 리워드 */}
          <div className="mx-6 mb-6 rounded-inner border border-brand/20 bg-brand/[0.04] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm font-bold text-ink-1">{order.rewardLabel}</p>
                {order.rewardDescription && (
                  <p className="mt-0.5 text-[12px] text-ink-muted">{order.rewardDescription}</p>
                )}
              </div>
              <span className="font-display text-base font-extrabold text-brand">
                {order.unitPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 금액 내역 */}
          <div className="space-y-2.5 border-t border-border px-6 py-5">
            {[
              { label: "상품 금액", val: `${order.totalPrice.toLocaleString()}원` },
              { label: "배송비", val: shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-[13px]">
                <span className="text-ink-muted">{row.label}</span>
                <span className="font-medium text-ink-1">{row.val}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-3">
              <span className="font-display text-[15px] font-bold text-ink-1">최종 결제금액</span>
              <span className="font-display text-[18px] font-extrabold text-brand">
                {grandTotal.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        {/* 결제수단 */}
        <section className="mt-5 rounded-card border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
              결제수단
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-6">
            {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
              const selected = paymentMethod === id
              return (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id as "card" | "bank" | "simple" | "point")}
                  className={`flex items-center gap-3 rounded-inner border px-4 py-3.5 text-left transition-all ${
                    selected
                      ? "border-brand bg-brand/5"
                      : "border-border bg-card hover:border-brand/40"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${selected ? "text-brand" : "text-ink-muted"}`}
                  />
                  <span
                    className={`font-display text-[13px] font-semibold ${
                      selected ? "text-brand" : "text-ink-2"
                    }`}
                  >
                    {label}
                  </span>
                  {selected && (
                    <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-brand" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* 약관 동의 */}
        <section className="mt-5 rounded-card border border-border bg-card px-6 py-5 shadow-sm">
          <button
            onClick={() => setAgreed((p) => !p)}
            className="flex w-full items-center gap-3 text-left"
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                agreed ? "border-brand bg-brand" : "border-border"
              }`}
            >
              {agreed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
            <span className="text-[13px] font-medium text-ink-2">
              주문 내용을 확인하였으며, 결제에 동의합니다.
            </span>
          </button>
        </section>

        {/* 결제 버튼 */}
        <div className="mt-6">
          <Button
            onClick={handlePay}
            disabled={!agreed || isPaying}
            className="w-full rounded-card py-5 font-display text-[16px] font-bold tracking-[0.02em] bg-brand text-white hover:bg-brand-dark"
          >
            {isPaying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {grandTotal.toLocaleString()}원 결제하기
          </Button>
          <p className="mt-3 text-center text-[11px] text-ink-muted">
            결제 완료 후 취소는 마이페이지에서 가능합니다
          </p>
        </div>
      </div>
    </main>
  )
}
