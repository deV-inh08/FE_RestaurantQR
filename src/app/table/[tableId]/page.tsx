'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Minus, Plus } from 'lucide-react'
import http from '@/src/lib/http'
import { formatCurrency, handleErrorApi } from '@/src/lib/utils'
import { getGuestInfo } from '@/src/lib/guest-session'

type CartItem = { dishId: number; name: string; price: number; quantity: number }

export default function GuestTablePage() {
  const params = useParams()
  const router = useRouter()
  const tableId = Number(params.tableId)
  const guestInfo = getGuestInfo()

  const [cart, setCart] = useState<CartItem[]>([])
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const orderMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      // Không còn đọc accessToken thủ công từ sessionStorage — cookie
      // guestAccessToken được BFF tự gắn vào request khi gọi qua
      // service: 'guest'. Lấy dish-snapshot vẫn là call công khai/staff
      // bình thường qua service: 'menu'.
      await Promise.all(
        items.map(async (item) => {
          const snapshotRes = await http.get<{ message: string; data: { id: number } }>(
            `/dish-snapshot/by-dish/${item.dishId}`,
            { service: 'menu' }
          )
          const snapshotId = snapshotRes.payload.data.id

          return http.post(
            '/order',
            { dishSnapshotId: snapshotId, quantity: item.quantity },
            { service: 'order' }
          )
        })
      )
    },
    onSuccess: () => {
      toast.success(`Đã đặt ${totalItems} món!`)
      setCart([])
      router.push(`/table/${tableId}/orders`)
    },
    onError: (error: any) => {
      if (error?.status === 401) {
        toast.error('Phiên đã hết hạn. Vui lòng quét QR lại.')
        router.replace(`/table/${tableId}/welcome`)
      } else {
        handleErrorApi({ error })
      }
    },
  })

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header className="border-b border-foreground/10 p-4">
        <h1 className="text-lg font-bold">
          Bàn {tableId}{guestInfo ? ` · ${guestInfo.name}` : ''}
        </h1>
      </header>

      {/* Danh sách món + thêm vào cart giữ nguyên UI cũ — phần quan trọng
               về kiến trúc là orderMutation phía trên. */}

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-foreground/10 bg-card p-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div>
              <p className="text-xs text-foreground/60">{totalItems} món</p>
              <p className="text-lg font-bold">{formatCurrency(totalPrice)}</p>
            </div>
            <button
              onClick={() => orderMutation.mutate(cart)}
              disabled={orderMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {orderMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Đặt món
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
