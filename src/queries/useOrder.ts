import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import orderApiRequest from '@/src/apiRequests/order.request'
import { CreateOrderBodyType, UpdateOrderStatusBodyType } from '@/src/schema/order.schema'
// ─── Order keys ────────────────────────────────────
export const orderKeys = {
    all: ['orders'] as const
}

export const useGetOrders = () =>
    useQuery({
        queryKey: orderKeys.all,
        queryFn: orderApiRequest.getAll,
        // Poll every 15s so the order list stays fresh without WebSocket
        refetchInterval: 15_000
    })

export const useUpdateOrderStatusMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateOrderStatusBodyType & { id: number }) =>
            orderApiRequest.updateStatus(id, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all })
    })
}

export const useCreateOrderMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (body: CreateOrderBodyType) => orderApiRequest.create(body),
        onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all })
    })
}