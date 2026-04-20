import { useMutation, useQuery } from '@tanstack/react-query'
import guestApiRequest from '../apiRequests/guest.request'
import { GuestLoginBodyType } from '../schema/guest.schema'

// ─── Query keys ────────────────────────────────────
export const guestKeys = {
    myOrders: (tableId: string) => ['guest-orders', tableId] as const,
    tablePublic: (tableId: number) => ['table-public', tableId] as const,
}

// ─── Mutations ─────────────────────────────────────

/**
 * POST /order/api/v1/guest/login
 * Không invalidate cache — login là one-shot, không liên quan query cache.
 */
export const useGuestLoginMutation = () =>
    useMutation({
        mutationFn: (body: GuestLoginBodyType) => guestApiRequest.login(body),
    })

/**
 * POST /order/api/v1/guest/refresh-token
 */
export const useGuestRefreshTokenMutation = () =>
    useMutation({
        mutationFn: (refreshToken: string) => guestApiRequest.refreshToken(refreshToken),
    })

// ─── Queries ───────────────────────────────────────

/**
 * GET /order/api/v1/order/my-orders
 * Poll 15s để live update trạng thái đơn hàng.
 * enabled = false khi chưa có token (chưa login).
 */
export const useGetMyOrders = (tableId: string, guestAccessToken: string | null) =>
    useQuery({
        queryKey: guestKeys.myOrders(tableId),
        queryFn: () => guestApiRequest.getMyOrders(guestAccessToken!),
        enabled: Boolean(guestAccessToken),
        refetchInterval: 15_000,
    })

/**
 * GET /order/api/v1/table/{id}/public
 * Fetch table info (number, status) trước khi login — không cần auth.
 */
export const useGetTablePublic = (tableId: number) =>
    useQuery({
        queryKey: guestKeys.tablePublic(tableId),
        queryFn: () => guestApiRequest.getTablePublic(tableId),
        enabled: tableId > 0,
        // Không cần refetch — table info ổn định trong suốt session
        staleTime: 5 * 60 * 1000,
    })