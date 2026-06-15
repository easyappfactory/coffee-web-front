import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { getOrders, getOrderDetail, getOrderTracking } from "@/lib/api"
import type { OrderSummary, OrderDetail, CursorPageResponse, TrackingResponse } from "@/types/order"

export function useOrders() {
  return useInfiniteQuery<CursorPageResponse<OrderSummary>>({
    queryKey: ["orders"],
    queryFn: ({ pageParam }) => getOrders(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  })
}

export function useOrderDetail(orderId: string) {
  return useQuery<OrderDetail>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
  })
}

export function useOrderTracking(orderId: string, enabled: boolean) {
  return useQuery<TrackingResponse>({
    queryKey: ["orderTracking", orderId],
    queryFn: () => getOrderTracking(orderId),
    enabled,
  })
}
