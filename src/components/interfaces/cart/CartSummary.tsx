"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { ShoppingBag, CreditCard, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../../../helpers/currency";
import { getProfile } from "@/services/actions/users.actions";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { initiatePayment } from "@/services/actions/orders.actions";
import { toast } from "react-hot-toast";

export default function CartSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { items, total } = useCartStore();
  const {
    data,
    error,
    isLoading: isLoadingProfile,
  } = useSWR("profile", async () => {
    try {
      const result = await getProfile();
      return result.profile;
    } catch (error) {
      throw error;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      shippingAddress: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        email: data.email || "",
        fullName: data.fullName || "",
        phoneNumber: "",
        shippingAddress: "",
      });
    }
  }, [data, reset]);

  const shipping = total > 100 ? 0 : 10;
  const grandTotal = total + shipping;

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
      <span>{formatCurrency(value)}</span>
    </div>
  );

  const onSubmit = async (formData: CheckoutFormValues) => {
    try {
      setIsLoading(true);
      if (!items) {
        throw new Error("No items in cart");
      }

      const result = await initiatePayment({
        email: formData.email,
        amount: grandTotal,
        items: items,
        shippingAddress: formData.shippingAddress,
        phoneNumber: formData.phoneNumber,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Redirect to Paystack payment page
      window.location.href = result.data.authorization_url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardBody className="gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingBag className="h-5 w-5" />
              <span>Order Summary</span>
            </div>
            <Divider />
            <div className="space-y-3">
              <SummaryRow label="Subtotal" value={total} />
              <SummaryRow label="Shipping" value={shipping} />
              {shipping > 0 && (
                <p className="text-xs text-pink-600">
                  Add {formatCurrency(100 - total)} more for free shipping!
                </p>
              )}
              <Divider />
              <SummaryRow label="Total" value={grandTotal} isTotal />
            </div>
            <Button
              color="primary"
              size="lg"
              startContent={<CreditCard className="h-5 w-5" />}
              className="w-full"
              onPress={() => !isLoadingProfile && !error && setIsOpen(true)}
              isDisabled={
                isLoadingProfile || error || !items || items.length === 0
              }
            >
              {isLoadingProfile ? (
                "Loading..."
              ) : error ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Login to Checkout</span>
                </div>
              ) : !items || items.length === 0 ? (
                "Cart is Empty"
              ) : (
                `Checkout (${formatCurrency(grandTotal)})`
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-default-400">
              <span>Secure checkout powered by</span>
              <span className="font-semibold text-default-600">Paystack</span>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Checkout Details</ModalHeader>
            <ModalBody className="gap-4">
              <Input
                {...register("email")}
                label="Email"
                type="email"
                isReadOnly
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
              />
              <Input
                {...register("fullName")}
                label="Full Name"
                isReadOnly
                errorMessage={errors.fullName?.message}
                isInvalid={!!errors.fullName}
              />
              <Input
                {...register("phoneNumber")}
                label="Phone Number"
                type="tel"
                errorMessage={errors.phoneNumber?.message}
                isInvalid={!!errors.phoneNumber}
              />
              <Input
                {...register("shippingAddress")}
                label="Shipping Address"
                placeholder="Enter your full address separated by commas"
                errorMessage={errors.shippingAddress?.message}
                isInvalid={!!errors.shippingAddress}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Continue to Payment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
