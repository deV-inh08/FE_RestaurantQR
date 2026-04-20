import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react"
import { AdminHeader } from "../../components/admin/admin-header"
import { MetricCard } from "../../components/admin/metric-card"
import { RevenueChart } from "../../components/admin/revenue-chart"
import { TopDishesChart } from "../../components/admin/top-dishes-chart"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back, Admin"
      />

      <div className="space-y-6 p-6">
        {/* Metric Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="$45,231"
            change={{ value: "12.5% from last month", trend: "up" }}
            icon={DollarSign}
          />
          <MetricCard
            title="Total Orders"
            value="1,234"
            change={{ value: "8.2% from last month", trend: "up" }}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Active Tables"
            value="18"
            change={{ value: "2 more than usual", trend: "neutral" }}
            icon={Users}
          />
          <MetricCard
            title="Avg. Order Value"
            value="$36.68"
            change={{ value: "3.1% from last month", trend: "up" }}
            icon={TrendingUp}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <TopDishesChart />
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-md border border-border-subtle bg-card p-6 shadow-card">
          <div className="mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
              Recent Orders
            </h3>
            <p className="text-xs text-muted-foreground">
              Latest orders from all tables
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Order ID
                  </th>
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Table
                  </th>
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Items
                  </th>
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total
                  </th>
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gold-subtle/30 transition-colors">
                    <td className="py-4 text-sm font-medium text-foreground">
                      #{order.id}
                    </td>
                    <td className="py-4 text-sm text-foreground">
                      Table {order.table}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {order.items}
                    </td>
                    <td className="py-4 text-sm font-medium text-primary">
                      ${order.total}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase ${order.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Preparing"
                            ? "bg-gold-primary/15 text-primary"
                            : "bg-white/8 text-muted-foreground"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {order.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const recentOrders = [
  {
    id: "1234",
    table: 5,
    items: "2x Phở Bò, 1x Gỏi Cuốn",
    total: "42.50",
    status: "Preparing",
    time: "2 mins ago",
  },
  {
    id: "1233",
    table: 3,
    items: "1x Bún Chả, 2x Bánh Mì",
    total: "35.00",
    status: "Completed",
    time: "15 mins ago",
  },
  {
    id: "1232",
    table: 8,
    items: "3x Cơm Tấm, 1x Phở Gà",
    total: "58.00",
    status: "Completed",
    time: "28 mins ago",
  },
  {
    id: "1231",
    table: 12,
    items: "2x Bánh Xèo, 2x Gỏi Cuốn",
    total: "44.00",
    status: "Pending",
    time: "35 mins ago",
  },
  {
    id: "1230",
    table: 1,
    items: "1x Phở Bò, 1x Bún Bò Huế",
    total: "32.00",
    status: "Completed",
    time: "45 mins ago",
  },
]
