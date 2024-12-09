"use client";

import AnalyticsOverview from "./AnalyticsOverview";
import SalesChart from "./SalesChart";
import ProductPerformance from "./ProductPerformance";
import CustomerAnalytics from "./CustomerAnalytics";
import OrderAnalytics from "./OrderAnalytics";
import CategoryPerformance from "./CategoryPerformance";
import TimePeriodSelector from "@/components/shared/TimePeriodSelector";
import NoDataPlaceholder from "@/components/shared/NoDataPlaceholder";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAnalyticsStore } from "@/store/analytics.store";
import {
  AnalyticsStat,
  SalesData,
  ProductPerformanceData,
  CustomerSegment,
  CustomerRetention,
  OrderStatusData,
  CategoryAnalytics,
  TimeRange,
} from "@/types/analytics";

const getTimeRangeText = (timePeriod: TimeRange) => {
  switch (timePeriod) {
    case "today":
      return "today";
    case "yesterday":
      return "yesterday";
    case "last7days":
      return "last 7 days";
    case "last30days":
      return "last 30 days";
    case "thisMonth":
      return "this month";
    case "lastMonth":
      return "last month";
    case "last3months":
      return "last 3 months";
    case "last6months":
      return "last 6 months";
    case "thisYear":
      return "this year";
    case "lastYear":
      return "last year";
    case "all":
      return "all time";
    default:
      return timePeriod;
  }
};

interface AnalyticsClientProps {
  overviewStats: AnalyticsStat[];
  salesData: SalesData[];
  productPerformanceData: ProductPerformanceData[];
  customerSegments: CustomerSegment[];
  customerRetention: CustomerRetention[];
  orderStatusData: OrderStatusData[];
  orderVolumeData: SalesData[];
  categoryAnalytics: CategoryAnalytics[];
  isLoading?: boolean;
}

export default function AnalyticsClient({
  overviewStats,
  salesData,
  productPerformanceData,
  customerSegments,
  customerRetention,
  orderStatusData,
  orderVolumeData,
  categoryAnalytics,
  isLoading = false,
}: AnalyticsClientProps) {
  const { timePeriod, setTimePeriod } = useAnalyticsStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <p className="text-default-500">
            Performance metrics for {getTimeRangeText(timePeriod)}
          </p>
        </div>
        <TimePeriodSelector
          value={timePeriod}
          onChange={setTimePeriod}
          className="w-40"
        />
      </div>

      {/* Overview Statistics */}
      <AnalyticsOverview data={overviewStats} />

      {/* Sales Chart and Order Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={salesData} />

        {orderStatusData.length > 0 ? (
          <OrderAnalytics
            statusData={orderStatusData}
            volumeData={orderVolumeData}
          />
        ) : (
          <NoDataPlaceholder text="No order data available for this time range" />
        )}
      </div>

      {/* Product Performance */}
      {productPerformanceData.length > 0 ? (
        <ProductPerformance data={productPerformanceData} />
      ) : (
        <NoDataPlaceholder text="No product performance data available for this time range" />
      )}

      {/* Customer Analytics */}
      {customerSegments.length > 0 && customerRetention.length > 0 ? (
        <CustomerAnalytics
          segments={customerSegments}
          retention={customerRetention}
        />
      ) : (
        <NoDataPlaceholder text="No customer data available for this time range" />
      )}

      {/* Category Performance */}
      {categoryAnalytics.length > 0 ? (
        <CategoryPerformance data={categoryAnalytics} />
      ) : (
        <NoDataPlaceholder text="No category data available for this time range" />
      )}
    </div>
  );
}
