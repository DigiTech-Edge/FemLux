"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Chip,
  Card,
  CardBody,
  Divider,
  Image,
  Pagination,
} from "@nextui-org/react";
import { Eye, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { OrderWithDetails } from "@/types/order";
import { formatCurrency } from "@/helpers";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

interface OrdersTabProps {
  orders: OrderWithDetails[];
  onCancel: (orderId: string) => Promise<void>;
}

const statusColorMap = {
  PENDING: "warning",
  PROCESSING: "primary",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "danger",
} as const;

const ROWS_PER_PAGE = 10;

export default function OrdersTab({ orders, onCancel }: OrdersTabProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] =
    React.useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [orderToCancel, setOrderToCancel] = React.useState<string | null>(null);

  const pages = Math.ceil(orders.length / ROWS_PER_PAGE);
  const items = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return orders.slice(start, end);
  }, [orders, page]);

  const handleViewOrder = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    try {
      setIsLoading(true);
      await onCancel(orderToCancel);
      setShowCancelConfirm(false);
      onClose();
    } finally {
      setIsLoading(false);
      setOrderToCancel(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div >
        <h3 className="text-xl font-semibold">Order History</h3>
        <p className="text-default-500">View your order history</p>
      </div>

      <Table aria-label="Orders table">
        <TableHeader>
          <TableColumn>ORDER #</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TOTAL</TableColumn>
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
        >
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[order.status]}
                  variant="flat"
                  size="sm"
                >
                  {order.status}
                </Chip>
              </TableCell>
              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleViewOrder(order)}
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={pages}
            color="primary"
            page={page}
            onChange={setPage}
          />
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl">Order Details</h3>
                  <p className="text-small text-default-500">
                    Order #{selectedOrder?.orderNumber}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-6">
                    {/* Order Status */}
                    <Card>
                      <CardBody>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-small text-default-500">
                              Status
                            </p>
                            <Chip
                              color={statusColorMap[selectedOrder.status]}
                              variant="flat"
                              size="sm"
                            >
                              {selectedOrder.status}
                            </Chip>
                          </div>
                          {selectedOrder.status === "PENDING" && (
                            <Button
                              color="danger"
                              variant="flat"
                              size="sm"
                              onPress={() =>
                                handleCancelClick(selectedOrder.id)
                              }
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-medium font-semibold mb-3">Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item) => (
                          <Card key={item.id} className="shadow-none border-1">
                            <CardBody className="p-3">
                              <div className="flex gap-4">
                                <Image
                                  alt={item.productName}
                                  className="object-cover rounded-lg"
                                  src={item.productImage}
                                  width={80}
                                  height={80}
                                />
                                <div className="flex-grow space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">
                                        {item.productName}
                                      </h4>
                                      <div className="flex flex-wrap gap-3 text-small text-default-500">
                                        <div>Size: {item.size}</div>
                                        <div>Quantity: {item.quantity}</div>
                                        <div>
                                          Price: {formatCurrency(item.price)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">
                                        Total:{" "}
                                        {formatCurrency(
                                          item.price * item.quantity
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <Card>
                      <CardBody>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <p className="text-default-500">Shipping Address</p>
                            <p className="text-right">
                              {selectedOrder.shippingAddress}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-default-500">Phone Number</p>
                            <p>{selectedOrder.phoneNumber}</p>
                          </div>
                          <Divider />
                          <div className="flex justify-between">
                            <p className="font-semibold">Total Amount</p>
                            <p className="font-semibold">
                              {formatCurrency(selectedOrder.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => {
          setShowCancelConfirm(false);
          setOrderToCancel(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        loading={isLoading}
      />
    </motion.div>
  );
}
