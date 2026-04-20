"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Minus, Plus
} from "lucide-react"
import { cn } from "@/src/lib/utils"

// Sample menu data
const menuItems = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    description: "Premium beef pho with rare steak, brisket, and tendon",
    price: 185000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Soup",
  },
  {
    id: 2,
    name: "Bún Chả Hà Nội",
    description: "Grilled pork patties with vermicelli and herbs",
    price: 165000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Noodles",
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    description: "Crispy baguette with grilled pork and pickled vegetables",
    price: 95000,
    image: "/placeholder.svg?height=80&width=80",
    available: false,
    category: "Sandwiches",
  },
  {
    id: 4,
    name: "Cơm Tấm Sườn Bì",
    description: "Broken rice with grilled pork chop and shredded pork skin",
    price: 145000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Rice",
  },
  {
    id: 5,
    name: "Gỏi Cuốn Tôm Thịt",
    description: "Fresh spring rolls with shrimp, pork, and herbs",
    price: 85000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Appetizers",
  },
  {
    id: 6,
    name: "Bò Lúc Lắc",
    description: "Shaking beef with garlic, pepper, and vegetables",
    price: 245000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Main Course",
  },
  {
    id: 7,
    name: "Chả Giò Chiên",
    description: "Crispy fried spring rolls with pork and vegetables",
    price: 75000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Appetizers",
  },
  {
    id: 8,
    name: "Cà Phê Sữa Đá",
    description: "Vietnamese iced coffee with condensed milk",
    price: 55000,
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    category: "Beverages",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

interface CartItem {
  id: number
  quantity: number
}

export default function GuestMenuPage() {
  const params = useParams()
  const tableId = params.tableId as string
  const [cart, setCart] = useState<CartItem[]>([])

  const getItemQuantity = (itemId: number) => {
    const item = cart.find((i) => i.id === itemId)
    return item?.quantity || 0
  }

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId)
      if (existing) {
        const newQty = existing.quantity + delta
        if (newQty <= 0) {
          return prev.filter((i) => i.id !== itemId)
        }
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        )
      }
      if (delta > 0) {
        return [...prev, { id: itemId, quantity: 1 }]
      }
      return prev
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => {
    const menuItem = menuItems.find((m) => m.id === item.id)
    return sum + (menuItem?.price || 0) * item.quantity
  }, 0)

  return (
    <div className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-background px-4 py-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground">
          Viet Gold
        </h1>
        <p className="mt-1 text-sm font-bold uppercase tracking-wider text-primary">
          Table {tableId}
        </p>
      </header>

      {/* Menu Items */}
      <div className="flex flex-col gap-3 px-4">
        {menuItems.map((item) => {
          const quantity = getItemQuantity(item.id)
          const isUnavailable = !item.available

          return (
            <div
              key={item.id}
              className={cn(
                "relative flex gap-4 rounded-md border border-border-subtle bg-card p-4 shadow-card transition-all hover:border-gold-border",
                isUnavailable && "opacity-50"
              )}
            >
              {/* Unavailable Overlay */}
              {isUnavailable && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-md">
                  <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Unavailable
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-primary">
                    {formatPrice(item.price)}
                  </span>

                  {/* Quantity Stepper */}
                  {!isUnavailable && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={quantity === 0}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all",
                          quantity === 0
                            ? "cursor-not-allowed opacity-50"
                            : "hover:shadow-gold"
                        )}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-foreground">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all hover:shadow-gold"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gold-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[440px] items-center justify-between px-4 py-4">
          <button
            disabled={totalItems === 0}
            className={cn(
              "flex-1 rounded-md py-3 font-bold uppercase tracking-wide transition-all shadow-md",
              totalItems > 0
                ? "bg-primary text-primary-foreground hover:shadow-gold"
                : "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
            )}
          >
            Order {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </button>
          <div className="ml-4 text-right">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Link to My Orders */}
      <Link
        href={`/table/${tableId}/orders`}
        className="fixed right-4 top-20 rounded-md border border-border-subtle bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-gold-subtle shadow-card"
      >
        My Orders
      </Link>
    </div>
  )
}
