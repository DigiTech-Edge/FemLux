"use client";

import { Card, CardBody } from "@nextui-org/react";
import { ShoppingBag, PackageCheck, Clock, CreditCard } from "lucide-react";
import { formatCurrency } from "@/helpers";

interface OrdersStatsProps {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function OrdersStats({
  totalOrders,
  deliveredOrders,
  pendingOrders,
  totalRevenue,
}: OrdersStatsProps) {
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: PackageCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: CreditCard,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardBody className="flex flex-row items-center gap-4">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-small text-default-500">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
