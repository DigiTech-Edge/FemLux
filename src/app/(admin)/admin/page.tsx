import StatsCards from "@/components/interfaces/admin/dashboard/StatsCards";
import SalesChart from "@/components/interfaces/admin/dashboard/SalesChart";
import TopProducts from "@/components/interfaces/admin/dashboard/TopProducts";
import RecentOrders from "@/components/interfaces/admin/dashboard/RecentOrders";
import { fetchDashboardData } from "@/services/actions/dashboard.actions";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const dashboardData = await fetchDashboardData();
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-default-500">Welcome to your admin dashboard</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Overview for {currentMonth}
        </h2>
        <StatsCards data={dashboardData.stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">
            Sales Trend (Last 12 Months)
          </h2>
          <SalesChart data={dashboardData.salesData} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Products</h2>
          <TopProducts data={dashboardData.topProducts} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        <RecentOrders data={dashboardData.recentOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;
