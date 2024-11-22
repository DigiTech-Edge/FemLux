"use client";

import { Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TrendingUp, Package, CreditCard, Users } from "lucide-react";
import { formatCurrency } from "@/helpers";

type StatType = 'sales' | 'orders' | 'average' | 'visitors';

interface StatCardData {
  title: string;
  value: number;
  change: number;
  type: StatType;
}

interface StatsCardsProps {
  data: StatCardData[];
}

const StatsCards = ({ data }: StatsCardsProps) => {
  const getIcon = (type: StatType) => {
    switch (type) {
      case 'sales':
        return TrendingUp;
      case 'orders':
        return Package;
      case 'average':
        return CreditCard;
      case 'visitors':
        return Users;
    }
  };

  const getColor = (type: StatType) => {
    switch (type) {
      case 'sales':
        return "text-green-500";
      case 'orders':
        return "text-blue-500";
      case 'average':
        return "text-purple-500";
      case 'visitors':
        return "text-pink-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => {
        const Icon = getIcon(item.type);
        const color = getColor(item.type);
        const formattedValue = item.type === 'sales' || item.type === 'average' 
          ? formatCurrency(item.value)
          : item.value.toLocaleString();

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${color.replace(
                    "text",
                    "bg"
                  )}/10`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div
                  className={`text-xs font-medium ${
                    item.change >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                </div>
              </div>
              <div>
                <p className="text-sm text-default-500">{item.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{formattedValue}</h3>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
