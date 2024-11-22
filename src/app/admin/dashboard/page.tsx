import StatsCards from '@/components/interfaces/admin/dashboard/StatsCards'
import SalesChart from '@/components/interfaces/admin/dashboard/SalesChart'
import TopProducts from '@/components/interfaces/admin/dashboard/TopProducts'
import RecentOrders from '@/components/interfaces/admin/dashboard/RecentOrders'
import {
  getAdminDashboardStats,
  getSalesOverTime,
  getTopProducts,
  getRecentOrders,
} from '@/lib/data/admin/dashboard'

export default function DashboardPage() {
  const stats = getAdminDashboardStats()
  const salesData = getSalesOverTime()
  const topProducts = getTopProducts()
  const recentOrders = getRecentOrders()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-default-500">Welcome to your admin dashboard</p>
      </div>

      <StatsCards data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>
        <div>
          <TopProducts data={topProducts} />
        </div>
      </div>

      <RecentOrders data={recentOrders} />
    </div>
  )
}
