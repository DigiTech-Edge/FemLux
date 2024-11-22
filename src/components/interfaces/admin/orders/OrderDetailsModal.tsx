"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Avatar,
  Card,
  CardBody,
  Tabs,
  Tab,
  ScrollShadow,
} from "@nextui-org/react";
import { formatCurrency } from "@/helpers";
import type { Order } from "@/lib/types/orders";
import {
  MapPin,
  CreditCard,
  Package,
  Mail,
  Phone,
  Truck,
  ShoppingBag,
  Clock,
  Calendar,
  User,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColorMap = {
  pending: "warning",
  processing: "primary",
  delivered: "success",
  cancelled: "danger",
} as const;

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const [selectedTab, setSelectedTab] = React.useState("details");

  if (!order) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="outside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>Order {order.id}</span>
                <Chip
                  className="capitalize"
                  color={statusColorMap[order.status]}
                  size="sm"
                  variant="flat"
                >
                  {order.status}
                </Chip>
              </div>
              <div className="flex items-center gap-2 text-small text-default-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(order.date).toLocaleDateString()}{" "}
                  {new Date(order.date).toLocaleTimeString()}
                </span>
              </div>
            </ModalHeader>

            <Divider />

            <div className="px-6 mt-4">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                variant="underlined"
                fullWidth
              >
                <Tab
                  key="details"
                  title={
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Order Details</span>
                    </div>
                  }
                />
                <Tab
                  key="customer"
                  title={
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Customer Info</span>
                    </div>
                  }
                />
                <Tab
                  key="shipping"
                  title={
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Shipping & Payment</span>
                    </div>
                  }
                />
              </Tabs>
            </div>

            <ModalBody>
              <ScrollShadow className="max-h-[calc(100vh-250px)]">
                {selectedTab === "details" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold">Order Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-default-200"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-default-100 rounded-lg">
                                    <Package className="w-6 h-6 text-default-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-small text-default-500">
                                      Qty: {item.quantity} x{" "}
                                      {formatCurrency(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Divider />
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {selectedTab === "customer" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <h4 className="text-lg font-semibold mb-4">
                          Customer Information
                        </h4>
                        <div className="flex items-center gap-6">
                          <Avatar
                            src={order.customer.avatar}
                            className="w-20 h-20"
                          />
                          <div className="space-y-2">
                            <p className="text-xl font-semibold">
                              {order.customer.name}
                            </p>
                            <div className="flex items-center gap-2 text-default-500">
                              <Mail className="w-4 h-4" />
                              <span>{order.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-default-500">
                              <Phone className="w-4 h-4" />
                              <span>+1 234-567-8900</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <h4 className="text-lg font-semibold mb-4">
                          Order History
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-success/10 rounded-full">
                              <ShoppingBag className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">Order Placed</p>
                              <p className="text-small text-default-500">
                                {new Date(order.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {order.status !== "pending" && (
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Clock className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Order Processing</p>
                                <p className="text-small text-default-500">
                                  {new Date(
                                    new Date(order.date).getTime() +
                                      24 * 60 * 60 * 1000
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                          {order.status === "delivered" && (
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-success/10 rounded-full">
                                <Truck className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <p className="font-medium">Order Delivered</p>
                                <p className="text-small text-default-500">
                                  {new Date(
                                    new Date(order.date).getTime() +
                                      72 * 60 * 60 * 1000
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {selectedTab === "shipping" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <h4 className="text-lg font-semibold mb-4">
                          Shipping Information
                        </h4>
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-default-100 rounded-lg">
                              <MapPin className="w-5 h-5 text-default-500" />
                            </div>
                            <div>
                              <p className="font-medium">Delivery Address</p>
                              <p className="text-default-500">
                                {order.shippingAddress.street}
                                <br />
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.zipCode}
                                <br />
                                {order.shippingAddress.country}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-default-100 rounded-lg">
                              <Truck className="w-5 h-5 text-default-500" />
                            </div>
                            <div>
                              <p className="font-medium">Tracking Number</p>
                              <p className="text-default-500">
                                {order.trackingNumber || "Not available yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <h4 className="text-lg font-semibold mb-4">
                          Payment Information
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-default-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-default-500" />
                          </div>
                          <div>
                            <p className="font-medium">Payment Method</p>
                            <p className="text-default-500">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </ScrollShadow>
            </ModalBody>

            <Divider />

            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
              {order.status === "pending" && (
                <Button
                  color="primary"
                  onPress={() => {
                    // Handle process order
                    onClose();
                  }}
                >
                  Process Order
                </Button>
              )}
              {order.status === "processing" && (
                <Button
                  color="success"
                  onPress={() => {
                    // Handle mark as delivered
                    onClose();
                  }}
                >
                  Mark as Delivered
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
