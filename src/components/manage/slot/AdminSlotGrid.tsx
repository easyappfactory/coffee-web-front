"use client"

import { useState } from "react"
import { Package, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AdminSlot, SlotPhase } from "@/types/adminOrder"
import { AdminSlotCard } from "./AdminSlotCard"

interface AdminSlotGridProps {
  slots: AdminSlot[]
}

const PHASE_TABS: { phase: SlotPhase; label: string }[] = [
  { phase: "PRE", label: "펀딩 전" },
  { phase: "FUNDING", label: "펀딩 중" },
  { phase: "PENDING", label: "확정 대기" },
  { phase: "OPERATING", label: "운영 중" },
  { phase: "CLOSED", label: "종료" },
  { phase: "FAILED", label: "펀딩 실패" },
]

export function AdminSlotGrid({ slots }: AdminSlotGridProps) {
  const [activePhase, setActivePhase] = useState<SlotPhase>("PRE")

  const countByPhase = (phase: SlotPhase) =>
    slots.filter((s) => s.phase === phase).length

  const filteredSlots = slots.filter((s) => s.phase === activePhase)
  const isEmpty = filteredSlots.length === 0

  return (
    <div className="space-y-6">
      {/* Phase Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-gray-light p-1">
        {PHASE_TABS.map(({ phase, label }) => {
          const count = countByPhase(phase)
          const isActive = activePhase === phase
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setActivePhase(phase)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-white text-ink-1 shadow-sm"
                  : "text-ink-muted hover:text-ink-2",
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "bg-transparent text-ink-muted",
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Slot Grid or Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-light">
            <Package className="h-6 w-6 text-ink-muted/40" />
          </div>
          <p className="mb-1 font-display text-base font-bold text-ink-1">
            해당 상태의 슬롯이 없습니다
          </p>
          {activePhase === "PRE" && (
            <Link
              href="/manage/slots/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              새 슬롯 만들기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredSlots.map((slot) => (
            <AdminSlotCard key={slot.slotId} slot={slot} />
          ))}
        </div>
      )}
    </div>
  )
}
