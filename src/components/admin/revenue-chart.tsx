"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import {
  ChartContainer, ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

const chartData = [
  { month: "Jan", revenue: 18500 },
  { month: "Feb", revenue: 22300 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 25600 },
  { month: "May", revenue: 28900 },
  { month: "Jun", revenue: 32100 },
  { month: "Jul", revenue: 29500 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#FFC000",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <div className="border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
          Revenue Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Monthly revenue for the current year
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7D7D7D", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7D7D7D", fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              />
            }
          />
          <Bar
            dataKey="revenue"
            fill="#FFC000"
            radius={0}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
