"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
} from "@nextui-org/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/helpers";
import { CategoryAnalytics } from "@/lib/types/analytics";

interface CategoryPerformanceProps {
  data: CategoryAnalytics[];
}

export default function CategoryPerformance({
  data,
}: CategoryPerformanceProps) {
  const maxRevenue = Math.max(...data.map((cat) => cat.revenue));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Category Performance</h3>

      <Table aria-label="Category performance table">
        <TableHeader>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>SALES</TableColumn>
          <TableColumn>REVENUE</TableColumn>
          <TableColumn>AVG ORDER VALUE</TableColumn>
          <TableColumn>GROWTH</TableColumn>
          <TableColumn>PERFORMANCE</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((category, index) => (
            <TableRow key={category.category}>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {category.category}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                >
                  {category.sales.toLocaleString()}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {formatCurrency(category.revenue)}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                >
                  {formatCurrency(category.averageOrderValue)}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                  className="flex items-center gap-1"
                >
                  {category.growth > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-success-500" />
                      <span className="text-success-500">
                        {category.growth}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-danger-500" />
                      <span className="text-danger-500">
                        {Math.abs(category.growth)}%
                      </span>
                    </>
                  )}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  className="w-full"
                >
                  <Progress
                    aria-label="Category revenue"
                    size="sm"
                    value={(category.revenue / maxRevenue) * 100}
                    color={
                      category.growth > 10
                        ? "success"
                        : category.growth > 0
                        ? "primary"
                        : "danger"
                    }
                  />
                </motion.div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
