import OrdersTable from "@/components/interfaces/admin/orders/OrdersTable";
import OrdersStats from "@/components/interfaces/admin/orders/OrdersStats";
import { mockOrders, orderStats } from "@/lib/data/admin/orders";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrdersStats {...orderStats} />
      <OrdersTable orders={mockOrders} />
    </div>
  );
}
