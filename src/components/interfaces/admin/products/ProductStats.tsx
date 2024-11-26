"use client";

import { Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Box,
  DollarSign,
  PackageCheck,
  PackageX,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/helpers";

interface ProductStats {
  total: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
  newProducts: number;
}

interface ProductStatsProps {
  stats: ProductStats;
}

const ProductStats = ({ stats }: ProductStatsProps) => {
  const cards = [
    {
      title: "Total Products",
      value: stats.total,
      icon: Box,
      color: "text-blue-500",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: PackageCheck,
      color: "text-green-500",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: PackageX,
      color: "text-red-500",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: PackageX,
      color: "text-orange-500",
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-pink-500",
    },
    {
      title: "New Products",
      value: stats.newProducts,
      icon: Sparkles,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${card.color.replace(
                    "text",
                    "bg"
                  )}/10`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-default-500">{card.title}</p>
                  <p className="text-lg font-semibold">{card.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductStats;
