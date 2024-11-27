"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Divider } from "@nextui-org/react";
import { ShoppingBag, CreditCard } from "lucide-react";
import { CartItem as CartItemType } from "@/store/cart";
import { formatCurrency } from "../../../helpers/currency";

interface CartSummaryProps {
  items: CartItemType[];
  onCheckout: () => void;
}

export default function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const SummaryRow = ({
    label,
    value,
    isTotal = false,
  }: {
    label: string;
    value: number;
    isTotal?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center ${
        isTotal ? "font-semibold text-lg" : ""
      }`}
    >
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="sticky top-4 shadow-lg border-pink-50">
        <CardBody className="gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-pink-100">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-xl font-semibold">Order Summary</h2>
          </div>

          <div className="space-y-3">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Shipping" value={shipping} />
            {shipping > 0 && (
              <p className="text-xs text-pink-600">
                Add {formatCurrency(100 - subtotal)} more for free shipping!
              </p>
            )}
            <Divider className="my-3" />
            <SummaryRow label="Total" value={total} isTotal />
          </div>

          <Button
            size="lg"
            onPress={onCheckout}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-400 text-white shadow-lg"
            startContent={<CreditCard className="w-4 h-4" />}
          >
            Checkout ({formatCurrency(total)})
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-default-400">
            <span>Secure checkout powered by</span>
            <span className="font-semibold text-default-600">Paystack</span>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
