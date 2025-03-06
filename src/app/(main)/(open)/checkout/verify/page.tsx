"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPayment } from "@/services/actions/orders.actions";
import { useCartStore } from "@/store/cart";
import { Card, CardHeader, Spinner } from "@nextui-org/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function VerifyPaymentPage() {
  const [verificationState, setVerificationState] = useState<
    "verifying" | "payment_verified" | "order_placed" | "failed"
  >("verifying");
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      toast.error("No payment reference found");
      router.push("/cart");
      return;
    }

    verify(reference);
  }, [searchParams]);

  const verify = async (reference: string) => {
    try {
      const { success, error } = await verifyPayment(reference);

      if (!success || error) {
        toast.error("Payment verification failed");
        setVerificationState("failed");
        setTimeout(() => router.push("/cart"), 3000);
        return;
      }

      // Payment verified successfully
      setVerificationState("payment_verified");
      toast.success("Payment verified successfully!");

      // Order placed successfully
      setVerificationState("order_placed");
      clearCart();
      toast.success("Order placed successfully!");

      // Redirect to cart after 3 seconds
      setTimeout(() => {
        router.push("/cart");
      }, 3000);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Payment verification failed");
      setVerificationState("failed");
      setTimeout(() => router.push("/cart"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-6 p-8">
          {/* Logo */}
          <div className="w-32 h-32 relative mb-4">
            <Image
              src="/logo.png"
              alt="Femlux Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {verificationState === "verifying" && (
            <div className="text-center space-y-4">
              <Spinner size="lg" color="primary" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Verifying Your Payment
                </h1>
                <p className="text-gray-600">
                  Please wait while we confirm your payment with Paystack...
                </p>
              </div>
            </div>
          )}

          {verificationState === "payment_verified" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-bounce" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Payment Verified!
                </h1>
                <p className="text-gray-600">
                  Your payment has been confirmed. Processing your order...
                </p>
              </div>
            </div>
          )}

          {verificationState === "order_placed" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Order Placed Successfully!
                </h1>
                <p className="text-gray-600">
                  Thank you for your purchase. Redirecting you to the cart...
                </p>
              </div>
            </div>
          )}

          {verificationState === "failed" && (
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-danger mx-auto" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Payment Verification Failed
                </h1>
                <p className="text-gray-600">
                  We couldn&apos;t verify your payment. Redirecting you to the
                  cart...
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="w-full max-w-xs mt-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  verificationState === "verifying"
                    ? "w-1/3 bg-primary"
                    : verificationState === "payment_verified"
                    ? "w-2/3 bg-primary"
                    : verificationState === "order_placed"
                    ? "w-full bg-success"
                    : "w-full bg-danger"
                }`}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
