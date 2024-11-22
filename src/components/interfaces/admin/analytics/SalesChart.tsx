"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectItem } from "@nextui-org/react";
import { formatCurrency } from "@/helpers";
import { SalesData } from "@/lib/types/analytics";

const timeRanges = [
  { value: "3", label: "Last 3 months" },
  { value: "6", label: "Last 6 months" },
  { value: "12", label: "Last 12 months" },
];

interface SalesChartProps {
  data: SalesData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const [timeRange, setTimeRange] = useState("3");

  const filteredData = data.slice(-parseInt(timeRange));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sales Overview</h3>
        <Select
          size="sm"
          selectedKeys={[timeRange]}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-40"
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0070F0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0070F0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#17C964" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#17C964" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tick={{ fontSize: 12 }}
              stroke="#666666"
            />
            <YAxis
              yAxisId="revenue"
              tickLine={false}
              tick={{ fontSize: 12 }}
              stroke="#666666"
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickLine={false}
              tick={{ fontSize: 12 }}
              stroke="#666666"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                      <p className="text-small font-semibold">{label}</p>
                      <p className="text-tiny text-default-500 mt-1">
                        Revenue: {formatCurrency(payload[0].value as number)}
                      </p>
                      <p className="text-tiny text-default-500">
                        Orders: {payload[1].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#0070F0"
              strokeWidth={2}
              fill="url(#revenue)"
            />
            <Area
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#17C964"
              strokeWidth={2}
              fill="url(#orders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
