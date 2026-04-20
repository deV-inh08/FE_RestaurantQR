import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import tableApiRequest from '../apiRequests/table.request'
import { CreateTableBodyType, UpdateTableStatusBodyType } from '@/src/schema/table.schema'
// ─── Table keys ────────────────────────────────────
export const tableKeys = {
    all: ['tables'] as const,
    detail: (id: number) => ['tables', id] as const
}

export const useGetTables = () =>
    useQuery({ queryKey: tableKeys.all, queryFn: tableApiRequest.getAll })

export const useGetTable = ({ id, enabled }: { id: number; enabled: boolean }) =>
    useQuery({
        queryKey: tableKeys.detail(id),
        queryFn: () => tableApiRequest.getById(id),
        enabled
    })

export const useCreateTableMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (body: CreateTableBodyType) => tableApiRequest.create(body),
        onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all })
    })
}

export const useUpdateTableStatusMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateTableStatusBodyType & { id: number }) =>
            tableApiRequest.updateStatus(id, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all })
    })
}

export const useResetTableMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => tableApiRequest.reset(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all })
    })
}

export const useDeleteTableMutation = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => tableApiRequest.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all })
    })
}
