"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Pencil } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { CommunityBadge } from "./CommunityBadge"
import type { ManagerSlot } from "@/lib/mock/manager"

interface ManagerSlotCardProps {
  slot: ManagerSlot
}

export function ManagerSlotCard({ slot }: ManagerSlotCardProps) {
  const { newComments, newVotes, newLikes } = slot.community
  const hasCommunityUpdates = newComments > 0 || newVotes > 0 || newLikes > 0

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-light">
        <Image
          src={slot.thumbnailUrl}
          alt={slot.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          Active
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div>
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            {slot.series}
          </p>
          <h3 className="line-clamp-1 font-display text-sm font-bold text-ink-1">
            {slot.title}
          </h3>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-2">
              펀딩 {slot.fundingPercent}%
            </span>
            <span className="text-ink-muted">D-{slot.daysLeft}</span>
          </div>
          <Progress
            value={Math.min(slot.fundingPercent, 100)}
            className="h-1.5 bg-gray-light [&_[data-slot=progress-indicator]]:bg-brand"
          />
          <p className="text-[11px] text-ink-muted">
            서포터 {slot.supporters.toLocaleString()}명
          </p>
        </div>

        {/* Community Updates */}
        {hasCommunityUpdates && (
          <div className="rounded-lg bg-gray-light px-3 py-2">
            <CommunityBadge
              newComments={newComments}
              newVotes={newVotes}
              newLikes={newLikes}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/slot/${slot.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-light px-3 py-1.5 text-[11px] font-medium text-ink-2 transition-colors hover:bg-brand/10 hover:text-brand"
          >
            <ExternalLink className="h-3 w-3" />
            상세 보기
          </Link>
          <button className="inline-flex items-center gap-1 rounded-lg bg-gray-light px-3 py-1.5 text-[11px] font-medium text-ink-2 transition-colors hover:bg-brand/10 hover:text-brand">
            <Pencil className="h-3 w-3" />
            편집
          </button>
        </div>
      </div>
    </div>
  )
}
