import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import {
  getAdminSlots,
  getAdminSlotSummary,
  getAdminSlotOrders,
  getSlotFundingStatus,
  startFunding as startFundingApi,
  stopFunding as stopFundingApi,
  confirmFunding as confirmFundingApi,
  failFunding as failFundingApi,
  startSlotShipping as startSlotShippingApi,
  shipOrder as shipOrderApi,
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

export const useSlotFundingStatus = (slotId?: string) =>
  useQuery({
    queryKey: ["admin", "slot", slotId, "funding-status"],
    queryFn: () => getSlotFundingStatus(slotId!),
    enabled: !!slotId,
  })

export const useSlotPhaseTransition = (slotId: string) => {
  const qc = useQueryClient()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "slots"] })
    qc.invalidateQueries({ queryKey: ["admin", "slot", slotId] })
  }

  const startFunding = useMutation({
    mutationFn: () => startFundingApi(slotId),
    onSuccess: invalidate,
  })

  const stopFunding = useMutation({
    mutationFn: () => stopFundingApi(slotId),
    onSuccess: invalidate,
  })

  const confirmFunding = useMutation({
    mutationFn: () => confirmFundingApi(slotId),
    onSuccess: invalidate,
  })

  const failFunding = useMutation({
    mutationFn: () => failFundingApi(slotId),
    onSuccess: invalidate,
  })

  const startShipping = useMutation({
    mutationFn: () => startSlotShippingApi(slotId),
    onSuccess: invalidate,
  })

  return { startFunding, stopFunding, confirmFunding, failFunding, startShipping }
}

export const useShipOrder = (slotId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      orderId,
      trackingNumber,
      carrierCode,
    }: {
      orderId: string
      trackingNumber: string
      carrierCode: string
    }) => shipOrderApi(orderId, trackingNumber, carrierCode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "slot", slotId] })
    },
  })
}
