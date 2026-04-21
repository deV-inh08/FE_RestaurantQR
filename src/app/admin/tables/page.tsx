"use client"

import { useState } from "react"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { Button } from "@/src/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

import { Search, Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { cn } from "@/src/lib/utils"
import PaginationV1 from "@/src/components/pagination/pagination_v1"
import { useGetTables } from "@/src/queries/useTable"
import { TableDto } from "@/src/schema/table.schema"
import { AddTableModal } from "./components/AddTable"
import { EditTableModal } from "./components/EditTable"
import { DeleteTableDialog } from "./components/DeleteTableDialog"
import QRPreview from "./components/QR_Preview"

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-600 text-white",
    reserved: "bg-primary text-primary-foreground",
    hidden: "bg-[#7D7D7D] text-white",
  }

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wide",
        styles[status] || styles.available
      )}
    >
      {status}
    </span>
  )
}

// ─── Main page ──────────────────────────────────────
export default function TablesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [tableToEdit, setTableToEdit] = useState<TableDto | null>(null)
  const [tableToDelete, setTableToDelete] = useState<TableDto | null>(null)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetTables({ page: 1, pageSize: 5 })
  const tables = (data?.payload.data.data ?? []).filter(t =>
    String(t.number).includes(search)
  )

  const pagination = {
    page: data?.payload.data.page,
    pageSize: data?.payload.data.pageSize,
    totalPages: data?.payload.data.totalPages,
  };


  console.log(`pagination___________________________________, ${JSON.stringify(pagination)}`);

  const handlePageChange = (newPage: number) => {
    // Update URL params if needed
    // router.push(`?page=${newPage}&pageSize=${pagination.pageSize}`)
    // Or update state if you manage pagination via state
    // setPage(newPage);
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Tables" subtitle="Quản lý bàn ăn và QR code" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Tìm số bàn..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 w-60 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none" />
          </div>
          <Button onClick={() => setIsAddOpen(true)}
            className="h-10 gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold">
            <Plus className="h-4 w-4" />Thêm bàn
          </Button>
        </div>

        <div className="rounded-md border border-border-subtle bg-card shadow-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border-subtle hover:bg-transparent">
                  {['Số bàn', 'Sức chứa', 'QR Code', 'Trạng thái', ''].map(h => (
                    <TableHead key={h} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">Không có bàn nào</TableCell></TableRow>
                )}
                {tables.map(table => (
                  <TableRow key={table.id} className="border-border-subtle transition-colors hover:bg-gold-subtle/30">
                    <TableCell>
                      <span className="text-2xl font-bold text-primary">{String(table.number).padStart(2, '0')}</span>
                    </TableCell>
                    <TableCell className="text-foreground">{table.capacity} chỗ</TableCell>
                    <TableCell><QRPreview tableId={table.id} /></TableCell>
                    <TableCell><StatusPill status={table.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setTableToEdit(table)}
                          className="rounded-md text-foreground hover:bg-gold-subtle">Sửa</Button>
                        <Button variant="ghost" size="icon" onClick={() => setTableToDelete(table)}
                          className="h-8 w-8 rounded-md text-foreground hover:bg-destructive/20 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <PaginationV1 totalPages={pagination.totalPages || 10} page={pagination.page || 1} onPageChange={handlePageChange} />
        </div>
      </div>

      <AddTableModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditTableModal table={tableToEdit} onClose={() => setTableToEdit(null)} />
      <DeleteTableDialog table={tableToDelete} onClose={() => setTableToDelete(null)} />
    </div>
  )
}
