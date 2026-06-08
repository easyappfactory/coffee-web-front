import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Reward } from "@/types/funding"

type CheckoutStep = "order" | "payment" | "complete"

interface CheckoutStore {
  selectedReward: Reward | null
  setSelectedReward: (reward: Reward) => void
  quantity: number
  setQuantity: (qty: number) => void
  step: CheckoutStep
  setStep: (step: CheckoutStep) => void
  orderId: string | null
  setOrderId: (id: string) => void
  publicOrderNumber: string | null
  setPublicOrderNumber: (num: string) => void

  // 결제 연동용 필드
  amount: number
  setAmount: (amount: number) => void
  orderName: string
  setOrderName: (name: string) => void
  slotId: string | null
  setSlotId: (id: string) => void
  slotTitle: string
  setSlotTitle: (title: string) => void
  slotThumbnail: string
  setSlotThumbnail: (url: string) => void
  masterName: string
  setMasterName: (name: string) => void

  reset: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      selectedReward: null,
      setSelectedReward: (reward) => set({ selectedReward: reward }),
      quantity: 1,
      setQuantity: (qty) => set({ quantity: qty }),
      step: "order",
      setStep: (step) => set({ step }),
      orderId: null,
      setOrderId: (id) => set({ orderId: id }),
      publicOrderNumber: null,
      setPublicOrderNumber: (num) => set({ publicOrderNumber: num }),

      amount: 0,
      setAmount: (amount) => set({ amount }),
      orderName: "",
      setOrderName: (name) => set({ orderName: name }),
      slotId: null,
      setSlotId: (id) => set({ slotId: id }),
      slotTitle: "",
      setSlotTitle: (title) => set({ slotTitle: title }),
      slotThumbnail: "",
      setSlotThumbnail: (url) => set({ slotThumbnail: url }),
      masterName: "",
      setMasterName: (name) => set({ masterName: name }),

      reset: () =>
        set({
          selectedReward: null,
          quantity: 1,
          step: "order",
          orderId: null,
          publicOrderNumber: null,
          amount: 0,
          orderName: "",
          slotId: null,
          slotTitle: "",
          slotThumbnail: "",
          masterName: "",
        }),
    }),
    {
      name: "checkout-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedReward: state.selectedReward,
        quantity: state.quantity,
        orderId: state.orderId,
        publicOrderNumber: state.publicOrderNumber,
        amount: state.amount,
        orderName: state.orderName,
        slotId: state.slotId,
        slotTitle: state.slotTitle,
        slotThumbnail: state.slotThumbnail,
        masterName: state.masterName,
      }),
    },
  ),
)
