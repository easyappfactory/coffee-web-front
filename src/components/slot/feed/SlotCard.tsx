import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SlotMeta } from "@/components/common/SlotMeta";
import type { Slot } from "@/types/slot";

interface SlotCardProps {
  slot: Slot;
}

export function SlotCard({ slot }: SlotCardProps) {
  const participationRate =
    slot.supporters !== undefined && slot.capacity
      ? Math.min(Math.round((slot.supporters / slot.capacity) * 100), 100)
      : null;

  return (
    <Link href={`/slot/${slot.id}`} className="group block w-[260px]">
      <div className="overflow-hidden rounded-card bg-card shadow-sm border border-border flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] shrink-0">
          <Image
            src={slot.thumbnailUrl}
            alt={slot.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="260px"
          />
          <Badge className="absolute left-3 top-3 backdrop-blur-[6px] bg-white/90 text-ink-1 border-0 text-[11px] hover:bg-white/90">
            {slot.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col" style={{ minHeight: "180px" }}>
          <SlotMeta duration={slot.duration} category={slot.series} className="mb-1.5" />

          {/* Title — 2줄 고정 높이로 카드 높이 일정하게 유지 */}
          <h3 className="font-display text-sm font-bold text-ink-1 leading-snug line-clamp-2 h-10 overflow-hidden group-hover:text-brand transition-colors">
            {slot.title}
          </h3>

          {/* Bottom metadata — mt-auto로 항상 하단 고정 */}
          <div className="mt-auto pt-3 space-y-2.5">
            {/* Master info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={slot.master.profileImage} alt={slot.master.name} />
                <AvatarFallback className="bg-brand/10 text-brand text-[10px]">
                  {slot.master.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-ink-muted truncate">{slot.master.name}</span>
            </div>

            {/* Participation progress bar */}
            {participationRate !== null && slot.supporters !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-ink-muted">
                    {slot.supporters.toLocaleString()}명 참여
                  </span>
                  <span className="text-[10px] font-semibold text-brand">
                    {participationRate}%
                  </span>
                </div>
                <Progress
                  value={participationRate}
                  className="[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-gray-light [&_[data-slot=progress-indicator]]:bg-brand"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
