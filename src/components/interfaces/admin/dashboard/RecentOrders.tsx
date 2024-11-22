"use client";

import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  User,
  ScrollShadow,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/helpers";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type ChipColor = "warning" | "primary" | "success" | "danger";

interface RecentOrdersProps {
  data: Array<{
    id: string;
    customer: {
      name: string;
      email: string;
      avatar: string;
    };
    amount: number;
    status: OrderStatus;
    date: string;
  }>;
}

const statusColorMap: Record<OrderStatus, ChipColor> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
  cancelled: "danger",
} as const;

const RecentOrders = ({ data }: RecentOrdersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <p className="text-default-500 text-sm">Latest customer orders</p>
        </div>

        <ScrollShadow className="max-h-[400px]">
          <Table aria-label="Recent orders table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <User
                      name={order.customer.name}
                      description={order.customer.email}
                      avatarProps={{
                        src: order.customer.avatar,
                        size: "sm",
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={statusColorMap[order.status]}
                    >
                      {order.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <time dateTime={order.date}>
                      {new Date(order.date).toLocaleDateString()}
                    </time>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollShadow>
      </Card>
    </motion.div>
  );
};

export default RecentOrders;
