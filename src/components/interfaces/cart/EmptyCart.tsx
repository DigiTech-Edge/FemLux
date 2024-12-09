"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ShoppingBag size={64} className="mb-6 text-default-400" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold mb-2"
      >
        Your cart is empty
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-default-500 mb-8"
      >
        Looks like you haven&apos;t added anything to your cart yet
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/shop">
          <Button
            size="lg"
            color="primary"
            variant="shadow"
            className="font-semibold"
          >
            Start Shopping
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
