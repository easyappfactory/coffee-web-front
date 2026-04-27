export interface Reward {
  id: string;
  label: string;
  price: number;
  description: string;
  remaining?: number;
}

export interface FundingStatus {
  percent: number;
  daysLeft: number;
  supporters: number;
  targetAmount: number;
  currentAmount: number;
}

export interface Order {
  id: string;
  slotId: string;
  slotTitle: string;
  slotThumbnail: string;
  masterName?: string;
  masterRole?: string;
  rewardId: string;
  rewardLabel: string;
  rewardDescription?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  shippingFee: number;
  estimatedDelivery: string;
  paymentMethod?: string;
  status: "pending" | "paid" | "completed";
  createdAt: string;
}
