"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  badge?: number
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  badge,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-inner px-4 py-3 text-sm font-medium transition-all",
        isActive
          ? "bg-brand/8 text-brand font-semibold"
          : "text-ink-muted hover:bg-gray-light hover:text-ink-2",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          isActive ? "text-brand" : "text-ink-muted group-hover:text-ink-2",
        )}
      />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {isActive && (
        <span className="h-5 w-[3px] rounded-full bg-brand" />
      )}
    </Link>
  )
}
