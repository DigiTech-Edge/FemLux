"use client";

import AnalyticsOverview from './AnalyticsOverview';
import SalesChart from './SalesChart';
import ProductPerformance from './ProductPerformance';
import CustomerAnalytics from './CustomerAnalytics';
import OrderAnalytics from './OrderAnalytics';
import CategoryPerformance from './CategoryPerformance';
import { 
  AnalyticsStat, 
  SalesData, 
  ProductPerformanceData,
  CustomerSegment,
  CustomerRetention,
  OrderAnalytics as OrderAnalyticsType,
  CategoryAnalytics as CategoryAnalyticsType
} from '@/lib/types/analytics';

interface AnalyticsClientProps {
  overviewStats: AnalyticsStat[];
  salesData: SalesData[];
  productPerformanceData: ProductPerformanceData[];
  customerSegments: CustomerSegment[];
  customerRetention: CustomerRetention[];
  orderStatusData: OrderAnalyticsType[];
  orderVolumeData: SalesData[];
  categoryAnalytics: CategoryAnalyticsType[];
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
}: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <AnalyticsOverview data={overviewStats} />

      {/* Sales Chart and Order Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={salesData} />
        <OrderAnalytics 
          statusData={orderStatusData}
          volumeData={orderVolumeData}
        />
      </div>

      {/* Product Performance */}
      <ProductPerformance data={productPerformanceData} />

      {/* Customer Analytics */}
      <CustomerAnalytics 
        segments={customerSegments}
        retention={customerRetention}
      />

      {/* Category Performance */}
      <CategoryPerformance data={categoryAnalytics} />
    </div>
  );
}
