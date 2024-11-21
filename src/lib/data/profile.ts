import { Order, UserProfile } from '@/lib/types/user'

export const mockProfile: UserProfile = {
  id: '1',
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
  avatar: '/images/avatar-placeholder.jpg',
  phone: '+1 234 567 8900',
  dateJoined: '2023-01-01',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA'
  }
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    date: '2023-12-01',
    status: 'delivered',
    items: [
      {
        productId: 1,
        quantity: 2,
        price: 89.99,
        name: 'Premium Skincare Set',
        image: '/images/products/skincare-set.jpg'
      }
    ],
    total: 179.98,
    shippingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    trackingNumber: '1Z999AA1234567890',
    estimatedDelivery: '2023-12-05'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    date: '2023-12-10',
    status: 'processing',
    items: [
      {
        productId: 2,
        quantity: 1,
        price: 129.99,
        name: 'Luxury Face Cream',
        image: '/images/products/face-cream.jpg'
      }
    ],
    total: 129.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    estimatedDelivery: '2023-12-15'
  }
]
