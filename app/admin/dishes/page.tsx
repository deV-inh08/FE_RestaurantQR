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
import { Search, Plus, Pencil, Trash2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample dish data
const dishes = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    category: "Soup",
    price: 185000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 2,
    name: "Bún Chả Hà Nội",
    category: "Noodles",
    price: 165000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    category: "Sandwiches",
    price: 95000,
    status: "unavailable",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 4,
    name: "Cơm Tấm Sườn Bì",
    category: "Rice",
    price: 145000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 5,
    name: "Gỏi Cuốn Tôm Thịt",
    category: "Appetizers",
    price: 85000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 6,
    name: "Bò Lúc Lắc",
    category: "Main Course",
    price: 245000,
    status: "hidden",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 7,
    name: "Chả Giò Chiên",
    category: "Appetizers",
    price: 75000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 8,
    name: "Cà Phê Sữa Đá",
    category: "Beverages",
    price: 55000,
    status: "available",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const categories = [
  "Soup",
  "Noodles",
  "Rice",
  "Main Course",
  "Appetizers",
  "Sandwiches",
  "Beverages",
  "Desserts",
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

function StatusPill({ status }: { status: string }) {
  const styles = {
    available: "bg-green-500/20 text-green-400 rounded-full",
    unavailable: "bg-white/8 text-muted-foreground rounded-full",
    hidden: "bg-white/8 text-muted-foreground rounded-full",
  }

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider",
        styles[status as keyof typeof styles]
      )}
    >
      {status}
    </span>
  )
}

export default function DishesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    status: "available",
  })

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveDish = () => {
    // Handle save logic here
    setIsAddModalOpen(false)
    setNewDish({
      name: "",
      price: "",
      category: "",
      description: "",
      status: "available",
    })
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dishes" subtitle="Manage your menu items" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-80 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
            />
          </div>

          {/* Add Dish Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold"
          >
            <Plus className="h-4 w-4" />
            Add Dish
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-md border border-border-subtle bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border-subtle hover:bg-transparent">
                <TableHead className="w-16 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Image
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Price
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDishes.map((dish) => (
                <TableRow
                  key={dish.id}
                  className="border-border-subtle transition-colors hover:bg-gold-subtle/30"
                >
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-surface">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {dish.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dish.category}
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatPrice(dish.price)}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={dish.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
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
                    className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
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
                    className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Add Dish Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-lg border-border-subtle bg-card p-0 shadow-modal">
          <DialogHeader className="border-b border-border-subtle p-6">
            <DialogTitle className="text-lg font-bold uppercase tracking-wide text-foreground">
              Add New Dish
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={newDish.name}
                onChange={(e) =>
                  setNewDish({ ...newDish, name: e.target.value })
                }
                placeholder="Enter dish name"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Price (VND)
              </label>
              <input
                type="number"
                value={newDish.price}
                onChange={(e) =>
                  setNewDish({ ...newDish, price: e.target.value })
                }
                placeholder="Enter price"
                className="h-10 w-full rounded-md border border-input-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <Select
                value={newDish.category}
                onValueChange={(value) =>
                  setNewDish({ ...newDish, category: value })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-md border-input-border bg-input text-foreground hover:bg-input focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border-subtle bg-surface">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-foreground focus:bg-gold-subtle focus:text-foreground"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                value={newDish.description}
                onChange={(e) =>
                  setNewDish({ ...newDish, description: e.target.value })
                }
                placeholder="Enter dish description"
                rows={3}
                className="w-full resize-none rounded-md border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Image
              </label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gold-border bg-gold-subtle/20 transition-colors hover:border-gold-primary hover:bg-gold-subtle">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <Select
                value={newDish.status}
                onValueChange={(value) =>
                  setNewDish({ ...newDish, status: value })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-md border-input-border bg-input text-foreground hover:bg-input focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border-subtle bg-surface">
                  <SelectItem
                    value="available"
                    className="text-foreground focus:bg-gold-subtle focus:text-foreground"
                  >
                    Available
                  </SelectItem>
                  <SelectItem
                    value="unavailable"
                    className="text-foreground focus:bg-gold-subtle focus:text-foreground"
                  >
                    Unavailable
                  </SelectItem>
                  <SelectItem
                    value="hidden"
                    className="text-foreground focus:bg-gold-subtle focus:text-foreground"
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
              className="rounded-md border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDish}
              className="rounded-md bg-primary font-bold uppercase tracking-wide text-primary-foreground shadow-md hover:shadow-gold"
            >
              Save Dish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
