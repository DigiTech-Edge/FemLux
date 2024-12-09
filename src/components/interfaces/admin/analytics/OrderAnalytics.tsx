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
import { OrderStatusData, SalesData } from "@/types/analytics";
import NoDataPlaceholder from "@/components/shared/NoDataPlaceholder";

const COLORS = ["#17C964", "#0070F0", "#F5A524", "#7828C8", "#F31260"];

interface OrderAnalyticsProps {
  statusData: OrderStatusData[];
  volumeData: SalesData[];
}

export default function OrderAnalytics({
  statusData,
  volumeData,
}: OrderAnalyticsProps) {
  // Check if all status counts are zero
  const hasNonZeroStatus = statusData.some((status) => status.count > 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Analytics</h3>
      <Tabs aria-label="Order Analytics" fullWidth variant="underlined">
        <Tab key="volume" title="Order Volume">
          {volumeData.length > 0 &&
          volumeData.some((data) => data.orders > 0) ? (
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
          ) : (
            <div className="mt-4">
              <NoDataPlaceholder text="No orders recorded for this time range" />
            </div>
          )}
        </Tab>
        <Tab key="status" title="Order Status">
          {hasNonZeroStatus ? (
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((status) => status.count > 0)} // Only show non-zero statuses
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
                          fontSize={12}
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
                    {statusData
                      .filter((status) => status.count > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                            <p className="text-small font-semibold capitalize">
                              {data.status}
                            </p>
                            <p className="text-tiny text-default-500">
                              Orders: {data.count}
                            </p>
                            <p className="text-tiny text-default-500">
                              {data.percentage.toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {statusData
                  .filter((status) => status.count > 0)
                  .map((status, index) => (
                    <div
                      key={status.status}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-small capitalize">
                        {status.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <NoDataPlaceholder text="No orders recorded for this time range" />
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
