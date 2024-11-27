"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  useDisclosure,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import CartItem from "@/components/interfaces/cart/CartItem";
import CartSummary from "@/components/interfaces/cart/CartSummary";
import EmptyCart from "@/components/interfaces/cart/EmptyCart";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  saveInfo: boolean;
}

const mockUserDetails = {
  name: "",
  email: "sarah.wilson@example.com",
  phone: "+1 234 567 8900",
  address: "123 Fashion Street, Style City, SC 12345",
  notes: "",
};

export default function CartPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { items, updateQuantity, switchVariant, removeItem } = useCartStore();
  const [formData, setFormData] = React.useState<CheckoutDetails>({
    name: mockUserDetails.name,
    email: mockUserDetails.email,
    phone: mockUserDetails.phone,
    address: mockUserDetails.address,
    notes: mockUserDetails.notes,
    saveInfo: false,
  });

  const handleCheckout = () => {
    onOpen();
  };

  const handleSubmitOrder = () => {
    toast.success("Order placed successfully!");
    onClose();
    router.push("/");
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8 space-x-3">
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
          <CartSummary items={items} onCheckout={handleCheckout} />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Checkout Details</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    label="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                  <Textarea
                    label="Shipping Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                  <Textarea
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                  <Checkbox
                    isSelected={formData.saveInfo}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, saveInfo: value }))
                    }
                  >
                    Save these details for future purchases
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmitOrder}>
                  Confirm Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
