export interface OptionValueDto {
  optionType: string;  // e.g. "용량"
  value: string;       // e.g. "250g"
}

export interface Reward {
  id: string;
  label: string;
  price: number;
  description: string;
  remaining?: number;
  variantId: string;           // product_variant.id (결제 시 사용할 key)
  optionValues: OptionValueDto[];  // 옵션 정보
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
  variantId: string;
  optionSummary: string;
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
