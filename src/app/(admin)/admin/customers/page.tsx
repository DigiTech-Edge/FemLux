import CustomersTable from "@/components/interfaces/admin/customers/CustomersTable";
import CustomerStats from "@/components/interfaces/admin/customers/CustomerStats";
import {
  fetchCustomers,
  fetchCustomerStats,
} from "@/services/actions/customers.actions";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const [customers, stats] = await Promise.all([
    fetchCustomers(),
    fetchCustomerStats(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomerStats {...stats} />
      <CustomersTable customers={customers} />
    </div>
  );
}
