"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VideoPlayer } from "./VideoPlayer";
import type { Slot } from "@/types/slot";

interface FeaturedSlotProps {
  slot: Slot;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".").slice(0, 10);
}

function formatFollowers(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toString();
}

export function FeaturedSlot({ slot }: FeaturedSlotProps) {
  return (
    <article className="mx-auto max-w-[700px]">
      <div className="bg-card rounded-card border border-border shadow-sm p-8">
        {/* Master info row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={slot.master.profileImage} alt={slot.master.name} />
              <AvatarFallback className="bg-brand/10 text-brand text-xs">
                {slot.master.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink-1">{slot.master.name}</span>
              <span className="text-xs text-ink-muted">
                팔로워 {formatFollowers(slot.master.followers)}
              </span>
            </div>
          </div>
          {slot.createdAt && (
            <span className="text-xs text-ink-muted">{formatDate(slot.createdAt)}</span>
          )}
        </div>

        {/* Video */}
        <div className="relative overflow-hidden rounded-card">
          <VideoPlayer
            slotId={slot.id}
            thumbnailUrl={slot.thumbnailUrl}
            videoUrl={slot.videoUrl}
          />
          <Badge className="absolute left-4 top-4 backdrop-blur-[6px] bg-white/90 text-ink-1 border-0 hover:bg-white/90">
            {slot.category}
          </Badge>
        </div>

        {/* Content below video */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            {slot.series}
          </p>

          <Link href={`/slot/${slot.id}`} className="group mt-3 block">
            <h2 className="font-display text-[28px] font-bold leading-snug text-ink-1 transition-colors group-hover:text-brand">
              {slot.title}
            </h2>
          </Link>

          {slot.excerpt && (
            <p className="mt-3 text-sm leading-relaxed text-ink-2 line-clamp-3">
              {slot.excerpt}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
