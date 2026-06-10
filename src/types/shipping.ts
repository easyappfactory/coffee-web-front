export interface ShippingAddress {
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string | null
  zipcode: string
}

export interface SaveShippingAddressRequest {
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string | null
  zipcode: string
}
