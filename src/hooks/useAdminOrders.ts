import { useQuery, keepPreviousData } from "@tanstack/react-query"
import {
  getAdminSlots,
  getAdminSlotSummary,
  getAdminSlotOrders,
} from "@/lib/api"
import type { AdminOrderTab } from "@/types/adminOrder"

export const useAdminSlots = () =>
  useQuery({ queryKey: ["admin", "slots"], queryFn: getAdminSlots })

export const useAdminSlotSummary = (slotId?: string) =>
  useQuery({
    queryKey: ["admin", "slot", slotId, "summary"],
    queryFn: () => getAdminSlotSummary(slotId!),
    enabled: !!slotId,
  })

// 번호형 페이지 — page state 로 구동 (무한스크롤 아님). page 는 0-base.
export const useAdminSlotOrders = (
  slotId?: string,
  tab: AdminOrderTab = "all",
  q?: string,
  page = 0,
) =>
  useQuery({
    queryKey: ["admin", "slot", slotId, "orders", tab, q, page],
    queryFn: () => getAdminSlotOrders(slotId!, tab, q, page),
    enabled: !!slotId,
    placeholderData: keepPreviousData,
  })
