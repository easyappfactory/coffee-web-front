export interface ShippingAddress {
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string
  zipcode: string
}

export interface SaveShippingAddressRequest {
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string
  zipcode: string
}
