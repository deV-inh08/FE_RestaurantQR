"use client"

import { useState } from "react"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { Button } from "@/src/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { Plus, Eye, Pencil, X, Calendar } from "lucide-react"
import { cn } from "@/src/lib/utils"
import PaginationV1 from "@/src/components/pagination/pagination_v1"

// Sample table data
const tables = [
  { id: 1, status: "occupied", orderCount: 3, guest: "Nguyễn Văn A" },
  { id: 2, status: "empty", orderCount: 0, guest: null },
  { id: 3, status: "occupied", orderCount: 2, guest: "Trần Thị B" },
  { id: 4, status: "reserved", orderCount: 0, guest: "Lê Văn C" },
  { id: 5, status: "empty", orderCount: 0, guest: null },
  { id: 6, status: "occupied", orderCount: 5, guest: "Phạm Thị D" },
  { id: 7, status: "empty", orderCount: 0, guest: null },
  { id: 8, status: "reserved", orderCount: 0, guest: "Hoàng Văn E" },
  { id: 9, status: "occupied", orderCount: 1, guest: "Vũ Thị F" },
  { id: 10, status: "empty", orderCount: 0, guest: null },
  { id: 11, status: "occupied", orderCount: 4, guest: "Đặng Văn G" },
  { id: 12, status: "empty", orderCount: 0, guest: null },
  { id: 13, status: "empty", orderCount: 0, guest: null },
  { id: 14, status: "reserved", orderCount: 0, guest: "Bùi Thị H" },
  { id: 15, status: "occupied", orderCount: 2, guest: "Ngô Văn I" },
]

// Sample orders data
const orders = [
  {
    id: "ORD-001",
    tableId: 1,
    guest: "Nguyễn Văn A",
    items: 3,
    total: 485000,
    status: "processing",
    time: "12:30",
  },
  {
    id: "ORD-002",
    tableId: 3,
    guest: "Trần Thị B",
    items: 2,
    total: 320000,
    status: "delivered",
    time: "12:15",
  },
  {
    id: "ORD-003",
    tableId: 6,
    guest: "Phạm Thị D",
    items: 5,
    total: 750000,
    status: "pending",
    time: "12:45",
  },
  {
    id: "ORD-004",
    tableId: 9,
    guest: "Vũ Thị F",
    items: 1,
    total: 185000,
    status: "paid",
    time: "11:30",
  },
  {
    id: "ORD-005",
    tableId: 11,
    guest: "Đặng Văn G",
    items: 4,
    total: 620000,
    status: "processing",
    time: "12:50",
  },
  {
    id: "ORD-006",
    tableId: 15,
    guest: "Ngô Văn I",
    items: 2,
    total: 295000,
    status: "delivered",
    time: "12:20",
  },
  {
    id: "ORD-007",
    tableId: 1,
    guest: "Nguyễn Văn A",
    items: 1,
    total: 55000,
    status: "rejected",
    time: "12:35",
  },
  {
    id: "ORD-008",
    tableId: 3,
    guest: "Trần Thị B",
    items: 1,
    total: 95000,
    status: "pending",
    time: "12:40",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

type TableStatus = "empty" | "occupied" | "reserved"

function TableStatusPill({ status }: { status: TableStatus }) {
  const styles: Record<TableStatus, string> = {
    empty: "bg-[#1a1a1a] text-[#7D7D7D] border border-[#7D7D7D]",
    occupied: "bg-primary text-primary-foreground",
    reserved: "bg-transparent text-foreground border border-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[status]
      )}
    >
      {status}
    </span>
  )
}

type OrderStatus = "pending" | "processing" | "delivered" | "paid" | "rejected"

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-transparent text-foreground border border-foreground",
    processing: "bg-primary text-primary-foreground",
    delivered: "bg-[#22c55e] text-white",
    paid: "bg-[#3860BE] text-white",
    rejected: "bg-[#ef4444] text-white",
  }

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wide",
        styles[status]
      )}
    >
      {status}
    </span>
  )
}

export default function OrdersPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)

  const selectedTableData = tables.find((t) => t.id === selectedTable)
  const tableOrders = orders.filter((o) => o.tableId === selectedTable)

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })

  return (
    <div className="min-h-screen">
      <AdminHeader title="Orders" subtitle="Real-time order management" />

      <div className="p-6">
        {/* Table Status Grid */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Table Status
          </h3>
          <div className="grid grid-cols-5 gap-3 lg:grid-cols-8 xl:grid-cols-10">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() =>
                  table.status === "occupied"
                    ? setSelectedTable(table.id)
                    : null
                }
                className={cn(
                  "relative flex flex-col items-center justify-center border rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card p-4 transition-all",
                  table.status === "occupied" &&
                  "cursor-pointer hover:border-primary",
                  table.status !== "occupied" && "cursor-default opacity-70"
                )}
              >
                <span className="mb-2 text-lg font-bold uppercase text-foreground">
                  Table {table.id}
                </span>
                <TableStatusPill status={table.status as TableStatus} />
                {table.status === "occupied" && table.orderCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                    {table.orderCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Orders
          </h3>

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Date From */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 w-40 border rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              {/* Date To */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 w-40 border rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-40 rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card text-foreground hover:bg-card focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card">
                  <SelectItem
                    value="all"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    All Status
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="processing"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Processing
                  </SelectItem>
                  <SelectItem
                    value="delivered"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Delivered
                  </SelectItem>
                  <SelectItem
                    value="paid"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Paid
                  </SelectItem>
                  <SelectItem
                    value="rejected"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Order Button */}
            <Button
              onClick={() => setIsCreateOrderOpen(true)}
              className="h-10 gap-2 bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
            >
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </div>

          {/* Orders Data Table */}
          <div className="border rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border-subtle hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Order ID
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Table
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Guest
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Items
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Time
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-border-subtle transition-colors hover:bg-gold-subtle/30"
                  >
                    <TableCell className="font-mono font-medium text-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-foreground">
                      Table {order.tableId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.guest}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {order.items} items
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusPill status={order.status as OrderStatus} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.time}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-foreground hover:bg-gold-subtle hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-foreground hover:bg-gold-subtle hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationV1></PaginationV1>
          </div>
        </div>
      </div>

      {/* Table Detail Panel */}
      <Dialog
        open={selectedTable !== null}
        onOpenChange={() => setSelectedTable(null)}
      >
        <DialogContent className="max-w-lg rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card p-0 sm:rounded-none">
          <DialogHeader className="border-b border-border-subtle p-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold uppercase tracking-tight text-foreground">
                Table {selectedTable} Details
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6">
            {selectedTableData && (
              <div className="space-y-6">
                {/* Guest Info */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Guest
                  </label>
                  <p className="text-lg font-medium text-foreground">
                    {selectedTableData.guest}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </label>
                  <div>
                    <TableStatusPill
                      status={selectedTableData.status as TableStatus}
                    />
                  </div>
                </div>

                {/* Orders */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Active Orders ({tableOrders.length})
                  </label>
                  <div className="space-y-2">
                    {tableOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-md border border-border-subtle-subtle bg-background p-3"
                      >
                        <div>
                          <p className="font-mono text-sm font-medium text-foreground">
                            {order.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.items} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            {formatPrice(order.total)}
                          </p>
                          <OrderStatusPill
                            status={order.status as OrderStatus}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border-subtle pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      Total Bill
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(
                        tableOrders.reduce((sum, o) => sum + o.total, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border-subtle p-6">
            <Button
              variant="outline"
              onClick={() => setSelectedTable(null)}
              className="border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle/30 hover:text-foreground"
            >
              Close
            </Button>
            <Button className="bg-primary font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]">
              Print Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Order Modal */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="max-w-lg rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card p-0 sm:rounded-none">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-foreground">
              Create New Order
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            {/* Table Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Table
              </label>
              <Select>
                <SelectTrigger className="h-10 w-full border-border-subtle bg-background text-foreground hover:bg-background focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent className="rounded-md rounded-md border border-border-subtle-subtle-subtle bg-card shadow-card">
                  {tables.map((table) => (
                    <SelectItem
                      key={table.id}
                      value={table.id.toString()}
                      className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                    >
                      Table {table.id}{" "}
                      {table.status !== "empty" && `(${table.status})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guest Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Guest Name
              </label>
              <input
                type="text"
                placeholder="Enter guest name"
                className="h-10 w-full rounded-md border border-border-subtle-subtle bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Notes
              </label>
              <textarea
                placeholder="Special requests or notes"
                rows={3}
                className="w-full resize-none rounded-md border border-border-subtle-subtle bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border-subtle p-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateOrderOpen(false)}
              className="border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle/30 hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsCreateOrderOpen(false)}
              className="bg-primary font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
            >
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
