"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { FeaturedSlot } from "./FeaturedSlot"
import { SlotCarousel } from "./SlotCarousel"
import { useSlots } from "@/hooks/useSlots"
import { useFeedStore } from "@/store/feedStore"

export function FeedContent() {
  const { data: slots, isLoading } = useSlots()
  const { activeCategory } = useFeedStore()

  const sortedSlots = slots
    ? [...slots].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    : []

  const filteredSlots = sortedSlots.filter(
    (s) => activeCategory === "전체" || s.category === activeCategory,
  )

  const featuredSlot = sortedSlots[0]

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="aspect-[16/9] w-full rounded-card" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
        </div>

        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] w-[240px] shrink-0 rounded-card" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {featuredSlot && (
        <section>
          <FeaturedSlot slot={featuredSlot} />
        </section>
      )}

      <section>
        <SlotCarousel slots={filteredSlots} />
      </section>
    </div>
  )
}
