import http from '../lib/http'
import type { BillResType, BillListResType, ConfirmBillBodyType } from '../schema/bill.schema'

const billApiRequest = {
    /** GET /bill — all bills paginated (Staff/Admin) */
    getAll: (page = 1, pageSize = 20) =>
        http.get<BillListResType>(`/bill?page=${page}&pageSize=${pageSize}`, { service: 'order' }),

    /** GET /bill/table/{tableId} — current session bill for a table (Staff/Admin) */
    getByTable: (tableId: number) =>
        http.get<BillResType>(`/bill/table/${tableId}`, { service: 'order' }),

    /** POST /bill/request — guest requests the bill */
    request: (guestAccessToken: string) =>
        http.post<BillResType>('/bill/request', null, {
            service: 'order',
            headers: { Authorization: `Bearer ${guestAccessToken}` },
        }),

    /** PATCH /bill/{id}/pay — staff confirms payment */
    confirm: (id: number, body: ConfirmBillBodyType) =>
        http.patch<BillResType>(`/bill/${id}/pay`, body, { service: 'order' }),
}

export default billApiRequest