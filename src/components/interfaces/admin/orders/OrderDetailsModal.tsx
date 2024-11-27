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
  Card,
  CardBody,
  Tabs,
  Tab,
  ScrollShadow,
  Image,
  Avatar,
} from "@nextui-org/react";
import { formatCurrency } from "@/helpers";
import { getStatusActions } from "@/helpers/orderStatusActions";
import type { Order } from "@/types/orders";
import {
  MapPin,
  Package,
  Phone,
  Truck,
  ShoppingBag,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Mail,
  RefreshCw,
  Settings,
  User,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColorMap = {
  PENDING: "warning",
  PROCESSING: "primary",
  DELIVERED: "success",
  SHIPPED: "secondary",
  CANCELLED: "danger",
} as const;

const statusIconMap = {
  PENDING: Clock,
  PROCESSING: Package,
  DELIVERED: CheckCircle2,
  SHIPPED: Truck,
  CANCELLED: XCircle,
} as const;

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const StatusIcon = statusIconMap[order.status];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <Chip
                  startContent={<StatusIcon className="w-4 h-4" />}
                  color={statusColorMap[order.status]}
                  variant="flat"
                >
                  {order.status}
                </Chip>
                <span className="text-default-500">
                  Order #{order.orderNumber}
                </span>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody>
              <Tabs
                variant="underlined"
                color="primary"
                aria-label="Order details tabs"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-2 h-12",
                }}
              >
                <Tab
                  key="details"
                  title={
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Order Details</span>
                    </div>
                  }
                >
                  <div className="mt-4 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-default-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={order.user?.image || ""}
                              className="w-4 h-4"
                            />
                            <span>{order.user?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-default-400" />
                            <span>{order.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-default-400" />
                            <span>{order.user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-default-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Shipping Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-default-400 mt-1" />
                          <div>
                            <p className="font-medium">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-default-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Order Timeline
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-default-400" />
                          <span>
                            Created:{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-default-400" />
                          <span>
                            Last Update:{" "}
                            {new Date(order.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-default-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Order Management
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {getStatusActions(order.status).map((action, index) => (
                          <Button
                            key={index}
                            color={action.color}
                            variant="flat"
                            startContent={<action.icon className="w-4 h-4" />}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab
                  key="items"
                  title={
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Items</span>
                    </div>
                  }
                >
                  <ScrollShadow className="max-h-[600px]">
                    <div className="space-y-4 mt-4">
                      {order.items.map((item, index) => (
                        <Card key={index} className="shadow-none border-1">
                          <CardBody className="p-3">
                            <div className="flex gap-4">
                              <Image
                                alt={item.productName}
                                className="object-cover rounded-lg"
                                src={item.productImage}
                                width={100}
                                height={100}
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
                  </ScrollShadow>

                  <Divider className="my-4" />

                  <Card className="shadow-none border-1 bg-default-50">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <div className="text-right">
                          <p className="text-small text-default-500">
                            {order.items.length} items,{" "}
                            {order.items.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )}{" "}
                            units
                          </p>
                          <p className="text-xl font-bold mt-1">
                            Total: {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
