"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Link } from "@nextui-org/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/store/cart";
import { formatCurrency } from "@/helpers";
import { cn } from "@/helpers/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onSwitchVariant: (variantId: string) => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onSwitchVariant,
  onRemove,
}: CartItemProps) {
  const handleIncrement = () => {
    if (item.variant.stock > item.quantity) {
      onUpdateQuantity(item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <Link
          href={`/shop/${item.productId}`}
          className="relative w-full sm:w-40 h-40 rounded-lg overflow-hidden group"
        >
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/shop/${item.productId}`}
                className="text-lg font-semibold hover:text-pink-600 transition-colors"
              >
                {item.product.name}
              </Link>
              <p className="mt-2 text-pink-600 font-semibold">
                {formatCurrency(item.variant.price)}
              </p>

              {/* Variant Selection */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Size:</p>
                <div className="flex flex-wrap gap-1">
                  {item.product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => onSwitchVariant(variant.id)}
                      disabled={variant.stock === 0}
                      className={cn(
                        "text-xs px-2 py-1 rounded-md transition-colors",
                        variant.id === item.variant.id
                          ? "bg-pink-500 text-white"
                          : variant.stock > 0
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Quantity:</p>
                <div className="inline-flex items-center rounded-lg bg-gray-100">
                  <button
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1}
                    className={cn(
                      "p-2 rounded-l-lg transition-colors",
                      item.quantity > 1
                        ? "hover:bg-gray-200 text-gray-700"
                        : "text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-700">
                    {item.quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={item.quantity >= item.variant.stock}
                    className={cn(
                      "p-2 rounded-r-lg transition-colors",
                      item.quantity < item.variant.stock
                        ? "hover:bg-gray-200 text-gray-700"
                        : "text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {/* <p className="mt-2 text-sm text-gray-500">
                  {item.variant.stock} available
                </p> */}
              </div>
            </div>

            {/* Delete Button */}
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={onRemove}
              className="group"
            >
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
