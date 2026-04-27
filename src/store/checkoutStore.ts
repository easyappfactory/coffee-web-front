import { create } from "zustand";
import type { Reward } from "@/types/funding";

type PaymentMethod = "card" | "bank" | "simple" | "point";
type CheckoutStep = "order" | "payment" | "complete";

interface CheckoutStore {
  selectedReward: Reward | null;
  setSelectedReward: (reward: Reward) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
  orderId: string | null;
  setOrderId: (id: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedReward: null,
  setSelectedReward: (reward) => set({ selectedReward: reward }),
  quantity: 1,
  setQuantity: (qty) => set({ quantity: qty }),
  paymentMethod: "card",
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  step: "order",
  setStep: (step) => set({ step }),
  orderId: null,
  setOrderId: (id) => set({ orderId: id }),
  reset: () =>
    set({
      selectedReward: null,
      quantity: 1,
      paymentMethod: "card",
      step: "order",
      orderId: null,
    }),
}));
