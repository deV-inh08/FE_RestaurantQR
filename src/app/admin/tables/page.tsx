"use client"

import { useState } from "react"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
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
import { Search, Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { QRCodeSVG } from "qrcode.react"
import PaginationV1 from "@/src/components/pagination/pagination_v1"

// Sample table data
const tables = [
  { id: 1, number: 1, capacity: 2, status: "available", qrCode: "tbl-001" },
  { id: 2, number: 2, capacity: 4, status: "available", qrCode: "tbl-002" },
  { id: 3, number: 3, capacity: 4, status: "reserved", qrCode: "tbl-003" },
  { id: 4, number: 4, capacity: 6, status: "available", qrCode: "tbl-004" },
  { id: 5, number: 5, capacity: 2, status: "hidden", qrCode: "tbl-005" },
  { id: 6, number: 6, capacity: 8, status: "available", qrCode: "tbl-006" },
  { id: 7, number: 7, capacity: 4, status: "reserved", qrCode: "tbl-007" },
  { id: 8, number: 8, capacity: 2, status: "available", qrCode: "tbl-008" },
  { id: 9, number: 9, capacity: 6, status: "available", qrCode: "tbl-009" },
  { id: 10, number: 10, capacity: 4, status: "hidden", qrCode: "tbl-010" },
]

type TableStatus = "available" | "reserved" | "hidden"

interface TableData {
  id: number
  number: number
  capacity: number
  status: string
  qrCode: string
}

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

function QRCodePreview({ tableNumber, qrCode }: { tableNumber: number; qrCode: string }) {
  const orderUrl = `https://vietgold.com/order/${qrCode}`

  return (
    <div className="flex h-[60px] w-[60px] items-center justify-center bg-white p-1">
      <QRCodeSVG
        value={orderUrl}
        size={52}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  )
}

function QRCodeLarge({ tableNumber, qrCode }: { tableNumber: number; qrCode: string }) {
  const orderUrl = `https://vietgold.com/order/${qrCode}`

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4">
        <QRCodeSVG
          value={orderUrl}
          size={180}
          level="H"
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <p className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Table {tableNumber} — Scan to Order
      </p>
    </div>
  )
}

export default function TablesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newTable, setNewTable] = useState({
    number: "",
    capacity: "",
    status: "available" as TableStatus,
  })

  const filteredTables = tables.filter((table) =>
    table.number.toString().includes(searchQuery)
  )

  const handleSaveTable = () => {
    // Handle save logic here
    setIsAddModalOpen(false)
    setNewTable({
      number: "",
      capacity: "",
      status: "available",
    })
  }

  const handleEditTable = (table: TableData) => {
    setEditingTable(table)
    setIsEditModalOpen(true)
  }

  const handleUpdateTable = () => {
    // Handle update logic here
    setIsEditModalOpen(false)
    setEditingTable(null)
  }

  const handleRegenerateQR = () => {
    // Handle QR regeneration logic here
    if (editingTable) {
      const newQRCode = `tbl-${String(editingTable.number).padStart(3, "0")}-${Date.now().toString(36)}`
      setEditingTable({ ...editingTable, qrCode: newQRCode })
    }
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Tables" subtitle="Manage dining tables and QR codes" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-80 border rounded-md border border-border-subtle-subtle bg-card shadow-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Add Table Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 gap-2 bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
        </div>

        {/* Data Table */}
        <div className="border rounded-md border border-border-subtle-subtle bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border-subtle hover:bg-transparent">
                <TableHead className="w-24 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Table No.
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Capacity
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  QR Code
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow
                  key={table.id}
                  className="border-border-subtle transition-colors hover:bg-gold-subtle/30"
                >
                  <TableCell>
                    <span className="text-2xl font-bold text-primary">
                      {String(table.number).padStart(2, "0")}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {table.capacity} seats
                  </TableCell>
                  <TableCell>
                    <StatusPill status={table.status} />
                  </TableCell>
                  <TableCell>
                    <QRCodePreview tableNumber={table.number} qrCode={table.qrCode} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTable(table)}
                        className="h-8 w-8 text-foreground hover:bg-gold-subtle hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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

      {/* Add Table Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-md border border-border-subtle-subtle bg-card shadow-card p-0 sm:rounded-none">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-foreground">
              Add New Table
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            {/* Table Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Table Number
              </label>
              <input
                type="number"
                value={newTable.number}
                onChange={(e) =>
                  setNewTable({ ...newTable, number: e.target.value })
                }
                placeholder="Enter table number"
                className="h-10 w-full border border-border-subtle bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Capacity (seats)
              </label>
              <input
                type="number"
                value={newTable.capacity}
                onChange={(e) =>
                  setNewTable({ ...newTable, capacity: e.target.value })
                }
                placeholder="Enter seating capacity"
                className="h-10 w-full border border-border-subtle bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Status
              </label>
              <Select
                value={newTable.status}
                onValueChange={(value: TableStatus) =>
                  setNewTable({ ...newTable, status: value })
                }
              >
                <SelectTrigger className="h-10 w-full border-border-subtle bg-background text-foreground hover:bg-background focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md border border-border-subtle-subtle bg-card shadow-card">
                  <SelectItem
                    value="available"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Available
                  </SelectItem>
                  <SelectItem
                    value="reserved"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Reserved
                  </SelectItem>
                  <SelectItem
                    value="hidden"
                    className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                  >
                    Hidden
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="border-t border-border-subtle p-6">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle/30 hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTable}
              className="bg-primary font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
            >
              Save Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Table Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md rounded-md border border-border-subtle-subtle bg-card shadow-card p-0 sm:rounded-none">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-foreground">
              Edit Table {editingTable?.number}
            </DialogTitle>
          </DialogHeader>

          {editingTable && (
            <div className="space-y-6 p-6">
              {/* QR Code Display */}
              <div className="flex flex-col items-center rounded-none bg-background p-6">
                <QRCodeLarge
                  tableNumber={editingTable.number}
                  qrCode={editingTable.qrCode}
                />
                <Button
                  variant="outline"
                  onClick={handleRegenerateQR}
                  className="mt-4 gap-2 border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle/30 hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate QR
                </Button>
              </div>

              {/* Table Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Table Number
                </label>
                <input
                  type="number"
                  value={editingTable.number}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      number: parseInt(e.target.value) || 0
                    })
                  }
                  className="h-10 w-full border border-border-subtle bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Capacity (seats)
                </label>
                <input
                  type="number"
                  value={editingTable.capacity}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      capacity: parseInt(e.target.value) || 0
                    })
                  }
                  className="h-10 w-full border border-border-subtle bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </label>
                <Select
                  value={editingTable.status}
                  onValueChange={(value) =>
                    setEditingTable({ ...editingTable, status: value })
                  }
                >
                  <SelectTrigger className="h-10 w-full border-border-subtle bg-background text-foreground hover:bg-background focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border border-border-subtle-subtle bg-card shadow-card">
                    <SelectItem
                      value="available"
                      className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                    >
                      Available
                    </SelectItem>
                    <SelectItem
                      value="reserved"
                      className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                    >
                      Reserved
                    </SelectItem>
                    <SelectItem
                      value="hidden"
                      className="text-foreground focus:bg-gold-subtle/30 focus:text-foreground"
                    >
                      Hidden
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border-subtle p-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle/30 hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTable}
              className="bg-primary font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
            >
              Update Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
