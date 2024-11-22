import { Suspense } from "react";
import AnalyticsClient from "@/components/interfaces/admin/analytics/AnalyticsClient";
import {
  overviewStats,
  salesData,
  productPerformance,
  customerSegments,
  customerRetention,
  orderAnalytics,
  salesData as orderVolume,
  categoryAnalytics,
} from "@/lib/data/admin/analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsClient
          overviewStats={overviewStats}
          salesData={salesData}
          productPerformanceData={productPerformance}
          customerSegments={customerSegments}
          customerRetention={customerRetention}
          orderStatusData={orderAnalytics}
          orderVolumeData={orderVolume}
          categoryAnalytics={categoryAnalytics}
        />
      </Suspense>
    </div>
  );
}
