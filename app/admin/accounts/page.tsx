"use client"

import { useState } from "react"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Pencil, Trash2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

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

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [changePasswordEnabled, setChangePasswordEnabled] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null)
  
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  })

  const [editAccount, setEditAccount] = useState({
    name: "",
    email: "",
    role: "employee",
    newPassword: "",
    confirmNewPassword: "",
  })

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateAccount = () => {
    // Handle create logic here
    setIsCreateModalOpen(false)
    setNewAccount({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee",
    })
  }

  const handleEditAccount = (account: typeof accounts[0]) => {
    setSelectedAccount(account)
    setEditAccount({
      name: account.name,
      email: account.email,
      role: account.role,
      newPassword: "",
      confirmNewPassword: "",
    })
    setChangePasswordEnabled(false)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    // Handle save logic here
    setIsEditModalOpen(false)
    setSelectedAccount(null)
    setChangePasswordEnabled(false)
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Accounts" subtitle="Manage staff accounts" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-80 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
            />
          </div>

          {/* Create Account Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold"
          >
            <Plus className="h-4 w-4" />
            Create Account
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-md border border-border-subtle bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border-subtle hover:bg-transparent">
                <TableHead className="w-16 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Avatar
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Joined
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow
                  key={account.id}
                  className="border-border-subtle transition-colors hover:bg-gold-subtle/30"
                >
                  <TableCell>
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">
                        {getInitials(account.name)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {account.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.email}
                  </TableCell>
                  <TableCell>
                    <RolePill role={account.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(account.joined)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAccount(account)}
                        className="h-8 w-8 rounded-md text-foreground hover:bg-gold-subtle hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-foreground hover:bg-destructive/20 hover:text-destructive"
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
          <div className="border-t border-border-subtle p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="rounded-md border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive
                    className="rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="rounded-md border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground"
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="rounded-md border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Create Account Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg rounded-lg border-border-subtle bg-card p-0 shadow-modal">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-lg font-bold uppercase tracking-wide text-foreground">
              Create Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gold-border bg-gold-subtle/20 transition-colors hover:border-gold-primary hover:bg-gold-subtle">
                <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase">Avatar</span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
                placeholder="Enter full name"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={newAccount.email}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, email: e.target.value })
                }
                placeholder="Enter email address"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={newAccount.password}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, password: e.target.value })
                }
                placeholder="Enter password"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                value={newAccount.confirmPassword}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, confirmPassword: e.target.value })
                }
                placeholder="Confirm password"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Role
              </label>
              <Select
                value={newAccount.role}
                onValueChange={(value) =>
                  setNewAccount({ ...newAccount, role: value })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-md border-input-border bg-input text-foreground hover:bg-input focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border-subtle bg-surface">
                  <SelectItem
                    value="owner"
                    className="text-foreground focus:bg-gold-subtle focus:text-foreground"
                  >
                    Owner
                  </SelectItem>
                  <SelectItem
                    value="employee"
                    className="text-foreground focus:bg-gold-subtle focus:text-foreground"
                  >
                    Employee
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="border-t border-border-subtle p-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-md border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAccount}
              className="rounded-md bg-primary font-bold uppercase tracking-wide text-primary-foreground shadow-md hover:shadow-gold"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg rounded-lg border-border-subtle bg-card p-0 shadow-modal">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-lg font-bold uppercase tracking-wide text-foreground">
              Edit Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="group relative flex h-24 w-24 cursor-pointer items-center justify-center bg-primary">
                <span className="text-2xl font-bold text-primary-foreground">
                  {selectedAccount ? getInitials(selectedAccount.name) : ""}
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-bold uppercase text-white">Change Photo</span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={editAccount.name}
                onChange={(e) =>
                  setEditAccount({ ...editAccount, name: e.target.value })
                }
                placeholder="Enter full name"
                className="h-10 w-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={editAccount.email}
                readOnly
                className="h-10 w-full border border-border bg-background px-4 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Role
              </label>
              <Select
                value={editAccount.role}
                onValueChange={(value) =>
                  setEditAccount({ ...editAccount, role: value })
                }
              >
                <SelectTrigger className="h-10 w-full border-border bg-background text-foreground hover:bg-background focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem
                    value="owner"
                    className="text-foreground focus:bg-[#2a2a2a] focus:text-foreground"
                  >
                    Owner
                  </SelectItem>
                  <SelectItem
                    value="employee"
                    className="text-foreground focus:bg-[#2a2a2a] focus:text-foreground"
                  >
                    Employee
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Change Password Toggle - Only element with border-radius */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <label className="text-sm font-bold uppercase tracking-wide text-foreground">
                Change Password
              </label>
              <Switch
                checked={changePasswordEnabled}
                onCheckedChange={setChangePasswordEnabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Password Fields (Conditional) */}
            {changePasswordEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editAccount.newPassword}
                    onChange={(e) =>
                      setEditAccount({ ...editAccount, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                    className="h-10 w-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={editAccount.confirmNewPassword}
                    onChange={(e) =>
                      setEditAccount({ ...editAccount, confirmNewPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    className="h-10 w-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border p-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-border bg-transparent text-foreground hover:bg-[#2a2a2a] hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-primary font-bold uppercase tracking-wide text-primary-foreground hover:bg-[#917300]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
