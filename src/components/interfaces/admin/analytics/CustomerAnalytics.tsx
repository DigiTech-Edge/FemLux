"use client";

import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CustomerSegment, CustomerRetention } from "@/lib/types/analytics";

const COLORS = ["#0070F0", "#17C964", "#F5A524", "#7828C8"];

interface CustomerAnalyticsProps {
  segments: CustomerSegment[];
  retention: CustomerRetention[];
}

export default function CustomerAnalytics({
  segments,
  retention,
}: CustomerAnalyticsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Analytics</h3>
      <Tabs
        aria-label="Customer analytics options"
        fullWidth
        variant="underlined"
      >
        <Tab key="segments" title="Customer Segments">
          <Card>
            <CardBody>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segments}
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
                      {segments.map((entry, index) => (
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
                                {payload[0].payload.segment}
                              </p>
                              <p className="text-tiny text-default-500">
                                Count: {payload[0].value}
                              </p>
                              <p className="text-tiny text-default-500">
                                {(payload[0].payload.percentage * 100).toFixed(
                                  1
                                )}
                                %
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
            </CardBody>
          </Card>
        </Tab>
        <Tab key="retention" title="Customer Retention">
          <Card>
            <CardBody>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={retention}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                              <p className="text-small font-semibold">
                                {label}
                              </p>
                              <p className="text-tiny text-default-500">
                                New Customers: {payload[0].value}
                              </p>
                              <p className="text-tiny text-default-500">
                                Returning: {payload[1].value}
                              </p>
                              <p className="text-tiny text-default-500">
                                Churn Rate: {payload[2].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#0070F0"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="returningCustomers"
                      stroke="#17C964"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="churnRate"
                      stroke="#F5A524"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
