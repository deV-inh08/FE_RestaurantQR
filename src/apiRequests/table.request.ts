import http from '../lib/http'

import { TableListResType, TableResType, CreateTableBodyType, UpdateTableStatusBodyType } from '../schema/table.schema';

const tableApiRequest = {
    getAll: () =>
        http.get<TableListResType>('/table', { service: 'order' }),

    getById: (id: number) =>
        http.get<TableResType>(`/table/${id}`, { service: 'order' }),

    create: (body: CreateTableBodyType) =>
        http.post<TableResType>('/table', body, { service: 'order' }),

    updateStatus: (id: number, body: UpdateTableStatusBodyType) =>
        http.patch<TableResType>(`/table/${id}/status`, body, { service: 'order' }),

    /** Staff calls reset when a guest leaves — generates new SessionId, sets status Hidden */
    reset: (id: number) =>
        http.patch<TableResType>(`/table/${id}/reset`, null, { service: 'order' }),

    delete: (id: number) =>
        http.delete<TableResType>(`/table/${id}`, { service: 'order' })
}

export default tableApiRequest

