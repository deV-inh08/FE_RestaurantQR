/**
 * useOrderSignalR.ts
 *
 * Hook quản lý kết nối SignalR với Order.API/hubs/order
 *
 * Cài package trước:
 *   npm install @microsoft/signalr
 *
 * Cách dùng:
 *   Staff:  useOrderSignalR({ role: 'staff', token: accessToken })
 *   Guest:  useOrderSignalR({ role: 'guest', tableId: 3, token: guestToken })
 */

import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import envConfig from '@/src/config'
import type { OrderDto } from '@/src/schema/order.schema'
import type { BillDto } from '@/src/schema/bill.schema'
import { TableDto } from '../schema/table.schema'

// ─── Types ──────────────────────────────────────────────────────────────────

type StaffOptions = {
    role: 'staff'
    token: string | null
    onOrderCreated?: (order: OrderDto) => void
    onOrderStatusUpdated?: (order: OrderDto) => void
    onTableStatusChanged?: (table: TableDto) => void
    onBillRequested?: (bill: BillDto) => void   // ← thêm
    onBillPaid?: (bill: BillDto) => void        // ← thêm
}

type GuestOptions = {
    role: 'guest'
    tableNumber: number
    token: string | null
    onOrderCreated?: (order: OrderDto) => void
    onOrderStatusUpdated?: (order: OrderDto) => void,
    onBillRequested?: (bill: BillDto) => void   // ← thêm
    onBillPaid?: (bill: BillDto) => void        // ← thêm
}

type Options = StaffOptions | GuestOptions

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useOrderSignalR(options: Options) {
    const connectionRef = useRef<signalR.HubConnection | null>(null)

    const role = options.role
    const tableNumber = (options as GuestOptions).tableNumber

    console.log('tableNumber___________________________________________', tableNumber)
    console.log('role___________________________________________', role)
    // Dùng ref để tránh re-create connection khi callback thay đổi
    const onOrderCreatedRef = useRef(options.onOrderCreated)
    const onOrderStatusUpdatedRef = useRef(options.onOrderStatusUpdated)
    onOrderCreatedRef.current = options.onOrderCreated
    onOrderStatusUpdatedRef.current = options.onOrderStatusUpdated
    const onTableStatusChangedRef = useRef((options as StaffOptions).onTableStatusChanged)
    onTableStatusChangedRef.current = (options as StaffOptions).onTableStatusChanged

    // Bill
    const onBillRequestedRef = useRef((options as StaffOptions).onBillRequested)
    const onBillPaidRef = useRef((options as StaffOptions).onBillPaid)
    onBillRequestedRef.current = (options as StaffOptions).onBillRequested
    onBillPaidRef.current = (options as any).onBillPaid

    useEffect(() => {
        onBillPaidRef.current = options.onBillPaid  // ← update mỗi render
    }, [options.onBillPaid])

    useEffect(() => {
        if (!options.token) return

        const hubUrl = `${envConfig.NEXT_PUBLIC_SIGNALR_ORDER}/hubs/order`



        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                // SignalR WebSocket không support custom headers
                // → gửi token qua query string
                accessTokenFactory: () => options.token ?? '',
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // retry sau 0s, 2s, 5s, 10s, 30s
            .configureLogging(
                process.env.NODE_ENV === 'development'
                    ? signalR.LogLevel.Information
                    : signalR.LogLevel.Warning
            )
            .build()

        // ── Đăng ký event handlers ────────────────────────────────────────
        connection.on('OrderCreated', (order: OrderDto) => {
            onOrderCreatedRef.current?.(order)
        })

        connection.on('OrderStatusUpdated', (order: OrderDto) => {
            onOrderStatusUpdatedRef.current?.(order)
        })

        connection.on('TableStatusChanged', (table: TableDto) => {
            onTableStatusChangedRef.current?.(table)
        })

        connection.on('BillRequested', (bill: BillDto) => {
            onBillRequestedRef.current?.(bill)
        })
        connection.on('BillPaid', (bill) => {
            console.log('[SignalR] BillPaid received on guest side:', bill)
            console.log('[SignalR] onBillPaidRef.current:', onBillPaidRef.current)
            onBillPaidRef.current?.(bill)
        })

        // ── Xử lý reconnect ───────────────────────────────────────────────
        connection.onreconnected(async () => {
            console.log('[SignalR] Reconnected')
            await joinGroup(connection, options)
        })

        connection.onclose(() => {
            console.log('[SignalR] Connection closed')
        })

        // ── Start ─────────────────────────────────────────────────────────
        connection
            .start()
            .then(async () => {
                console.log('[SignalR] Connected')
                await joinGroup(connection, options)
            })
            .catch((err) => {
                console.error('[SignalR] Connection failed:', err)
            })

        connectionRef.current = connection

        // ── Cleanup ───────────────────────────────────────────────────────
        return () => {
            connection.stop()
            connectionRef.current = null
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.token, options.role, (options as GuestOptions).tableNumber])

    return connectionRef
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function joinGroup(connection: signalR.HubConnection, options: Options) {
    try {
        if (options.role === 'staff') {
            await connection.invoke('JoinStaffGroup')
            console.log('[SignalR] Joined staff group')
        } else {
            await connection.invoke('JoinTableGroup', options.tableNumber)
            console.log(`[SignalR] Joined table-${options.tableNumber} group`)
        }
    } catch (err) {
        console.error('[SignalR] Failed to join group:', err)
    }
}