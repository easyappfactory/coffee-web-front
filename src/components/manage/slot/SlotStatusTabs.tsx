"use client"

import { cn } from "@/lib/utils"

type SlotTab = "active" | "ended"

interface SlotStatusTabsProps {
  activeCount: number
  endedCount: number
  activeTab: SlotTab
  onTabChange: (tab: SlotTab) => void
}

export function SlotStatusTabs({
  activeCount,
  endedCount,
  activeTab,
  onTabChange,
}: SlotStatusTabsProps) {
  const tabs: { id: SlotTab; label: string; count: number }[] = [
    { id: "active", label: "진행중 슬롯", count: activeCount },
    { id: "ended", label: "종료된 슬롯", count: endedCount },
  ]

  return (
    <div className="flex gap-1 rounded-xl bg-gray-light p-1">
      {tabs.map(({ id, label, count }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
            activeTab === id
              ? "bg-white text-ink-1 shadow-sm"
              : "text-ink-muted hover:text-ink-2",
          )}
        >
          {label}
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              activeTab === id
                ? "bg-brand/10 text-brand"
                : "bg-transparent text-ink-muted",
            )}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  )
}
