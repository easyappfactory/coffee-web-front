export interface SlotFlavorInput {
  aroma: number
  body: number
  sweetness: number
  acidity: number
}

export interface PricingOption {
  id: string
  weight: string
  earlybird: number
  second: number
  final: number
}

export interface SlotRegistrationFormData {
  blendName: string
  blendStory: string
  hashtags: string[]
  thumbnailFile: FileList | null
  flavor: SlotFlavorInput
  pricingOptions: PricingOption[]
}

export interface CreateSlotRequest {
  blendName: string
  blendStory: string
  hashtags: string[]
  flavor: SlotFlavorInput
  pricingOptions: Omit<PricingOption, "id">[]
}

export interface CreateSlotResponse {
  id: string
  createdAt: string
}
