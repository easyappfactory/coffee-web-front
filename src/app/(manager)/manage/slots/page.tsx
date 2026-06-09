"use client"

import { Wallet, Package, SquareStack, ShoppingBag } from "lucide-react"
import { StatCard } from "@/components/manage/common/StatCard"
import { ManagerSlotGrid } from "@/components/manage/slot/ManagerSlotGrid"
import {
  mockManagerStats,
  mockActiveSlots,
  mockEndedSlots,
} from "@/lib/mock/manager"

export default function ManageSlotsPage() {
  const stats = mockManagerStats

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-1">
          슬롯 관리
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          내가 등록한 원두 슬롯을 관리하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="총 매출액"
          value={`₩${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          changeType="positive"
        />
        <StatCard
          icon={Package}
          label="운영 슬롯"
          value={`${stats.activeSlots}개`}
          change="Active"
        />
        <StatCard
          icon={SquareStack}
          label="종료 슬롯"
          value={`${stats.endedSlots}개`}
          change="Ended"
        />
        <StatCard
          icon={ShoppingBag}
          label="이번 달 주문"
          value={`${stats.monthlyOrders}건`}
          change={stats.ordersChange}
          changeType="positive"
        />
      </div>

      {/* Slot Grid with Tabs */}
      <ManagerSlotGrid
        activeSlots={mockActiveSlots}
        endedSlots={mockEndedSlots}
      />
    </div>
  )
}
