"use client"

import { useEffect } from "react"
import { Wallet, Package, SquareStack, ShoppingBag } from "lucide-react"
import { StatCard } from "@/components/manage/common/StatCard"
import { AdminSlotGrid } from "@/components/manage/slot/AdminSlotGrid"
import { mockManagerStats } from "@/lib/mock/manager"
import { useAdminSlots } from "@/hooks/useAdminOrders"
import { POC_USERS } from "@/lib/api"

export default function ManageSlotsPage() {
  const stats = mockManagerStats
  const slotsQuery = useAdminSlots()

  useEffect(() => {
    localStorage.setItem("pocUserId", POC_USERS.MANAGER)
  }, [])

  if (slotsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-40 text-sm text-ink-muted">
        슬롯 목록을 불러오는 중...
      </div>
    )
  }

  if (slotsQuery.isError) {
    return (
      <div className="flex items-center justify-center py-40 text-sm text-red-500">
        슬롯 목록을 불러오기 실패했습니다.
      </div>
    )
  }

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

      {/* Slot Grid with Phase Tabs */}
      <AdminSlotGrid slots={slotsQuery.data ?? []} />
    </div>
  )
}
