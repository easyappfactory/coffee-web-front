"use client"

import { useState, useEffect, useCallback } from "react"
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
  Menu,
  X,
} from "lucide-react"
import { SidebarNavItem } from "./SidebarNavItem"

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "운영 현황" },
  { href: "/manage/slots", icon: Package, label: "슬롯 관리" },
  { href: "/manage/orders", icon: Truck, label: "주문 및 배송 관리" },
  { href: "/manage/analytics", icon: BarChart3, label: "판매 및 정산 통계" },
  { href: "/manage/settings", icon: Settings, label: "스토어 운영 설정" },
]

/** Breakpoint (px) below which sidebar collapses into hamburger */
const COLLAPSE_BP = 1024

export function ManagerSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Detect viewport width
  const handleResize = useCallback(() => {
    const narrow = window.innerWidth < COLLAPSE_BP
    setCollapsed(narrow)
    if (!narrow) setOpen(false) // reset drawer when going wide
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function isActive(href: string) {
    if (href === "/manage") return pathname === "/manage"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <>
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
    </>
  )

  // Wide viewport — static sidebar
  if (!collapsed) {
    return (
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[30%] max-w-[320px] min-w-[240px] flex-col border-r border-border bg-white">
        {sidebarContent}
      </aside>
    )
  }

  // Narrow viewport — hamburger + drawer
  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-inner bg-white border border-border shadow-sm transition-colors hover:bg-gray-light"
      >
        <Menu className="h-5 w-5 text-ink-1" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-gray-light hover:text-ink-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
