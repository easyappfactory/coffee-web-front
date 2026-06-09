"use client"

import { useSlots } from "@/hooks/useSlots"
import { SlotCard } from "@/components/slot/feed/SlotCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Package } from "lucide-react"

export function MySlotList() {
  const { data: slots, isLoading } = useSlots()

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-card" />
        ))}
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="mb-4 h-12 w-12 text-ink-muted/40" />
        <p className="text-lg font-bold text-ink-1">등록한 슬롯이 없습니다</p>
        <p className="mt-1 text-sm text-ink-muted">
          새 슬롯 만들기 탭에서 첫 블렌드를 등록해보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {slots.map((slot) => (
        <SlotCard key={slot.id} slot={slot} />
      ))}
    </div>
  )
}
