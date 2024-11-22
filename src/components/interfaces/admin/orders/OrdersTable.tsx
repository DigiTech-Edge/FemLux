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
  PackageCheck,
  Search,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Order } from "@/lib/types/orders";
import OrderDetailsModal from "./OrderDetailsModal";

interface OrdersTableProps {
  orders: Order[];
}

const rowsPerPageOptions = [5, 10, 15, 20, 25, 30];

const statusColorMap = {
  pending: "warning",
  processing: "primary",
  delivered: "success",
  cancelled: "danger",
} as const;

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRowsPerPage, setSelectedRowsPerPage] = React.useState(
    new Set(["10"])
  );
  const [page, setPage] = React.useState(1);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    if (filterValue) {
      filtered = filtered.filter(
        (order) =>
          order.customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          order.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    return filtered;
  }, [orders, filterValue, selectedStatus]);

  const pages = Math.ceil(filteredOrders.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredOrders.slice(start, end);
  }, [page, filteredOrders, rowsPerPage]);

  const columns = [
    { name: "ORDER", uid: "order" },
    { name: "CUSTOMER", uid: "customer" },
    { name: "DATE", uid: "date" },
    { name: "STATUS", uid: "status" },
    { name: "TOTAL", uid: "total" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback((order: Order, columnKey: React.Key) => {
    switch (columnKey) {
      case "order":
        return (
          <div className="flex flex-col">
            <p className="text-bold">{order.id}</p>
            <p className="text-tiny text-default-500">
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </p>
          </div>
        );
      case "customer":
        return (
          <User
            name={order.customer.name}
            description={order.customer.email}
            avatarProps={{
              src: order.customer.avatar,
              size: "sm",
            }}
          />
        );
      case "date":
        return (
          <div className="flex flex-col">
            <p className="text-bold">
              {new Date(order.date).toLocaleDateString()}
            </p>
            <p className="text-tiny text-default-500">
              {new Date(order.date).toLocaleTimeString()}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[order.status]}
            size="sm"
            variant="flat"
          >
            {order.status}
          </Chip>
        );
      case "total":
        return (
          <p className="text-bold">{formatCurrency(order.total)}</p>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setSelectedOrder(order)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            {order.status === "pending" && (
              <Tooltip content="Process order">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="primary"
                  onPress={() => {
                    // Handle process order
                  }}
                >
                  <PackageCheck className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
            {order.status === "processing" && (
              <Tooltip content="Mark as delivered">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="success"
                  onPress={() => {
                    // Handle mark as delivered
                  }}
                >
                  <Truck className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-default-100 rounded-lg">
          <div className="flex flex-1 gap-4 items-center w-full sm:w-auto">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search orders..."
              startContent={<Search className="w-4 h-4 text-default-400" />}
              value={filterValue}
              onClear={() => setFilterValue("")}
              onValueChange={setFilterValue}
            />
            <Select
              className="w-full sm:max-w-[28%]"
              placeholder="Status"
              selectedKeys={[selectedStatus]}
              onChange={(e) => setSelectedStatus(e.target.value)}
              startContent={<SlidersHorizontal className="w-4 h-4 text-default-400" />}
            >
              <SelectItem key="all" value="all">
                All Status
              </SelectItem>
              <SelectItem key="pending" value="pending">
                Pending
              </SelectItem>
              <SelectItem key="processing" value="processing">
                Processing
              </SelectItem>
              <SelectItem key="delivered" value="delivered">
                Delivered
              </SelectItem>
              <SelectItem key="cancelled" value="cancelled">
                Cancelled
              </SelectItem>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table
          aria-label="Orders table"
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
                <div className="text-3xl mb-2">📦</div>
                <div className="text-lg font-semibold">No orders found</div>
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
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
