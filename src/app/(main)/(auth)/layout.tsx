import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
