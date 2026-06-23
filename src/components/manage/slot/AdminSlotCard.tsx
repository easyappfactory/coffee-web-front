"use client"

import Image from "next/image"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminSlot, SlotPhase } from "@/types/adminOrder"

interface AdminSlotCardProps {
  slot: AdminSlot
}

const phaseBadgeStyle: Record<SlotPhase, string> = {
  PRE: "bg-[#efeae4] text-[#8a7e72]",
  FUNDING: "bg-[#f8ede3] text-[#b05e2e]",
  PENDING: "bg-[#f0ebfa] text-[#6d5ca8]",
  OPERATING: "bg-teal-50 text-teal-700",
  CLOSED: "bg-[#ece7e1] text-[#7c726a]",
  FAILED: "bg-red-50 text-red-600",
}

export function AdminSlotCard({ slot }: AdminSlotCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-light">
        {slot.thumbnailUrl ? (
          <Image
            src={slot.thumbnailUrl}
            alt={slot.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-ink-muted/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 p-5">
        {/* Phase badge */}
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold",
            phaseBadgeStyle[slot.phase],
          )}
        >
          {slot.phaseLabel}
        </span>

        {/* Slot name */}
        <h3 className="line-clamp-2 font-display text-sm font-bold text-ink-1">
          {slot.name}
        </h3>

        {/* Deadline */}
        <p className="text-[11px] text-ink-muted">
          마감일&nbsp;
          <span className="font-medium text-ink-2">{slot.deadline}</span>
        </p>
      </div>
    </div>
  )
}
