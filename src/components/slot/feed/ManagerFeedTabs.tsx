"use client"

import { useState } from "react"
import { Package, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { MySlotList } from "@/components/manage/slot/MySlotList"
import { SlotRegistrationForm } from "@/components/manage/slot/SlotRegistrationForm"

const TABS = [
  { id: "my-slots", label: "내 슬롯", icon: Package },
  { id: "new-slot", label: "새 슬롯 만들기", icon: PlusCircle },
] as const

type TabId = (typeof TABS)[number]["id"]

export function ManagerFeedTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("my-slots")

  return (
    <div>
      {/* Tab Bar */}
      <div className="mb-8 flex gap-8 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-semibold transition-colors",
              activeTab === id
                ? "border-b-2 border-brand text-brand"
                : "text-ink-muted hover:text-brand",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "my-slots" && <MySlotList />}
      {activeTab === "new-slot" && <SlotRegistrationForm />}
    </div>
  )
}
