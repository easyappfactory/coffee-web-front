import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  change?: string
  changeType?: "positive" | "neutral"
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = "neutral",
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-light transition-colors group-hover:bg-brand/10">
          <Icon className="h-[18px] w-[18px] text-ink-muted transition-colors group-hover:text-brand" />
        </div>
        {change && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-bold",
              changeType === "positive"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gray-light text-ink-muted",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold tracking-tight text-ink-1">
        {value}
      </p>
    </div>
  )
}
