import { Product } from './products'

export interface CartItem extends Product {
  quantity: number
  selectedColor: string
  selectedSize: string
}

export interface CheckoutDetails {
  email: string
  contact: string
  address: string
  saveDetails: boolean
}
