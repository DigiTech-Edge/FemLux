import CustomersTable from "@/components/interfaces/admin/customers/CustomersTable";
import CustomerStats from "@/components/interfaces/admin/customers/CustomerStats";
import { mockCustomers, customerStats } from "@/lib/data/admin/customers";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomerStats {...customerStats} />
      <CustomersTable customers={mockCustomers} />
    </div>
  );
}
