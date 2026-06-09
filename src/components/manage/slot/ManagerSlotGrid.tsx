"use client"

import { useState } from "react"
import { Package, Plus } from "lucide-react"
import Link from "next/link"
import { SlotStatusTabs } from "./SlotStatusTabs"
import { ManagerSlotCard } from "./ManagerSlotCard"
import { EndedSlotCard } from "./EndedSlotCard"
import type { ManagerSlot } from "@/lib/mock/manager"

interface ManagerSlotGridProps {
  activeSlots: ManagerSlot[]
  endedSlots: ManagerSlot[]
}

export function ManagerSlotGrid({
  activeSlots,
  endedSlots,
}: ManagerSlotGridProps) {
  const [tab, setTab] = useState<"active" | "ended">("active")

  const isEmpty = tab === "active" ? activeSlots.length === 0 : endedSlots.length === 0

  return (
    <div className="space-y-6">
      <SlotStatusTabs
        activeCount={activeSlots.length}
        endedCount={endedSlots.length}
        activeTab={tab}
        onTabChange={setTab}
      />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-light">
            <Package className="h-6 w-6 text-ink-muted/40" />
          </div>
          <p className="mb-1 font-display text-base font-bold text-ink-1">
            {tab === "active"
              ? "진행중인 슬롯이 없습니다"
              : "종료된 슬롯이 없습니다"}
          </p>
          {tab === "active" && (
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
          {tab === "active"
            ? activeSlots.map((slot) => (
                <ManagerSlotCard key={slot.id} slot={slot} />
              ))
            : endedSlots.map((slot) => (
                <EndedSlotCard key={slot.id} slot={slot} />
              ))}
        </div>
      )}
    </div>
  )
}
