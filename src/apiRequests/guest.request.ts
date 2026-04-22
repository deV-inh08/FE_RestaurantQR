import http from '../lib/http'
import { GuestDtoType, GuestLoginBodyType, GuestLoginResponseType, GuestOrderListResponseType, GuestRefreshTokenResponseType } from '@/src/schema/guest.schema'


// ─── API requests ──────────────────────────────────────────────────────────────
const guestApiRequest = {
    /**
     * POST /order/api/v1/guest/login — AllowAnonymous
     * Guest chưa có token nên không attach Authorization header.
     * http.ts tự attach token từ localStorage nhưng guest chưa đăng nhập nên
     * localStorage sẽ trống → không có header thừa.
     */
    login: (body: GuestLoginBodyType) =>
        http.post<GuestLoginResponseType>(
            '/guest/login',
            body,
            { service: 'order' }
        ),

    /**
     * POST /order/api/v1/guest/refresh-token — AllowAnonymous
     */



    refreshToken: (refreshToken: string) =>
        http.post<GuestRefreshTokenResponseType>(
            '/guest/refresh-token',
            { refreshToken },
            { service: 'order' }
        ),

    /**
     * GET /order/api/v1/order/my-orders — Authorize(Roles = "Guest")
     * Phải attach Guest JWT thủ công vì http.ts chỉ đọc admin token từ localStorage.
     * Guest token lưu trong sessionStorage riêng.
     */
    getMyOrders: (guestAccessToken: string) =>
        http.get<GuestOrderListResponseType>(
            '/order/my-orders',
            {
                service: 'order',
                headers: { Authorization: `Bearer ${guestAccessToken}` }
            }
        ),

    /**
     * GET /order/api/v1/table/{id}/public — AllowAnonymous
     * Lấy tableNumber từ tableId (DB id) — dùng ở welcome page trước khi login.
     */
    getTablePublic: (tableId: number) =>
        http.get<{ message: string; data: { id: number; number: number; status: string } }>(
            `/table/${tableId}/public`,
            { service: 'order' }
        ),
}

export default guestApiRequest
