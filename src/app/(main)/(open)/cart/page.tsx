"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "@nextui-org/react";
import CartItem from "@/components/interfaces/cart/CartItem";
import CartSummary from "@/components/interfaces/cart/CartSummary";
import EmptyCart from "@/components/interfaces/cart/EmptyCart";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const { items, updateQuantity, switchVariant, removeItem } = useCartStore();

  if (!items) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="md:container mx-auto py-8">
      <div className="flex items-center justify-center mb-8 gap-3">
        <div className="p-3 rounded-full bg-pink-100">
          <ShoppingBag className="w-6 h-6 text-pink-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Shopping Cart</h1>
        <span className="px-3 py-1 text-sm bg-pink-100 text-pink-600 rounded-full">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.productId, item.variantId, quantity)
                }
                onSwitchVariant={(newVariantId) =>
                  switchVariant(item.productId, item.variantId, newVariantId)
                }
                onRemove={() => removeItem(item.productId, item.variantId)}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
