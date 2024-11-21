export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  dateJoined: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: {
    productId: number
    quantity: number
    price: number
    name: string
    image: string
  }[]
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

export interface UserSettings {
  notifications: {
    email: boolean
    orderUpdates: boolean
    promotions: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showOrderHistory: boolean
  }
}
