'use client'

/**
 * AdminSignalRProvider.tsx
 *
 * Mount component này trong src/app/admin/layout.tsx
 * để SignalR kết nối 1 lần duy nhất cho toàn admin session.
 *
 * Features:
 * - Kết nối SignalR khi admin login
 * - Show toast notification khi có order mới
 * - Update unread badge trên sidebar
 * - Invalidate React Query cache → bảng order tự refresh
 */

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useOrderSignalR } from '@/src/hooks/useOrderSignalR'
import { useOrderNotificationStore } from '@/src/hooks/useOrderNotification'
import { useAppProviderStore } from '@/src/components/app-provider'
import { getAccessTokenFromLocalStorage, formatCurrency } from '@/src/lib/utils'
import type { OrderDto } from '@/src/schema/order.schema'
import { BillDto } from '../schema/bill.schema'
import { billKeys } from '../queries/useBill'

export function AdminSignalRProvider() {
    const role = useAppProviderStore((state) => state.role)
    const token = getAccessTokenFromLocalStorage()
    const addOrderCreated = useOrderNotificationStore((s) => s.addOrderCreated)
    const addOrderStatusUpdated = useOrderNotificationStore((s) => s.addOrderStatusUpdated)
    const queryClient = useQueryClient()

    const isStaff = role === 'Staff' || role === 'Admin' || role === 'SuperAdmin'


    // ── Handler: Order mới được tạo ─────────────────────────────────────────
    const handleOrderCreated = (order: OrderDto) => {
        // 1. Thêm vào notification store (badge sidebar)
        addOrderCreated(order)

        // 2. Toast thông báo
        toast(`Order mới — Bàn ${order.tableNumber}`, {
            description: `${order.dishName} x${order.quantity} — ${formatCurrency(order.dishPrice * order.quantity)}`,
            duration: 6000,
            action: {
                label: 'Xem',
                onClick: () => {
                    // Navigate đến trang orders
                    window.location.href = '/admin/orders'
                },
            },
        })

        // 3. Invalidate cache → danh sách orders tự refresh
        queryClient.invalidateQueries({ queryKey: ['orders'] })
    }


    // ── Bill request handler ─────────────────────────────────────────────────
    const handleBillRequested = (bill: BillDto) => {
        // Invalidate bill cache so sidebar badge updates
        queryClient.invalidateQueries({ queryKey: billKeys.all })

        // Format VND
        const vnd = new Intl.NumberFormat('vi-VN').format(bill.totalAmount) + ' VND'

        toast(
            `Yêu cầu thanh toán — Bàn ${bill.tableNumber}`,
            {
                description: `${bill.guestName} · ${bill.orders.length} món · ${vnd}`,
                duration: 8000,
                icon: (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: 'rgba(255,192,0,0.12)', color: '#FFC000',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    </div>
                ),
                action: {
                    label: 'XEM',
                    onClick: () => { window.location.href = '/admin/orders' },
                },
                style: { borderLeft: '3px solid #FFC000' },
            }
        )
    }

    // ── Handler: Status order thay đổi ──────────────────────────────────────
    const handleOrderStatusUpdated = (order: OrderDto) => {
        // Chỉ notify khi có staff khác update (không notify chính mình)
        // → Vẫn invalidate cache để đồng bộ
        queryClient.invalidateQueries({ queryKey: ['orders'] })
    }

    // ── Kết nối SignalR ─────────────────────────────────────────────────────
    useOrderSignalR(
        isStaff && token
            ? {
                role: 'staff',
                token,
                onOrderCreated: handleOrderCreated,
                onOrderStatusUpdated: handleOrderStatusUpdated,
            }
            : {
                role: 'staff',
                token: null, // hook sẽ skip khi token null
            }
    )

    return null // Provider không render gì
}