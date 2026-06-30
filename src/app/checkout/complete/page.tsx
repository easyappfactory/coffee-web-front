"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2,
  Package,
  CalendarDays,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCheckoutStore } from "@/store/checkoutStore"
import { confirmPayment } from "@/lib/api"

type ConfirmResult = Awaited<ReturnType<typeof confirmPayment>>

function CheckoutCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { slotId, slotTitle, selectedReward, reset } = useCheckoutStore()

  const [result, setResult] = useState<ConfirmResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const paymentKey = searchParams.get("paymentKey") ?? ""
  const orderId = searchParams.get("orderId") ?? ""
  const amount = Number(searchParams.get("amount") ?? "0")

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      router.replace("/feed")
      return
    }

    confirmPayment(
      paymentKey, orderId, amount,
    )
      .then(setResult)
      .catch((err) => {
        const msg =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any)?.response?.data?.message ?? "결제 승인에 실패했습니다."
        setError(msg)
      })
    // intentionally empty deps — run only on mount with captured param values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-xl font-bold text-ink-1">결제 승인 실패</h1>
          <p className="mt-2 text-sm text-ink-muted">{error}</p>
          <Button
            className="mt-8 rounded-card bg-brand px-8 py-3 font-display font-bold text-white hover:bg-brand-dark"
            onClick={() => router.replace("/feed")}
          >
            피드로 돌아가기
          </Button>
        </div>
      </main>
    )
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center text-ink-muted">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-3 text-sm">결제 승인 중...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[640px] px-6 pb-24 pt-16">
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
          <div className="divide-y divide-border">
            {(
              [
                { label: "주문번호", val: result?.publicOrderNumber ?? "-" },
                { label: "슬롯", val: result?.orderName || slotTitle || "-" },
                { label: "리워드", val: selectedReward?.label ?? "-" },
                {
                  label: "결제금액",
                  val: `${result?.amount?.toLocaleString() ?? 0}원`,
                  highlight: true,
                },
                { label: "상태", val: result?.status ?? "-" },
              ] as const
            ).map(({ label, val, ...rest }) => (
              <div key={label} className="flex items-start justify-between gap-4 px-6 py-4">
                <span className="shrink-0 text-[13px] text-ink-muted">{label}</span>
                <span
                  className={`text-right text-[13px] ${
                    "highlight" in rest && rest.highlight
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
                <span className="font-semibold text-ink-1">펀딩 마감 후 7~14일 이내</span>
              </p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            render={<Link href={`/slot/${slotId}`} />}
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

export default function CheckoutCompletePage() {
  return (
    <Suspense>
      <CheckoutCompleteContent />
    </Suspense>
  )
}
