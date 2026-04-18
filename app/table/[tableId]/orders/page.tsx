"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample order data
const orders = [
  {
    id: "ORD-001",
    items: [
      {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        quantity: 2,
        price: 185000,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 2,
        name: "Gỏi Cuốn Tôm Thịt",
        quantity: 1,
        price: 85000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    status: "processing",
    time: "10:45 AM",
  },
  {
    id: "ORD-002",
    items: [
      {
        id: 3,
        name: "Cà Phê Sữa Đá",
        quantity: 2,
        price: 55000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    status: "delivered",
    time: "10:30 AM",
  },
  {
    id: "ORD-003",
    items: [
      {
        id: 4,
        name: "Chả Giò Chiên",
        quantity: 1,
        price: 75000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    status: "pending",
    time: "10:50 AM",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-white/8 text-foreground rounded-full",
    processing: "bg-gold-primary/15 text-primary rounded-full",
    delivered: "bg-green-500/20 text-green-400 rounded-full",
    paid: "bg-blue-500/20 text-blue-400 rounded-full",
    rejected: "bg-red-500/20 text-red-400 rounded-full",
  }

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider",
        styles[status] || styles.pending
      )}
    >
      {status}
    </span>
  )
}

export default function GuestOrdersPage() {
  const params = useParams()
  const tableId = params.tableId as string

  const totalAmount = orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    )
  }, 0)

  return (
    <div className="flex min-h-screen flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-background px-4 py-4">
        <Link
          href={`/table/${tableId}`}
          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to menu</span>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">
            My Orders
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Table {tableId}
          </p>
        </div>
        {/* Live Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Live
          </span>
        </div>
      </header>

      {/* Orders List */}
      <div className="flex flex-col gap-4 px-4 pt-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-md border border-border-subtle bg-card p-4 shadow-card">
            {/* Order Header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {order.id}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{order.time}</span>
                <StatusPill status={order.status} />
              </div>
            </div>

            {/* Order Items */}
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {/* Image */}
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-md bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Subtotal */}
            <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Subtotal
              </span>
              <span className="font-bold text-foreground">
                {formatPrice(
                  order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )
                )}
              </span>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <Link
              href={`/table/${tableId}`}
              className="mt-4 rounded-md bg-primary px-6 py-3 font-bold uppercase tracking-wide text-primary-foreground transition-all shadow-md hover:shadow-gold"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>

      {/* Fixed Total Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gold-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-[440px] p-4">
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-card p-4 shadow-card">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
