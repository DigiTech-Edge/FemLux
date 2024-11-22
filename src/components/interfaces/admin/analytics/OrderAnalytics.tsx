"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, Tab } from "@nextui-org/react";
import {
  OrderAnalytics as OrderAnalyticsType,
  SalesData,
} from "@/lib/types/analytics";

const COLORS = ["#17C964", "#0070F0", "#F5A524"];

interface OrderAnalyticsProps {
  statusData: OrderAnalyticsType[];
  volumeData: SalesData[];
}

export default function OrderAnalytics({
  statusData,
  volumeData,
}: OrderAnalyticsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Analytics</h3>
      <Tabs aria-label="Order Analytics" fullWidth variant="underlined">
        <Tab key="volume" title="Order Volume">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  stroke="#666666"
                />
                <YAxis
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
                          <p className="text-tiny text-default-500">
                            Orders: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="orders" fill="#0070F0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Tab>
        <Tab key="status" title="Order Status">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        fontSize={16}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                          <p className="text-small font-semibold">
                            {payload[0].payload.status}
                          </p>
                          <p className="text-tiny text-default-500">
                            Orders: {payload[0].value}
                          </p>
                          <p className="text-tiny text-default-500">
                            {(payload[0].payload.percentage * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
