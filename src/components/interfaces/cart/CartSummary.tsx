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

export default function CartSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const { total } = useCartStore();
  const { data, error, isLoading } = useSWR("profile", async () => {
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

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setIsOpen(false);
  });

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
                  Add {formatCurrency(grandTotal - total)} more for free
                  shipping!
                </p>
              )}
              <Divider />
              <SummaryRow label="Total" value={total} isTotal />
            </div>
            <Button
              color="primary"
              size="lg"
              startContent={<CreditCard className="h-5 w-5" />}
              className="w-full"
              onClick={() => !isLoading && !error && setIsOpen(true)}
              isDisabled={isLoading || error}
            >
              {isLoading ? (
                "Loading..."
              ) : error ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Login to Checkout</span>
                </div>
              ) : (
                `Checkout (${formatCurrency(total)})`
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
          <form onSubmit={onSubmit}>
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
              <Button color="primary" type="submit">
                Continue to Payment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
