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
} from "@nextui-org/react";
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Customer } from "@/lib/types/customers";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColorMap = {
  active: "success",
  inactive: "warning",
  blocked: "danger",
} as const;

export default function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsModalProps) {
  const [selectedTab, setSelectedTab] = React.useState("details");

  if (!customer) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>Customer Details</span>
                <Chip
                  className="capitalize"
                  color={statusColorMap[customer.status]}
                  size="sm"
                  variant="flat"
                >
                  {customer.status}
                </Chip>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                variant="underlined"
                aria-label="Customer details tabs"
              >
                <Tab
                  key="details"
                  title={
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Details</span>
                    </div>
                  }
                >
                  <Card className="mt-4">
                    <CardBody>
                      <div className="flex items-center gap-6 mb-6">
                        <Avatar
                          src={customer.avatar}
                          className="w-20 h-20"
                          isBordered
                        />
                        <div>
                          <h3 className="text-xl font-semibold">
                            {customer.name}
                          </h3>
                          <div className="flex items-center gap-2 text-default-500">
                            <Mail className="w-4 h-4" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-default-500">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </div>
                      <Divider className="my-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-small text-default-500">
                            Total Orders
                          </p>
                          <p className="text-large font-semibold">
                            {customer.totalOrders}
                          </p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">
                            Total Spent
                          </p>
                          <p className="text-large font-semibold">
                            {formatCurrency(customer.totalSpent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">
                            Last Order
                          </p>
                          <p className="text-large font-semibold">
                            {new Date(customer.lastOrderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">
                            Date Joined
                          </p>
                          <p className="text-large font-semibold">
                            {new Date(customer.dateJoined).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab
                  key="address"
                  title={
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Address</span>
                    </div>
                  }
                >
                  <Card className="mt-4">
                    <CardBody>
                      <div className="space-y-4">
                        <div>
                          <p className="text-small text-default-500">Street</p>
                          <p className="text-large">{customer.address.street}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-small text-default-500">City</p>
                            <p className="text-large">{customer.address.city}</p>
                          </div>
                          <div>
                            <p className="text-small text-default-500">State</p>
                            <p className="text-large">{customer.address.state}</p>
                          </div>
                          <div>
                            <p className="text-small text-default-500">
                              ZIP Code
                            </p>
                            <p className="text-large">
                              {customer.address.zipCode}
                            </p>
                          </div>
                          <div>
                            <p className="text-small text-default-500">Country</p>
                            <p className="text-large">
                              {customer.address.country}
                            </p>
                          </div>
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
