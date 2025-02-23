"use client";

import React from "react";
import { Card } from "@nextui-org/react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center mb-4">
          <Image
            src="/logo.png"
            alt="FemLux Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
