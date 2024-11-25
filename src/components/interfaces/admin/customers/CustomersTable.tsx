"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Pagination,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import {
  Eye,
  Search,
  SlidersHorizontal,
  Mail,
  ShoppingBag,
  Lock,
  LockOpen,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Customer } from "@/lib/types/customers";
import CustomerDetailsModal from "./CustomerDetailsModal";

interface CustomersTableProps {
  customers: Customer[];
}

const rowsPerPageOptions = [5, 10, 15, 20, 25, 30];

const statusColorMap = {
  active: "success",
  inactive: "warning",
  blocked: "danger",
} as const;

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRowsPerPage, setSelectedRowsPerPage] = React.useState(
    new Set(["10"])
  );
  const [page, setPage] = React.useState(1);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  // Filter customers
  const filteredCustomers = React.useMemo(() => {
    let filtered = [...customers];

    if (filterValue) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          customer.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          customer.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === statusFilter
      );
    }

    return filtered;
  }, [customers, filterValue, statusFilter]);

  const pages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredCustomers.slice(start, end);
  }, [page, filteredCustomers, rowsPerPage]);

  const columns = [
    { name: "CUSTOMER", uid: "customer" },
    { name: "STATUS", uid: "status" },
    { name: "ORDERS", uid: "orders" },
    { name: "TOTAL SPENT", uid: "spent" },
    { name: "JOINED", uid: "joined" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key) => {
      switch (columnKey) {
        case "customer":
          return (
            <User
              name={customer.name}
              description={customer.email}
              avatarProps={{
                src: customer.avatar,
                size: "sm",
              }}
            />
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[customer.status]}
              size="sm"
              variant="flat"
            >
              {customer.status}
            </Chip>
          );
        case "orders":
          return (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-default-400" />
              <span>{customer.totalOrders}</span>
            </div>
          );
        case "spent":
          return <span>{formatCurrency(customer.totalSpent)}</span>;
        case "joined":
          return (
            <span>{new Date(customer.dateJoined).toLocaleDateString()}</span>
          );
        case "actions":
          return (
            <div className="flex items-center gap-2">
              <Tooltip content="View details">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedCustomer(customer)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Send email">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => {
                    window.location.href = `mailto:${customer.email}`;
                  }}
                >
                  <Mail className="w-4 h-4" color="blue" />
                </Button>
              </Tooltip>
              <Tooltip content={customer.status === "blocked" ? "Unblock customer" : "Block customer"}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color={customer.status === "blocked" ? "success" : "danger"}
                  onPress={() => {
                    // TODO: Implement block/unblock functionality
                    console.log(`${customer.status === "blocked" ? "Unblock" : "Block"} customer:`, customer.id);
                  }}
                >
                  {customer.status === "blocked" ? (
                    <LockOpen className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-default-100 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            isClearable
            className="w-full sm:max-w-[60%]"
            placeholder="Search customers..."
            startContent={<Search className="w-4 h-4 text-default-400" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:w-fit">
            <Select
              className="w-full sm:w-[140px]"
              size="sm"
              placeholder="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Customers table"
        bottomContent={
          pages > 1 ? (
            <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-small text-default-400 whitespace-nowrap">
                  Rows per page:
                </span>
                <Select
                  size="sm"
                  selectedKeys={selectedRowsPerPage}
                  onSelectionChange={(keys) => {
                    setSelectedRowsPerPage(keys as Set<string>);
                    const selectedValue = Array.from(keys)[0];
                    setRowsPerPage(Number(selectedValue));
                  }}
                  className="w-20"
                  aria-label="Rows per page"
                >
                  {rowsPerPageOptions.map((value) => (
                    <SelectItem
                      key={value.toString()}
                      value={value.toString()}
                      className="text-small"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex justify-center sm:justify-end">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
              <div className="hidden sm:block" />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={
            <div className="flex flex-col items-center justify-center h-48 text-default-400">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-lg font-semibold">No customers found</div>
              <div className="text-sm">
                Try adjusting your search or filters
              </div>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
