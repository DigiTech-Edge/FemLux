"use client";

import { Card, CardBody } from "@nextui-org/react";
import { ShoppingBag, PackageCheck, Clock, Truck } from "lucide-react";
import { OrdersStats as OrdersStatsType } from "@/types/orders";

interface OrdersStatsProps {
  stats: OrdersStatsType;
}

export default function OrdersStats({ stats }: OrdersStatsProps) {
  const statsConfig = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: PackageCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Shipped Orders",
      value: stats.shippedOrders,
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => (
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
