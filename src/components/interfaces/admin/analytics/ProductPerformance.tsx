"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/helpers";
import { ProductPerformanceData } from "@/lib/types/analytics";

interface ProductPerformanceProps {
  data: ProductPerformanceData[];
}

export default function ProductPerformance({ data }: ProductPerformanceProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Performance</h3>
      <Table aria-label="Product performance table">
        <TableHeader>
          <TableColumn>PRODUCT</TableColumn>
          <TableColumn>SALES</TableColumn>
          <TableColumn>REVENUE</TableColumn>
          <TableColumn>GROWTH</TableColumn>
          <TableColumn>STOCK</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {product.name}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                >
                  {product.sales.toLocaleString()}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {formatCurrency(product.revenue)}
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-1"
                >
                  <span
                    className={`${
                      product.growth >= 0 ? "text-success-500" : "text-danger-500"
                    }`}
                  >
                    {product.growth >= 0 ? "+" : ""}
                    {product.growth}%
                  </span>
                </motion.div>
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                >
                  <span
                    className={`${
                      product.stock > 20
                        ? "text-success-500"
                        : product.stock > 10
                        ? "text-warning-500"
                        : "text-danger-500"
                    }`}
                  >
                    {product.stock}
                  </span>
                </motion.div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
