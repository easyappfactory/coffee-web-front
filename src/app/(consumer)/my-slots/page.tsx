"use client"

import { useState } from "react"
import { useMySlots } from "@/hooks/useMySlots"
import { MySlotCard } from "@/components/my/MySlotCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { MySlotPhase } from "@/types/mySlot"

type ChipKey = "all" | MySlotPhase

const CHIPS: { key: ChipKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "FUNDING", label: "펀딩 중" },
  { key: "PENDING", label: "확정 대기" },
  { key: "OPERATING", label: "운영 중" },
]

export default function MySlotsPage() {
  const { data: slots, isLoading, isError } = useMySlots()
  const [filter, setFilter] = useState<ChipKey>("all")

  const all = slots ?? []
  const countOf = (key: ChipKey) => (key === "all" ? all.length : all.filter((s) => s.phase === key).length)
  const visible = filter === "all" ? all : all.filter((s) => s.phase === filter)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-bold text-[var(--ink-1)]">내 참여 슬롯</h1>
        {!isLoading && !isError && (
          <span className="text-xs text-[var(--ink-muted)]">활동순 · 전체 {all.length}</span>
        )}
      </div>

      {!isLoading && !isError && all.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            const on = filter === chip.key
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(chip.key)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition ${
                  on ? "bg-brand text-white" : "bg-gray-100 text-ink-2 hover:bg-gray-200"
                }`}
              >
                {chip.label} {countOf(chip.key)}
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--ink-muted)]">
          <p className="text-lg">목록을 불러오지 못했습니다</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--ink-muted)]">
          <p className="text-lg">
            {filter === "all" ? "참여한 슬롯이 없습니다" : "이 필터에 해당하는 슬롯이 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((slot) => (
            <MySlotCard key={slot.slotId} slot={slot} />
          ))}
        </div>
      )}
    </div>
  )
}
