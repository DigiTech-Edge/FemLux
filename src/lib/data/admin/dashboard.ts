import { faker } from '@faker-js/faker'

type StatType = 'sales' | 'orders' | 'average' | 'visitors'
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

interface DashboardStat {
  title: string
  value: number
  change: number
  type: StatType
}

interface RecentOrder {
  id: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  amount: number
  status: OrderStatus
  date: string
}

// Function to get admin dashboard stats
export const getAdminDashboardStats = (): DashboardStat[] => [
  {
    title: 'Total Sales',
    value: faker.number.int({ min: 100000, max: 200000 }),
    change: faker.number.int({ min: -5, max: 15 }),
    type: 'sales' as const
  },
  {
    title: 'Total Orders',
    value: faker.number.int({ min: 1000, max: 2000 }),
    change: faker.number.int({ min: -5, max: 15 }),
    type: 'orders' as const
  },
  {
    title: 'Average Order',
    value: faker.number.int({ min: 100, max: 200 }),
    change: faker.number.int({ min: -5, max: 15 }),
    type: 'average' as const
  },
  {
    title: 'Daily Visitors',
    value: faker.number.int({ min: 1000, max: 2000 }),
    change: faker.number.int({ min: -5, max: 15 }),
    type: 'visitors' as const
  }
]

// Function to get sales over time data
export const getSalesOverTime = () => 
  Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i).toLocaleString('default', { month: 'short' }),
    sales: faker.number.int({ min: 80000, max: 150000 }),
    orders: faker.number.int({ min: 800, max: 1500 })
  }))

// Function to get top products
export const getTopProducts = () => 
  Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sales: faker.number.int({ min: 5000, max: 20000 }),
    growth: faker.number.int({ min: -10, max: 30 })
  }))

// Function to get recent orders
export const getRecentOrders = (): RecentOrder[] => 
  Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    customer: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar()
    },
    amount: faker.number.int({ min: 100, max: 1000 }),
    status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'cancelled'] as const),
    date: faker.date.recent({ days: 14 }).toISOString()
  }))
