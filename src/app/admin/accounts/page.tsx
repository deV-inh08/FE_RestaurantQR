"use client"

import { useState } from "react"
import Image from "next/image"
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

import { Switch } from "@/src/components/ui/switch"
import { Search, Plus, Pencil, Trash2, Upload } from "lucide-react"
import { cn } from "@/src/lib/utils"
import PaginationV1 from "@/src/components/pagination/pagination_v1"
import { useGetAccounts } from "@/src/queries/useAccount"
import TableAccount, { AccountItem } from "./components/table_account"
import AddStaff from "@/src/components/admin/add-staff"

// Sample account data
const accounts = [
  {
    id: 1,
    name: "Nguyen Van An",
    email: "an.nguyen@vietgold.com",
    role: "owner",
    joined: "2024-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Tran Thi Binh",
    email: "binh.tran@vietgold.com",
    role: "employee",
    joined: "2024-02-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Le Minh Cuong",
    email: "cuong.le@vietgold.com",
    role: "employee",
    joined: "2024-03-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Pham Thi Dung",
    email: "dung.pham@vietgold.com",
    role: "employee",
    joined: "2024-04-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Hoang Van Em",
    email: "em.hoang@vietgold.com",
    role: "owner",
    joined: "2024-01-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function RolePill({ role }: { role: string }) {
  const styles = {
    owner: "bg-primary/20 text-primary rounded-full",
    employee: "bg-white/8 text-foreground rounded-full",
  }

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider",
        styles[role as keyof typeof styles]
      )}
    >
      {role}
    </span>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
const PAGE_SIZE = 20

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [changePasswordEnabled, setChangePasswordEnabled] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null)


  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  // Get all accounts
  const { data, isLoading } = useGetAccounts({ page, pageSize: PAGE_SIZE });
  const accountsData = data?.payload.data.data

  let filteredAccounts = accountsData?.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pagination = {
    page: data?.payload.data.page ?? 1,
    totalPages: data?.payload.data.totalPages ?? 1,
  }


  return (
    <div className="min-h-screen">
      <AdminHeader title="Accounts" subtitle="Quản lý tài khoản nhân viên" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-80 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
            />
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="h-10 gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold"
          >
            <Plus className="h-4 w-4" />
            Tạo tài khoản
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border-subtle bg-card shadow-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              Đang tải...
            </div>
          ) : (
            <TableAccount accounts={filteredAccounts as AccountItem[]} />
          )}
          <PaginationV1 page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Add modal */}
      <AddStaff isOpen={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  )
}
