"use client";

import { Card } from "@nextui-org/react";
import { LineChart } from "lucide-react";

interface NoDataPlaceholderProps {
  text?: string;
}

export default function NoDataPlaceholder({
  text = "No data available for this time range",
}: NoDataPlaceholderProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 h-[300px]">
      <LineChart className="w-12 h-12 text-default-300 mb-4" />
      <p className="text-default-500 text-center">{text}</p>
    </Card>
  );
}
