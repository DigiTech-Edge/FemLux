'use client'

import React from 'react'
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
} from '@nextui-org/react'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Order } from '@/lib/types/user'
import { cn } from '@/helpers/utils'

interface OrdersTabProps {
  orders: Order[]
}

const statusColorMap = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'danger',
} as const

export default function OrdersTab({ orders }: OrdersTabProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    onOpen()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Order History</h3>
      </div>

      <Table aria-label="Orders table">
        <TableHeader>
          <TableColumn>ORDER #</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[order.status]}
                  variant="flat"
                  size="sm"
                >
                  {order.status}
                </Chip>
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => handleViewOrder(order)}
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div>
                  <h3 className="text-xl">Order #{selectedOrder?.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {selectedOrder && new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody className="pb-6">
                {selectedOrder && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.street}<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                          {selectedOrder.shippingAddress.country}
                        </p>
                      </div>
                      <Chip
                        color={statusColorMap[selectedOrder.status]}
                        variant="flat"
                      >
                        {selectedOrder.status}
                      </Chip>
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div>
                        <h4 className="font-medium mb-2">Tracking Information</h4>
                        <p className="text-sm text-gray-600">
                          Tracking Number: {selectedOrder.trackingNumber}<br />
                          Estimated Delivery: {selectedOrder.estimatedDelivery}
                        </p>
                      </div>
                    )}

                    <Divider />

                    <div>
                      <h4 className="font-medium mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <Card key={item.productId} className="shadow-sm">
                            <CardBody>
                              <div className="flex gap-4">
                                <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.name}</h5>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="text-sm font-medium">
                                    ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Divider />

                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Total</h4>
                      <p className="text-xl font-semibold">
                        ${selectedOrder.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  )
}
