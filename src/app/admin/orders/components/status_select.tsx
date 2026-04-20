import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/src/components/ui/select";
import { handleErrorApi } from "@/src/lib/utils";
import { useUpdateOrderStatusMutation } from "@/src/queries/useOrder";
import { toast } from "sonner";
// ─── Types ──────────────────────────────────────────
export type OrderStatus = 'Pending' | 'Preparing' | 'Served' | 'Cancelled'
export const STATUS_LABELS: Record<OrderStatus, string> = {
    Pending: 'Chờ xử lý',
    Preparing: 'Đang nấu',
    Served: 'Đã phục vụ',
    Cancelled: 'Đã hủy'
}


export const STATUS_STYLES: Record<OrderStatus, string> = {
    Pending: 'bg-white/8 text-foreground border border-foreground/20',
    Preparing: 'bg-primary/15 text-primary',
    Served: 'bg-green-500/20 text-green-400',
    Cancelled: 'bg-destructive/20 text-destructive'
}
export const STATUS_VALUES: OrderStatus[] = ['Pending', 'Preparing', 'Served', 'Cancelled']
// ─── Inline status changer ──────────────────────────
const StatusSelect = ({ orderId, current }: { orderId: number; current: string }) => {
    const mutation = useUpdateOrderStatusMutation()

    return (
        <Select
            value={current}
            onValueChange={async (status) => {
                try {
                    await mutation.mutateAsync({ id: orderId, status: status as OrderStatus })
                    toast.success(`Đã cập nhật → ${STATUS_LABELS[status as OrderStatus]}`)
                } catch (error) {
                    handleErrorApi({ error })
                }
            }}
        >
            <SelectTrigger className="h-8 w-36 border-border-subtle bg-transparent text-xs focus:ring-0">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border-subtle bg-surface">
                {STATUS_VALUES.map(s => (
                    <SelectItem key={s} value={s} className="text-xs text-foreground focus:bg-gold-subtle">
                        {STATUS_LABELS[s]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}


export default StatusSelect;