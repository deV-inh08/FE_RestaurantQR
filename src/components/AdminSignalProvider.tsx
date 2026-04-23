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
import { showBillRequestToast } from './bill/BillRequestToast'

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
                onBillRequested: (bill) => {
                    queryClient.invalidateQueries({ queryKey: billKeys.all })
                    showBillRequestToast(bill, () => { window.location.href = '/admin/orders' })
                },
                onBillPaid: (bill) => {
                    queryClient.invalidateQueries({ queryKey: billKeys.all })
                },
            }
            : {
                role: 'staff',
                token: null, // hook sẽ skip khi token null
            }
    )

    return null // Provider không render gì
}