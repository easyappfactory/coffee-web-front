"use client"

import { useOrders } from "@/hooks/useOrders"
import { OrderCard } from "@/components/my/OrderCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function MyPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useOrders()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const orders =
    data?.pages.flatMap((page) => page?.data ?? []).filter(Boolean) ?? []

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--ink-1)]">주문내역</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--ink-muted)]">
          <p className="text-lg">주문내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          <div ref={ref} className="h-4" />
          {isFetchingNextPage && <Skeleton className="h-24 w-full rounded-xl" />}
        </div>
      )}
    </div>
  )
}
