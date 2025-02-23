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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Eye,
  Search,
  Mail,
  MoreVertical,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Customer } from "@/types/customer";
import CustomerDetailsModal from "./CustomerDetailsModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { updateCustomerRoleAction } from "@/services/actions/customers.actions";
import toast from "react-hot-toast";

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
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRowsPerPage, setSelectedRowsPerPage] = React.useState(
    new Set(["10"])
  );
  const [page, setPage] = React.useState(1);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] =
    React.useState<Customer | null>(null);
  const [selectedCustomerForRole, setSelectedCustomerForRole] =
    React.useState<Customer | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [newRole, setNewRole] = React.useState<"admin" | "user">("user");
  const [isUpdatingRole, setIsUpdatingRole] = React.useState(false);

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

    if (roleFilter !== "all") {
      filtered = filtered.filter((customer) => customer.role === roleFilter);
    }

    return filtered;
  }, [customers, filterValue, roleFilter]);

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
    ...(customers[0]?.role !== undefined
      ? [
          {
            name: "ROLE",
            uid: "role",
            renderCell: (customer: Customer) => (
              <Chip
                color={customer.role === "admin" ? "success" : "default"}
                startContent={<Shield className="h-3 w-3" />}
                variant="flat"
                size="sm"
                className="capitalize p-2"
              >
                {customer.role || "user"}
              </Chip>
            ),
          },
        ]
      : []),
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleRoleUpdate = async () => {
    if (!selectedCustomerForRole) return;

    try {
      setIsUpdatingRole(true);
      await updateCustomerRoleAction(selectedCustomerForRole.id, newRole);
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsUpdatingRole(false);
      setIsRoleModalOpen(false);
      setSelectedCustomerForRole(null);
    }
  };

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key) => {
      const key = String(columnKey); // Convert Key to string

      switch (key) {
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
            <div className="flex items-center">
              <Tooltip content="View Details">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedCustomerForDetails(customer)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Send Email">
                <Button
                  as="a"
                  href={`mailto:${customer.email}`}
                  isIconOnly
                  size="sm"
                  variant="light"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </Tooltip>
              {customer.role !== undefined && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Actions">
                    <DropdownItem
                      key="change-role"
                      startContent={<Shield className="h-4 w-4" />}
                      onPress={() => {
                        setSelectedCustomerForRole(customer);
                        setNewRole(
                          customer.role === "admin" ? "user" : "admin"
                        );
                        setIsRoleModalOpen(true);
                      }}
                    >
                      Change to {customer.role === "admin" ? "User" : "Admin"}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
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
              placeholder="Role"
              selectedKeys={[roleFilter]}
              onChange={(e) => setRoleFilter(e.target.value)}
              startContent={<Shield className="h-4 w-4 text-default-400" />}
              disallowEmptySelection
            >
              <SelectItem key="all">All Roles</SelectItem>
              <SelectItem
                key="admin"
                startContent={<Shield className="h-4 w-4 text-success" />}
              >
                Admin
              </SelectItem>
              <SelectItem
                key="user"
                startContent={<Shield className="h-4 w-4" />}
              >
                User
              </SelectItem>
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
                  disallowEmptySelection
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
              {(columnKey) => {
                const column = columns.find(
                  (col) => col.uid === String(columnKey)
                );
                return (
                  <TableCell>
                    {column?.renderCell
                      ? column.renderCell(item)
                      : renderCell(item, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CustomerDetailsModal
        customer={selectedCustomerForDetails}
        isOpen={!!selectedCustomerForDetails}
        onClose={() => setSelectedCustomerForDetails(null)}
      />
      <DeleteConfirmationModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedCustomerForRole(null);
        }}
        onConfirm={handleRoleUpdate}
        title="Change User Role"
        description={`Are you sure you want to change ${selectedCustomerForRole?.name}'s role to ${newRole}? This will affect their access level.`}
        loading={isUpdatingRole}
        buttonText="Change"
      />
    </div>
  );
}
