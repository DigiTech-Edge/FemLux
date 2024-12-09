"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { TimeRange } from "@/types/analytics";

interface TimePeriodSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const periods = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "last3months", label: "Last 3 Months" },
  { value: "last6months", label: "Last 6 Months" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
  { value: "all", label: "All Time" },
] as const;

export default function TimePeriodSelector({
  value,
  onChange,
  className,
}: TimePeriodSelectorProps) {
  return (
    <Select
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value as TimeRange)}
      className={className}
      defaultSelectedKeys={[value]}
      aria-label="Select time period"
    >
      {periods.map((period) => (
        <SelectItem key={period.value} value={period.value}>
          {period.label}
        </SelectItem>
      ))}
    </Select>
  );
}
