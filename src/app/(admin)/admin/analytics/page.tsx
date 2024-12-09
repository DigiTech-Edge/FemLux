"use client";

import { useEffect, useState } from "react";
import AnalyticsClient from "@/components/interfaces/admin/analytics/AnalyticsClient";
import { fetchAnalytics } from "@/services/actions/analytics.actions";
import { OrderStatusData, Analytics, TimeRange } from "@/types/analytics";
import { useAnalyticsStore } from "@/store/analytics.store";
import { Spinner } from "@nextui-org/react";

export default function AnalyticsPage() {
  const { timePeriod } = useAnalyticsStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const data = await fetchAnalytics(timePeriod);
      setAnalytics(data);
      setLoading(false);
    };

    loadAnalytics();
  }, [timePeriod]);

  if (!analytics) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Transform data for overview stats
  const overviewStats = [
    {
      title: "Total Revenue",
      value: analytics.orders.totalRevenue,
      change: analytics.growth.revenue,
      changeType:
        analytics.growth.revenue >= 0
          ? ("increase" as const)
          : ("decrease" as const),
      timeRange: timePeriod as TimeRange,
    },
    {
      title: "Total Orders",
      value: analytics.orders.totalOrders,
      change: analytics.growth.orders,
      changeType:
        analytics.growth.orders >= 0
          ? ("increase" as const)
          : ("decrease" as const),
      timeRange: timePeriod as TimeRange,
    },
    {
      title: "Active Customers",
      value: analytics.customers.activeCustomers,
      change: analytics.growth.customers,
      changeType:
        analytics.growth.customers >= 0
          ? ("increase" as const)
          : ("decrease" as const),
      timeRange: timePeriod as TimeRange,
    },
    {
      title: "Average Order Value",
      value: analytics.orders.averageOrderValue,
      change: analytics.growth.averageOrderValue,
      changeType:
        analytics.growth.averageOrderValue >= 0
          ? ("increase" as const)
          : ("decrease" as const),
      timeRange: timePeriod as TimeRange,
    },
  ];

  // Transform data for sales chart
  const salesData = analytics.revenueByMonth.map((item) => ({
    date: item.month,
    revenue: item.revenue,
    orders: item.orders,
  }));

  // Transform data for product performance
  const productPerformance = analytics.products.topSellingProducts.map(
    (product) => ({
      id: product.id,
      name: product.name,
      sales: product.totalOrders,
      revenue: product.totalRevenue,
      growth: 0, // TODO: Calculate growth
      stock: 0, // TODO: Get stock data
    })
  );

  // Transform data for customer segments
  const customerSegments = [
    {
      segment: "New Customers",
      count: analytics.customers.newCustomersThisMonth,
      percentage:
        (analytics.customers.newCustomersThisMonth /
          analytics.customers.totalCustomers) *
        100,
    },
    {
      segment: "Returning Customers",
      count:
        analytics.customers.totalCustomers -
        analytics.customers.newCustomersThisMonth,
      percentage:
        ((analytics.customers.totalCustomers -
          analytics.customers.newCustomersThisMonth) /
          analytics.customers.totalCustomers) *
        100,
    },
  ];

  // Transform data for customer retention
  const customerRetention = [
    {
      month: new Date().toLocaleString("default", { month: "long" }),
      newCustomers: analytics.customers.newCustomersThisMonth,
      returningCustomers:
        analytics.customers.activeCustomers -
        analytics.customers.newCustomersThisMonth,
      churnRate: 100 - analytics.customers.customerRetentionRate,
    },
  ];

  // Transform data for order analytics
  const orderStatusData: OrderStatusData[] = Object.entries(
    analytics.orders.ordersByStatus
  ).map(([status, count]) => ({
    status,
    count,
    percentage: (count / analytics.orders.totalOrders) * 100 || 0,
  }));

  // Transform revenue data for order volume
  const orderVolume = analytics.revenueByMonth.map((item) => ({
    date: item.month,
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <div className="space-y-6">
      <AnalyticsClient
        overviewStats={overviewStats}
        salesData={salesData}
        productPerformanceData={productPerformance}
        customerSegments={customerSegments}
        customerRetention={customerRetention}
        orderStatusData={orderStatusData}
        orderVolumeData={orderVolume}
        categoryAnalytics={analytics.categoryAnalytics}
        isLoading={loading}
      />
    </div>
  );
}
