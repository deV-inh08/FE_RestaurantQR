'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Minus, Plus, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn, formatCurrency, handleErrorApi } from '@/src/lib/utils'
import { getGuestAccessToken, getGuestInfo, isGuestLoggedIn } from '@/src/lib/guest-session'
import { useGetDishes } from '@/src/queries/useDish'
import guestApiRequest from '@/src/apiRequests/guest.request'
import http from '@/src/lib/http'
import envConfig from '@/src/config'

// ─── Category labels ────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  MainCourse: 'Món chính',
  Dessert: 'Tráng miệng',
  Beverage: 'Đồ uống',
}

// ─── Types ──────────────────────────────────────────
interface CartItem { dishId: number; quantity: number }

export default function GuestMenuPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.tableId as string

  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')

  // Guard
  useEffect(() => {
    if (!isGuestLoggedIn()) router.replace(`/table/${tableId}/welcome`)
  }, [tableId, router])

  // Fetch menu từ Menu.API — dùng hook đã có, không viết lại
  const { data, isLoading } = useGetDishes()
  const allDishes = data?.payload.data ?? []
  const availableDishes = allDishes.filter(d => d.status === 'Available')
  const categories = ['all', ...Array.from(new Set(availableDishes.map(d => d.category as string)))]
  const filteredDishes = activeCategory === 'all'
    ? availableDishes
    : availableDishes.filter(d => d.category === activeCategory)

  // ── Cart helpers ────────────────────────────────
  const getQty = (dishId: number) => cart.find(i => i.dishId === dishId)?.quantity ?? 0

  const updateQty = (dishId: number, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.dishId === dishId)
      if (existing) {
        const newQty = existing.quantity + delta
        if (newQty <= 0) return prev.filter(i => i.dishId !== dishId)
        return prev.map(i => i.dishId === dishId ? { ...i, quantity: newQty } : i)
      }
      return delta > 0 ? [...prev, { dishId, quantity: 1 }] : prev
    })
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cart.reduce((s, i) => {
    const dish = availableDishes.find(d => d.id === i.dishId)
    return s + (dish?.price ?? 0) * i.quantity
  }, 0)

  // ── Place order mutation ─────────────────────────
  // Dùng useMutation trực tiếp vì đây là guest action riêng biệt,
  // không share với admin orderApiRequest
  const orderMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const accessToken = getGuestAccessToken()
      if (!accessToken) throw new Error('Chưa đăng nhập')

      // Với mỗi món: lấy snapshotId mới nhất → POST /order
      // Promise.all để gọi song song, không tuần tự
      await Promise.all(items.map(async item => {
        // Lấy snapshot mới nhất của dish này từ Menu.API
        const snapshotRes = await http.get<{ message: string; data: { id: number } }>(
          `/api/v1/dish-snapshot/by-dish/${item.dishId}`,
          { service: 'menu' }
        )
        const snapshotId = snapshotRes.payload.data.id

        // Tạo order với Guest JWT
        return http.post(
          '/api/v1/order',
          { dishSnapshotId: snapshotId, quantity: item.quantity },
          {
            service: 'order',
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )
      }))
    },
    onSuccess: () => {
      toast.success(`Đã đặt ${totalItems} món!`)
      setCart([])
    },
    onError: (error: any) => {
      if (error?.status === 401) {
        toast.error('Phiên đã hết hạn. Vui lòng quét QR lại.')
        router.replace(`/table/${tableId}/welcome`)
      } else {
        handleErrorApi({ error })
      }
    }
  })

  const guestInfo = getGuestInfo()

  return (
    <div className="flex min-h-screen flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-background px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">Viet Gold</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Bàn {tableId}{guestInfo ? ` · ${guestInfo.name}` : ''}
            </p>
          </div>
          <Link
            href={`/table/${tableId}/orders`}
            className="shrink-0 rounded-md border border-border-subtle bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-gold-subtle shadow-card"
          >
            Đơn của tôi
          </Link>
        </div>
      </header>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all',
              activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'border border-border-subtle bg-card text-muted-foreground hover:bg-gold-subtle hover:text-foreground'
            )}>
            {cat === 'all' ? 'Tất cả' : (CATEGORY_LABELS[cat] ?? cat)}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-3 px-4">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && filteredDishes.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Không có món trong danh mục này</p>
        )}
        {filteredDishes.map(dish => {
          const qty = getQty(dish.id)
          // imagePath có thể là relative path hoặc full URL
          const imgSrc = dish.imagePath
            ? dish.imagePath.startsWith('http')
              ? dish.imagePath
              : `${envConfig.NEXT_PUBLIC_API_MENU}${dish.imagePath}`
            : null

          return (
            <div key={dish.id}
              className="flex gap-4 rounded-md border border-border-subtle bg-card p-4 shadow-card transition-all hover:border-gold-border">
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
                {imgSrc ? (
                  <Image src={imgSrc} alt={dish.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{dish.name}</h3>
                  {dish.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{dish.description}</p>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{formatCurrency(dish.price)}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(dish.id, -1)} disabled={qty === 0}
                      className={cn('flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all',
                        qty === 0 ? 'cursor-not-allowed opacity-40' : 'hover:shadow-gold')}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-foreground">{qty}</span>
                    <button onClick={() => updateQty(dish.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all hover:shadow-gold">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gold-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-[440px] items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">{totalItems} món</p>
              <p className="font-bold text-primary">{formatCurrency(totalPrice)}</p>
            </div>
            <button
              onClick={() => orderMutation.mutate(cart)}
              disabled={orderMutation.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold uppercase tracking-wide text-primary-foreground shadow-md hover:shadow-gold disabled:opacity-60">
              {orderMutation.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" />Đang đặt...</>
                : `Đặt món (${totalItems})`
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}