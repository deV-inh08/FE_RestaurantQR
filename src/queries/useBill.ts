import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import billApiRequest from '../apiRequests/bill.request'
import type { ConfirmBillBodyType } from '../schema/bill.schema'

export const billKeys = {
    all: ['bills'] as const,
    list: (page: number, pageSize: number) => ['bills', 'list', page, pageSize] as const,
    table: (tableId: number) => ['bills', 'table', tableId] as const,
}

export const useGetBills = (page = 1, pageSize = 20) =>
    useQuery({
        queryKey: billKeys.list(page, pageSize),
        queryFn: () => billApiRequest.getAll(page, pageSize),
    })

export const useGetTableBill = (tableId: number, enabled = true) =>
    useQuery({
        queryKey: billKeys.table(tableId),
        queryFn: () => billApiRequest.getByTable(tableId),
        enabled: enabled && tableId > 0,
    })

export const useRequestBillMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (guestAccessToken: string) => billApiRequest.request(guestAccessToken),
        onSuccess: () => qc.invalidateQueries({ queryKey: billKeys.all }),
    })
}

export const useConfirmBillMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: ConfirmBillBodyType & { id: number }) =>
            billApiRequest.confirm(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: billKeys.all })   // bill badge biến mất
            qc.invalidateQueries({ queryKey: ['orders'] })     // badge số món trên bàn biến mất
            qc.invalidateQueries({ queryKey: ['tables'] })
        },
    })
}