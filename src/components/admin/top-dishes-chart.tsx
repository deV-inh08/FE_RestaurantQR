"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  ChartContainer, ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

const chartData = [
  { name: "Phở Bò", orders: 245 },
  { name: "Bánh Mì", orders: 198 },
  { name: "Bún Chả", orders: 176 },
  { name: "Gỏi Cuốn", orders: 152 },
  { name: "Cơm Tấm", orders: 134 },
]

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#FFC000",
  },
} satisfies ChartConfig

export function TopDishesChart() {
  return (
    <div className="border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
          Top Dishes
        </h3>
        <p className="text-sm text-muted-foreground">
          Best selling dishes this month
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7D7D7D", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            width={80}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`${value} orders`, "Orders"]}
              />
            }
          />
          <Bar
            dataKey="orders"
            fill="#FFC000"
            radius={0}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
