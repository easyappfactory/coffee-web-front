"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { ManagerSlot } from "@/lib/mock/manager"

interface EndedSlotCardProps {
  slot: ManagerSlot
}

export function EndedSlotCard({ slot }: EndedSlotCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-md">
      {/* Thumbnail - dimmed */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-light">
        <Image
          src={slot.thumbnailUrl}
          alt={slot.title}
          fill
          className="object-cover opacity-60 grayscale-[30%] transition-all duration-500 group-hover:opacity-80 group-hover:grayscale-0"
        />
        <span className="absolute right-3 top-3 rounded-full bg-ink-muted/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          Ended
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div>
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            {slot.series}
          </p>
          <h3 className="line-clamp-1 font-display text-sm font-bold text-ink-2">
            {slot.title}
          </h3>
        </div>

        {/* Final Stats */}
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-gray-light/80 px-4 py-3">
          <div>
            <p className="text-[10px] text-ink-muted">달성률</p>
            <p className="font-display text-sm font-bold text-ink-1">
              {slot.finalPercent}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">서포터</p>
            <p className="font-display text-sm font-bold text-ink-1">
              {slot.supporters.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">매출</p>
            <p className="font-display text-sm font-bold text-ink-1">
              ₩{((slot.totalRevenue ?? 0) / 10000).toFixed(0)}만
            </p>
          </div>
        </div>

        {/* Ended date + action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-ink-muted">
            {slot.endedAt} 종료
          </span>
          <Link
            href={`/slot/${slot.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-light px-3 py-1.5 text-[11px] font-medium text-ink-2 transition-colors hover:bg-brand/10 hover:text-brand"
          >
            <ExternalLink className="h-3 w-3" />
            상세 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
