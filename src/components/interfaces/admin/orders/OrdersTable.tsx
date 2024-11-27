"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Pagination,
  Select,
  SelectItem,
  Input,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Eye, Search, MoreVertical } from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Order } from "@/types/orders";
import OrderDetailsModal from "./OrderDetailsModal";
import { updateOrderStatus } from "@/services/actions/orders.actions";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { getStatusActions, StatusAction } from "@/helpers/orderStatusActions";
import { OrderStatus } from "@prisma/client";

interface OrdersTableProps {
  orders: Order[];
}

const rowsPerPageOptions = [5, 10, 15, 20, 25, 30];

const statusColorMap = {
  PENDING: "warning",
  PROCESSING: "primary",
  DELIVERED: "success",
  SHIPPED: "secondary",
  CANCELLED: "danger",
} as const;

type ActionItem =
  | StatusAction
  | {
      key: "view";
      label: string;
      icon: typeof Eye;
      color: "default";
    };

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const filteredOrders = useMemo(() => {
    let filteredData = [...orders];

    if (hasSearchFilter) {
      filteredData = filteredData.filter(
        (order) =>
          order.orderNumber
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredData = filteredData.filter(
        (order) => order.status === statusFilter
      );
    }

    return filteredData;
  }, [orders, filterValue, statusFilter]);

  const pages = Math.ceil(filteredOrders.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredOrders.slice(start, end);
  }, [page, filteredOrders, rowsPerPage]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onStatusFilterChange = React.useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    toast.loading("Updating order status...");
    const response = await updateOrderStatus(orderId, newStatus);
    toast.dismiss();
    if (response.success) {
      toast.success("Order status updated successfully");
    } else {
      toast.error(response.error || "Failed to update order status");
    }
  };

  const topContent = React.useMemo(
    () => (
      <div className="space-y-4">
        <div className="flex flex-col items-center sm:flex-row gap-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by order number or customer..."
            startContent={<Search className="text-default-300" size={20} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex flex-1 gap-4 items-center justify-end">
            <Select
              label="Status"
              placeholder="Select status"
              selectedKeys={[statusFilter]}
              className="max-w-xs"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <SelectItem key="all" value="all">
                All Status
              </SelectItem>
              <SelectItem key="PENDING" value="PENDING">
                Pending
              </SelectItem>
              <SelectItem key="PROCESSING" value="PROCESSING">
                Processing
              </SelectItem>
              <SelectItem key="DELIVERED" value="DELIVERED">
                Delivered
              </SelectItem>
              <SelectItem key="CANCELLED" value="CANCELLED">
                Cancelled
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>
    ),
    [filterValue, onSearchChange, statusFilter]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full md:flex-row flex-col-reverse gap-4 justify-between items-center">
        <div className="flex flex-col items-center gap-2">
          <Select
            label="Rows per page"
            size="sm"
            className="w-32"
            selectedKeys={[rowsPerPage.toString()]}
            onChange={onRowsPerPageChange}
          >
            {rowsPerPageOptions.map((value) => (
              <SelectItem key={value} textValue={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </Select>
        </div>
        {pages > 0 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        )}
        <div className="max-md:hidden" />
      </div>
    );
  }, [page, pages, rowsPerPage]);

  return (
    <>
      <Table
        aria-label="Orders table"
        isHeaderSticky
        bottomContent={bottomContent}
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>ORDER</TableColumn>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ITEMS</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-12 h-12 text-default-300 mb-4" />
              <p className="text-default-300 text-lg">No Orders found</p>
              <p className="text-default-300 text-sm">
                Your orders will appear here.
              </p>
            </div>
          }
          items={items}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-bold">{item.orderNumber}</p>
                </div>
              </TableCell>
              <TableCell>
                <User
                  name={item.user?.name}
                  description={item.user?.email}
                  avatarProps={{
                    src: item.user?.image || undefined,
                    showFallback: true,
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={statusColorMap[item.status]}
                  size="sm"
                  variant="flat"
                >
                  {item.status.toLowerCase()}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-bold">{item.items.length} items</p>
                  <p className="text-tiny text-default-500">
                    {formatCurrency(item.totalAmount)}
                  </p>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="relative flex justify-center items-center gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <MoreVertical className="w-6 h-6" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Order Actions"
                      variant="flat"
                      onAction={async (key) => {
                        if (key === "view") {
                          handleViewOrder(item);
                        } else {
                          await handleStatusUpdate(item.id, key as OrderStatus);
                        }
                      }}
                      items={[
                        {
                          key: "view",
                          label: "View Details",
                          icon: Eye,
                          color: "default",
                        } as ActionItem,
                        ...getStatusActions(item.status),
                      ]}
                    >
                      {(action) => (
                        <DropdownItem
                          key={action.key}
                          startContent={<action.icon className="w-4 h-4" />}
                          className={`text-${action.color}`}
                          color={action.color}
                        >
                          {action.label}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}
