"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/helpers";
import { AnalyticsStat } from "@/types/analytics";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Users,
} from "lucide-react";

interface AnalyticsOverviewProps {
  data: AnalyticsStat[];
}

const iconMap = {
  "Total Revenue": DollarSign,
  "Total Orders": ShoppingBag,
  "Average Order Value": CreditCard,
  "Active Customers": Users,
};

export default function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {data.map((stat, index) => {
        const Icon = iconMap[stat.title as keyof typeof iconMap];
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardBody className="flex flex-row items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    stat.changeType === "increase"
                      ? "bg-success-100 text-success-500"
                      : "bg-danger-100 text-danger-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-small text-default-500">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold">
                      {stat.title.includes("Revenue") ||
                      stat.title.includes("Value")
                        ? formatCurrency(stat.value)
                        : stat.value.toLocaleString()}
                    </p>
                    <div
                      className={`flex items-center text-small ${
                        stat.changeType === "increase"
                          ? "text-success-500"
                          : "text-danger-500"
                      }`}
                    >
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  </div>
                  <p className="text-tiny text-default-400">
                    vs last {stat.timeRange}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
