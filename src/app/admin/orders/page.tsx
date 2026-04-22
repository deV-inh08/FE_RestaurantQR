"use client"

import { useMemo, useState } from "react"
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

import { Calendar, Eye, Pencil, Plus, Search } from "lucide-react"
import { cn, formatCurrency, formatTime } from "@/src/lib/utils"
import PaginationV1 from "@/src/components/pagination/pagination_v1"
import { useGetOrders } from "@/src/queries/useOrder"
import StatusSelect, { STATUS_LABELS, STATUS_VALUES, OrderStatus, STATUS_STYLES } from "./components/status_select"
import CreateOrderModal from "./components/addOrder"
import { STATUS_ORDER_STYLE, StatusBadge, ViewOrderModal } from "./components/viewModel"
import { EditOrderModal } from "./components/editOrder"
import { OrderDto } from "@/src/schema/order.schema"
import TableStatusGrid from "./components/TableStatusGrid"



function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
      STATUS_STYLES[status as OrderStatus] ?? 'bg-white/8 text-foreground')}>
      {STATUS_LABELS[status as OrderStatus] ?? status}
    </span>
  )
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



// ─── Main page ──────────────────────────────────────
export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createPreselectedTable, setCreatePreselectedTable] = useState<number | undefined>()
  const [orderToView, setOrderToView] = useState<OrderDto | null>(null)
  const [orderToEdit, setOrderToEdit] = useState<OrderDto | null>(null)

  const { data, isLoading } = useGetOrders({ page: 1, pageSize: 5 })

  const handleTableClick = (tableId: number) => {
    setCreatePreselectedTable(tableId)
    setIsCreateOpen(true)
  }

  const guestItemCount = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of data?.payload.data.data ?? []) {
      const key = `${o.tableId}-${o.guestId}`
      map[key] = (map[key] ?? 0) + 1
    }
    return map
  }, [data])

  const getTotal = (o: OrderDto) =>
    o.dishPrice ? formatCurrency(o.dishPrice * o.quantity) : '—'

  // Reset page when filter changes
  const handleStatusChange = (v: string) => { setStatusFilter(v); setPage(1) }
  const handleDateFromChange = (v: string) => { setDateFrom(v); setPage(1) }
  const handleDateToChange = (v: string) => { setDateTo(v); setPage(1) }

  const orders = useMemo(() => {
    return (data?.payload.data.data ?? []).filter(o => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      const matchFrom = !dateFrom || new Date(o.createdAt) >= new Date(dateFrom)
      const matchTo = !dateTo || new Date(o.createdAt) <= new Date(dateTo + 'T23:59:59')
      return matchStatus && matchFrom && matchTo
    })
  }, [data, statusFilter, dateFrom, dateTo])

  const total = data?.payload.data.total;
  const pagination = {
    page: data?.payload.data.page,
    pageSize: data?.payload.data.pageSize,
    totalPages: data?.payload.data.totalPages,
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Orders" subtitle="Quản lý đơn hàng theo thời gian thực" />


      <div className="p-6">
        <TableStatusGrid onSelectTable={handleTableClick} />

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Date from */}
              <div className="relative flex items-center">
                <svg className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="date" value={dateFrom} onChange={e => handleDateFromChange(e.target.value)}
                  className="h-10 w-44 rounded-md border border-input-border bg-input pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none [color-scheme:dark]" />
              </div>
              <span className="text-sm text-muted-foreground">to</span>
              <div className="relative flex items-center">
                <svg className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="date" value={dateTo} onChange={e => handleDateToChange(e.target.value)}
                  className="h-10 w-44 rounded-md border border-input-border bg-input pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none [color-scheme:dark]" />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10 w-36 rounded-md border-input-border bg-input text-sm text-foreground focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border-subtle bg-surface">
                  <SelectItem value="all" className="text-foreground focus:bg-gold-subtle">All Status</SelectItem>
                  {STATUS_VALUES.map(s => (
                    <SelectItem key={s} value={s} className="text-foreground focus:bg-gold-subtle">
                      {STATUS_ORDER_STYLE[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Total count indicator */}
              <span className="text-xs text-muted-foreground">
                {total} đơn tổng
              </span>
            </div>

            <Button
              onClick={() => { setCreatePreselectedTable(undefined); setIsCreateOpen(true) }}
              className="h-10 gap-2 rounded-md bg-primary px-5 font-bold uppercase tracking-wide text-black shadow-md hover:shadow-gold"
            >
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </div>

          <div className="rounded-md border border-border-subtle bg-card shadow-card">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">Đang tải...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border-subtle hover:bg-transparent">
                    {['ORDER ID', 'TABLE', 'GUEST', 'ITEMS', 'TOTAL', 'STATUS', 'TIME', 'ACTIONS'].map(h => (
                      <TableHead key={h} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                        Không có đơn hàng nào
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map(order => {
                    const guestKey = `${order.tableId}-${order.guestId}`
                    return (
                      <TableRow key={order.id} className="border-border-subtle transition-colors hover:bg-gold-subtle/20">
                        <TableCell className="font-mono font-bold text-foreground">
                          ORD-{String(order.id).padStart(3, '0')}
                        </TableCell>
                        <TableCell className="text-foreground">Table {order.tableNumber}</TableCell>
                        <TableCell className="text-muted-foreground">{order.guestName}</TableCell>
                        <TableCell className="text-foreground">
                          {order.dishName ?? `Snapshot #${order.dishSnapshotId}`}
                        </TableCell>
                        <TableCell className="font-bold text-primary">{getTotal(order)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-muted-foreground text-sm tabular-nums">{formatTime(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setOrderToView(order)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gold-subtle hover:text-foreground" title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setOrderToEdit(order)}
                              disabled={order.status === 'Cancelled'}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gold-subtle hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {/* Real pagination */}
            <PaginationV1 page={pagination.page || 1} totalPages={pagination.totalPages || 20} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateOrderModal
        open={isCreateOpen}
        preselectedTableId={createPreselectedTable}
        onClose={() => { setIsCreateOpen(false); setCreatePreselectedTable(undefined) }}
      />
      <ViewOrderModal order={orderToView} onClose={() => setOrderToView(null)} />

      <EditOrderModal order={orderToEdit} onClose={() => setOrderToEdit(null)} />
    </div>
  )
}
