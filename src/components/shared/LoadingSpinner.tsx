"use client";

import { Spinner } from "@nextui-org/react";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center h-[300px] ${className}`}>
      <Spinner size="lg" color="primary" />
    </div>
  );
}
