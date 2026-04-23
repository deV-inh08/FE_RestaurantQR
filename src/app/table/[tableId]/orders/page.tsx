'use client'

import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatCurrency } from '@/src/lib/utils'
import { getGuestAccessToken, isGuestLoggedIn } from '@/src/lib/guest-session'
import { useGetMyOrders } from '@/src/queries/useGuest'
import envConfig from '@/src/config'
import { useQueryClient } from '@tanstack/react-query'
import { guestKeys } from '@/src/queries/useGuest'
import { OrderDto } from '@/src/schema/order.schema'
import { useOrderSignalR } from '@/src/hooks/useOrderSignalR'
import BillRequestSection from '@/src/components/bill/BillRequestSection'

// ─── Status config ──────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  Pending: { label: 'Chờ xử lý', cls: 'bg-white/8 text-foreground border border-foreground/20' },
  Preparing: { label: 'Đang nấu', cls: 'bg-primary/15 text-primary' },
  Served: { label: 'Đã phục vụ', cls: 'bg-green-500/20 text-green-400' },
  Cancelled: { label: 'Đã hủy', cls: 'bg-destructive/20 text-destructive' },
}



export function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider', cfg.cls)}>
      {cfg.label}
    </span>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function GuestOrdersPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.tableId as string

  const queryClient = useQueryClient()
  // Guard
  useEffect(() => {
    if (!isGuestLoggedIn()) router.replace(`/table/${tableId}/welcome`)
  }, [tableId, router])

  const accessToken = getGuestAccessToken()

  // Dùng hook từ useGuest.ts — đúng pattern TanStack Query
  const { data, isLoading, error, refetch, isFetching } = useGetMyOrders(tableId, accessToken)

  // Handle 401
  useEffect(() => {
    if ((error as any)?.status === 401) {
      toast.error('Phiên đã hết hạn. Vui lòng quét QR lại.')
      router.replace(`/table/${tableId}/welcome`)
    }
  }, [error, tableId, router])

  // ── SignalR: nhận realtime update từ bếp ──────────
  const handleOrderStatusUpdated = useCallback((order: OrderDto) => {
    const cfg = STATUS_CONFIG[order.status]
    if (cfg) {
      toast(`${order.dishName ?? 'Món ăn'} — ${cfg.label}`, {
        description: `x${order.quantity} · ${formatCurrency(order.dishPrice * order.quantity)}`,
        duration: 5000,
      })
    }
    // Invalidate để list tự refresh ngay
    queryClient.invalidateQueries({ queryKey: guestKeys.myOrders(tableId) })
  }, [queryClient, tableId])



  useOrderSignalR(
    accessToken
      ? {
        role: 'guest',
        tableId: Number(tableId),
        token: accessToken,
        onOrderStatusUpdated: handleOrderStatusUpdated,
      }
      : {
        role: 'guest',
        tableId: Number(tableId),
        token: null,
      }
  )

  const orders = data?.payload.data ?? []
  const activeOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Served')
  const total = orders.reduce((sum, o) =>
    o.status !== 'Cancelled' ? sum + o.dishPrice * o.quantity : sum, 0
  )

  return (
    <div className="flex min-h-screen flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-background px-4 py-4">
        <Link href={`/table/${tableId}`} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">Đơn của tôi</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Bàn {tableId}</p>
        </div>
        {/* Refresh + Live indicator */}
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} disabled={isFetching}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors">
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live</span>
          </div>
        </div>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">Bạn chưa có đơn nào</p>
          <Link href={`/table/${tableId}`}
            className="rounded-md bg-primary px-6 py-3 font-bold uppercase tracking-wide text-primary-foreground shadow-md hover:shadow-gold">
            Xem thực đơn
          </Link>
        </div>
      )}

      {/* Order list */}
      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col gap-3 px-4 pt-4">
          {orders.map(order => {
            const imgSrc = order.dishImage
              ? order.dishImage.startsWith('http')
                ? order.dishImage
                : `${envConfig.NEXT_PUBLIC_API_MENU}${order.dishImage}`
              : null

            return (
              <div key={order.id}
                className="rounded-md border border-border-subtle bg-card p-4 shadow-card">
                <div className="flex items-start gap-3">
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                    {imgSrc ? (
                      <Image src={`http://localhost:3002/${order.dishImage}`} alt={order.dishName} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-foreground leading-tight">
                        {order.dishName}
                      </h4>
                      <StatusPill status={order.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        x{order.quantity} · {formatTime(order.createdAt)}
                      </span>
                      <span className={cn('text-sm font-bold',
                        order.status === 'Cancelled'
                          ? 'text-muted-foreground line-through'
                          : 'text-primary'
                      )}>
                        {formatCurrency(order.dishPrice * order.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Total bar */}
      {orders.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gold-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-[440px] p-4">
            <div className="flex items-center justify-between rounded-md border border-border-subtle bg-card p-4 shadow-card">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {activeOrders.length > 0
                    ? `${activeOrders.length} món đang xử lý`
                    : 'Tất cả đã phục vụ'}
                </p>
                <p className="text-xs text-muted-foreground">Tổng cộng</p>
              </div>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}
      {/* ── Bill request section (Component 2) ── */}
      {!isLoading && orders.length > 0 && (
        <BillRequestSection orders={orders} accessToken={accessToken} />
      )}
    </div>
  )
}