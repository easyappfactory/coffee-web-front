import type { Slot } from "@/types/slot"
import { mockSlots, mockSlotFundingData } from "./slots"

export interface ManagerSlotCommunity {
  newComments: number
  newVotes: number
  newLikes: number
  hasUnread: boolean
}

export interface ManagerSlot extends Slot {
  status: "active" | "draft" | "ended"
  fundingPercent: number
  supporters: number
  daysLeft: number
  endedAt?: string
  finalPercent?: number
  totalRevenue?: number
  community: ManagerSlotCommunity
}

export const mockManagerProfile = {
  id: "m1",
  name: "김 바리스타",
  role: "Premium Seller",
  profileImage: "https://picsum.photos/seed/manager/200/200",
}

export const mockActiveSlots: ManagerSlot[] = mockSlots
  .slice(0, 3)
  .map((slot, index) => ({
    ...slot,
    status: "active" as const,
    fundingPercent: mockSlotFundingData[slot.id]?.funding.percent ?? 0,
    supporters: mockSlotFundingData[slot.id]?.funding.supporters ?? 0,
    daysLeft: mockSlotFundingData[slot.id]?.funding.daysLeft ?? 0,
    community: {
      newComments: [3, 1, 0][index]!,
      newVotes: [12, 5, 0][index]!,
      newLikes: [24, 8, 3][index]!,
      hasUnread: index < 2,
    },
  }))

export const mockEndedSlots: ManagerSlot[] = [
  {
    ...mockSlots[3]!,
    status: "ended" as const,
    fundingPercent: 142,
    supporters: 1204,
    daysLeft: 0,
    endedAt: "2026-05-10",
    finalPercent: 142,
    totalRevenue: 8520000,
    community: { newComments: 0, newVotes: 0, newLikes: 0, hasUnread: false },
  },
  {
    ...mockSlots[0]!,
    id: "5",
    title: "에티오피아 시다모 내추럴 : 베리의 축제",
    status: "ended" as const,
    fundingPercent: 98,
    supporters: 567,
    daysLeft: 0,
    endedAt: "2026-04-20",
    finalPercent: 98,
    totalRevenue: 4230000,
    community: { newComments: 0, newVotes: 0, newLikes: 0, hasUnread: false },
  },
]

export const mockManagerSlots: ManagerSlot[] = [
  ...mockActiveSlots,
  ...mockEndedSlots,
]

export const mockManagerStats = {
  totalRevenue: 14200000,
  revenueChange: "+12.4%",
  activeSlots: 3,
  endedSlots: 2,
  monthlyOrders: 428,
  ordersChange: "+8.1%",
}
