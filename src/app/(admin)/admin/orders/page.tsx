import OrdersTable from "@/components/interfaces/admin/orders/OrdersTable";
import OrdersStats from "@/components/interfaces/admin/orders/OrdersStats";
import { getOrders, getOrderStats } from "@/services/actions/orders.actions";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";

export default async function OrdersPage() {
  const ordersResponse = await getOrders();
  const statsResponse = await getOrderStats();

  const orders = ordersResponse.success ? ordersResponse.data : [];
  const stats = statsResponse.success
    ? statsResponse.data
    : {
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        shippedOrders: 0,
      };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        }
      >
        <OrdersStats stats={stats!} />
        <OrdersTable orders={orders ?? []} />
      </Suspense>
    </div>
  );
}
