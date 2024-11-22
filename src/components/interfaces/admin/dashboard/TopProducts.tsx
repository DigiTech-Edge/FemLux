"use client";

import { Card, ScrollShadow } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/helpers";

interface TopProductsProps {
  data: Array<{
    id: string;
    name: string;
    sales: number;
    growth: number;
  }>;
}

const TopProducts = ({ data }: TopProductsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Top Products</h3>
          <p className="text-default-500 text-sm">Best performing products</p>
        </div>

        <ScrollShadow className="h-[300px]">
          <div className="space-y-6">
            {data.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {product.name}
                  </h4>
                  <p className="text-default-500 text-xs">
                    {formatCurrency(product.sales)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={
                      product.growth >= 0 ? "text-success" : "text-danger"
                    }
                    size={16}
                  />
                  <span
                    className={`text-sm ${
                      product.growth >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {product.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollShadow>
      </Card>
    </motion.div>
  );
};

export default TopProducts;
