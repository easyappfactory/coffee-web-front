import type { Order } from "@/types/funding";

export const mockOrder: Order = {
  id: "ord_001",
  slotId: "1",
  slotTitle: "에티오피아 아나에어로빅 네추럴 : 산소의 마법",
  slotThumbnail: "https://picsum.photos/seed/slot1/800/450",
  rewardId: "r1",
  rewardLabel: "슈퍼얼리버드",
  quantity: 1,
  unitPrice: 15000,
  totalPrice: 15000,
  shippingFee: 3000,
  estimatedDelivery: "2026-05-15",
  paymentMethod: "card",
  status: "pending",
  createdAt: "2026-04-22T10:00:00Z",
};
