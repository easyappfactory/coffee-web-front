"use client"

import Link from "next/link"
import { differenceInCalendarDays, formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import type { MySlot, MySlotPhase } from "@/types/mySlot"

const PHASE_STYLE: Record<MySlotPhase, { badge: string; bar: string; pct: string }> = {
  FUNDING: { badge: "bg-blue-100 text-blue-700", bar: "bg-blue-500", pct: "text-blue-700" },
  PENDING: { badge: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-500", pct: "text-yellow-700" },
  OPERATING: { badge: "bg-green-100 text-green-700", bar: "bg-green-500", pct: "text-green-700" },
}

interface MySlotCardProps {
  slot: MySlot
}

export function MySlotCard({ slot }: MySlotCardProps) {
  const style = PHASE_STYLE[slot.phase]
  const showFunding = slot.phase === "FUNDING" || slot.phase === "PENDING"
  // deadline("YYYY-MM-DD")은 로컬 자정 기준으로 파싱(UTC 파싱 footgun 회피)
  const [dy, dm, dd] = slot.deadline.split("-").map(Number)
  const dday = differenceInCalendarDays(new Date(dy, dm - 1, dd), new Date())
  const relativeText =
    slot.activity.lastPostAt != null
      ? formatDistanceToNow(new Date(slot.activity.lastPostAt), { addSuffix: true, locale: ko })
      : ""

  return (
    <div className="relative rounded-xl border bg-white p-4 transition hover:shadow-sm">
      {slot.activity.hasRecentActivity && (
        <span
          role="img"
          aria-label="새 활동"
          className="absolute right-4 top-4 h-2 w-2 rounded-full bg-red-500"
        />
      )}

      {/* 본문: 슬롯 상세로 이동 */}
      <Link href={`/slot/${slot.slotId}`} className="flex items-start gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-2xl">
          {slot.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.thumbnailUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            "☕"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-[var(--ink-1)]">{slot.title}</p>
            <span
              className={`inline-block flex-shrink-0 rounded px-2 py-0.5 text-xs font-medium ${style.badge}`}
            >
              {slot.phaseLabel}
            </span>
          </div>
          {slot.phase === "FUNDING" && (
            <p className="mt-0.5 text-xs text-[var(--ink-muted)]">마감 D-{Math.max(dday, 0)}</p>
          )}

          {showFunding ? (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-pill bg-gray-100">
                <div
                  className={`h-full rounded-pill ${style.bar}`}
                  style={{ width: `${Math.min(Math.max(slot.funding.percent, 0), 100)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-[var(--ink-muted)]">
                <span>
                  {slot.funding.currentAmount.toLocaleString()} / {slot.funding.targetAmount.toLocaleString()}원
                </span>
                <span className={`font-semibold ${style.pct}`}>{slot.funding.percent}%</span>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-ink-2">운영 중</p>
          )}
        </div>
      </Link>

      {/* 커뮤니티 스트립 */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2 text-xs">
          {slot.activity.recentPostCount > 0 ? (
            <>
              <span className="font-medium text-brand">💬 새 글 {slot.activity.recentPostCount}</span>
              {slot.activity.lastPostAt != null && (
                <span className="text-[var(--ink-muted)]">· {relativeText}</span>
              )}
            </>
          ) : slot.activity.lastPostAt != null ? (
            <span className="text-[var(--ink-muted)]">마지막 글 · {relativeText}</span>
          ) : (
            <span className="text-[var(--ink-muted)]">새 소식 없음</span>
          )}
        </div>
        <Link
          href={`/slot/${slot.slotId}?tab=community`}
          aria-label={`${slot.title} 커뮤니티`}
          className={`flex-shrink-0 rounded-pill px-3 py-1.5 text-xs font-semibold ${
            slot.activity.hasRecentActivity
              ? "bg-brand text-white hover:bg-brand-dark"
              : "border text-ink-2 hover:bg-gray-50"
          }`}
        >
          커뮤니티 →
        </Link>
      </div>
    </div>
  )
}
