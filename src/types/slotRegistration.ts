export interface SlotFlavorInput {
  acidity: number
  sweetness: number
  bitterness: number
  saltiness: number
  nutty: number
  roastLevel: number
}

export interface PricingOption {
  id: string
  weight: string
  earlybird: number
  second: number
  final: number
  minQuantity: number
  maxQuantity: number
}

export interface SlotRegistrationFormData {
  blendName: string
  blendStory: string
  hashtags: string[]
  thumbnailFile: FileList | null
  flavor: SlotFlavorInput
  pricingOptions: PricingOption[]
  fundingStartDate: string
  fundingEndDate: string
  minFundingAmount: number
  maxFundingAmount: number | null
}

export interface CreateSlotRequest {
  blendName: string
  blendStory: string
  hashtags: string[]
  flavor: SlotFlavorInput
  pricingOptions: Omit<PricingOption, "id">[]
  fundingStartDate: string
  deadline: string // = fundingEndDate
  minFundingAmount: number
  maxFundingAmount: number | null
}

export interface CreateSlotResponse {
  id: string
  createdAt: string
}
