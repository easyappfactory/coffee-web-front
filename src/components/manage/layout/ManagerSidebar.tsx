"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Coffee,
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
} from "lucide-react"
import { SidebarNavItem } from "./SidebarNavItem"

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "운영 현황" },
  { href: "/manage/slots", icon: Package, label: "슬롯 관리" },
  { href: "/manage/orders", icon: Truck, label: "주문 및 배송 관리" },
  { href: "/manage/analytics", icon: BarChart3, label: "판매 및 정산 통계" },
  { href: "/manage/settings", icon: Settings, label: "스토어 운영 설정" },
]

export function ManagerSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/manage") return pathname === "/manage"
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-8">
        <Coffee className="h-5 w-5 text-brand" />
        <span className="font-display text-lg font-bold text-ink-1">
          Barista Masters
        </span>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
          관리
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            {...item}
            isActive={isActive(item.href)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-2 border-t border-border px-3 py-6">
        <Link
          href="/manage/slots/new"
          className="flex w-full items-center justify-center gap-2 rounded-inner bg-brand px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-dark active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add New Blend
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-xs text-ink-muted transition-colors hover:text-ink-2"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Link>
      </div>
    </aside>
  )
}
