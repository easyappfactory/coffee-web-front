"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCheckoutStore } from "@/store/checkoutStore"

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? ""

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    orderId,
    amount,
    orderName,
    slotId,
    slotTitle,
    slotThumbnail,
    masterName,
    selectedReward,
  } = useCheckoutStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [widgets, setWidgets] = useState<any>(null)
  const [widgetReady, setWidgetReady] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const isFail = searchParams.get("fail") === "true"

  useEffect(() => {
    if (!orderId || !amount) {
      router.replace("/feed")
      return
    }

    let mounted = true

    async function initWidget() {
      const { loadTossPayments, ANONYMOUS } = await import("@tosspayments/tosspayments-sdk")
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
      const w = tossPayments.widgets({ customerKey: ANONYMOUS })

      await w.setAmount({ currency: "KRW", value: amount })
      if (!mounted) return

      await Promise.all([
        w.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        w.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ])

      if (mounted) {
        setWidgets(w)
        setWidgetReady(true)
      }
    }

    initWidget()
    return () => {
      mounted = false
    }
  }, [orderId, amount, router])

  if (!orderId || !amount) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center text-ink-muted">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </div>
      </main>
    )
  }

  async function handlePay() {
    if (!widgets || isPaying) return
    setIsPaying(true)
    try {
      await widgets.requestPayment({
        orderId: orderId!,
        orderName,
        successUrl: `${window.location.origin}/checkout/complete`,
        failUrl: `${window.location.origin}/checkout?fail=true`,
      })
    } catch {
      // 사용자 취소 또는 오류 — 위젯이 자체 처리
      setIsPaying(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[640px] px-6 pb-24">
        <Link
          href={`/slot/${slotId}`}
          className="inline-flex items-center gap-1.5 pb-1 pt-5 font-display text-[13px] font-medium text-ink-muted transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" />
          슬롯으로 돌아가기
        </Link>

        <h1 className="mt-4 font-display text-2xl font-bold text-ink-1">결제하기</h1>

        {isFail && (
          <div className="mt-5 rounded-inner border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-[13px] font-medium text-red-700">
              결제가 취소되었거나 오류가 발생했습니다. 다시 시도해 주세요.
            </p>
          </div>
        )}

        {/* 주문 요약 */}
        <section className="mt-6 rounded-card border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
              주문 상품
            </h2>
          </div>
          <div className="flex gap-4 p-6">
            <div className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-inner bg-surface">
              {slotThumbnail && (
                <Image
                  src={slotThumbnail}
                  alt={slotTitle}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
                {masterName}
              </p>
              <p className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-1">
                {slotTitle}
              </p>
            </div>
          </div>

          {selectedReward && (
            <div className="mx-6 mb-6 rounded-inner border border-brand/20 bg-brand/[0.04] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-ink-1">
                    {selectedReward.label}
                  </p>
                  {selectedReward.description && (
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      {selectedReward.description}
                    </p>
                  )}
                </div>
                <span className="font-display text-base font-extrabold text-brand">
                  {selectedReward.price.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-border px-6 py-5">
            <div className="flex justify-between">
              <span className="font-display text-[15px] font-bold text-ink-1">최종 결제금액</span>
              <span className="font-display text-[18px] font-extrabold text-brand">
                {amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        {/* Toss 결제수단 위젯 */}
        <section className="mt-5">
          <div id="payment-method">
            {!widgetReady && (
              <div className="flex items-center justify-center rounded-card border border-border bg-card py-12">
                <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
              </div>
            )}
          </div>
        </section>

        {/* Toss 약관 동의 위젯 */}
        <section className="mt-3">
          <div id="agreement" />
        </section>

        {/* 결제 버튼 */}
        <div className="mt-6">
          <Button
            onClick={handlePay}
            disabled={!widgetReady || isPaying}
            className="w-full rounded-card py-5 font-display text-[16px] font-bold tracking-[0.02em] bg-brand text-white hover:bg-brand-dark"
          >
            {isPaying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {amount.toLocaleString()}원 결제하기
          </Button>
          <p className="mt-3 text-center text-[11px] text-ink-muted">
            결제 완료 후 취소는 마이페이지에서 가능합니다
          </p>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
