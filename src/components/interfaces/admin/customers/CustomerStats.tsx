"use client";

import { Card, CardBody } from "@nextui-org/react";
import { Users, UserCheck, CreditCard, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/helpers";

interface CustomerStatsProps {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function CustomerStats({
  totalCustomers,
  activeCustomers,
  totalRevenue,
  averageOrderValue,
}: CustomerStatsProps) {
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: CreditCard,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
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
