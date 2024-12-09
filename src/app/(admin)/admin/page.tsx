import StatsCards from "@/components/interfaces/admin/dashboard/StatsCards";
import SalesChart from "@/components/interfaces/admin/dashboard/SalesChart";
import TopProducts from "@/components/interfaces/admin/dashboard/TopProducts";
import RecentOrders from "@/components/interfaces/admin/dashboard/RecentOrders";
import { fetchDashboardData } from "@/services/actions/dashboard.actions";

const DashboardPage = async () => {
  const dashboardData = await fetchDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-default-500">Welcome to your admin dashboard</p>
      </div>

      <StatsCards data={dashboardData.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={dashboardData.salesData} />
        </div>
        <div>
          <TopProducts data={dashboardData.topProducts} />
        </div>
      </div>

      <RecentOrders data={dashboardData.recentOrders} />
    </div>
  );
};

export default DashboardPage;
