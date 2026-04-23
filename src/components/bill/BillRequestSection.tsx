import { StatusPill } from "@/src/app/table/[tableId]/orders/page"
import { cn, formatCurrency } from "@/src/lib/utils"
import { useRequestBillMutation } from "@/src/queries/useBill"
import { OrderDto } from "@/src/schema/order.schema"
import { Loader2, Receipt } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

// ─── Bill request section ────────────────────────────────────────────────────
type BillButtonState = 'idle' | 'requesting' | 'requested'

export default function BillRequestSection({
    orders,
    accessToken,
}: {
    orders: OrderDto[]
    accessToken: string | null
}) {
    const [billState, setBillState] = useState<BillButtonState>('idle')
    const requestBillMutation = useRequestBillMutation()

    const activeOrders = orders.filter((o) => o.status !== 'Cancelled')
    const total = activeOrders.reduce((s, o) => s + o.dishPrice * o.quantity, 0)

    // If any order is still Pending/Preparing — show a warning
    const hasUnfinished = activeOrders.some(
        (o) => o.status === 'Pending' || o.status === 'Preparing'
    )

    // Compact order summary rows (only active)
    const summaryRows = activeOrders.map((o) => ({
        name: o.dishName,
        qty: o.quantity,
        price: o.dishPrice * o.quantity,
        status: o.status,
    }))

    const handleRequest = async () => {
        if (!accessToken || billState === 'requested') return
        setBillState('requesting')
        try {
            await requestBillMutation.mutateAsync(accessToken)
            setBillState('requested')
            toast.success('Đã gửi yêu cầu thanh toán. Nhân viên sẽ đến ngay!')
        } catch {
            setBillState('idle')
            toast.error('Không thể gửi yêu cầu. Vui lòng thử lại hoặc gọi nhân viên.')
        }
    }

    if (activeOrders.length === 0) return null

    return (
        <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Đơn của tôi
                    </span>
                </div>
            </div>

            {/* Order summary */}
            <div className="divide-y divide-border-subtle">
                {summaryRows.map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex flex-1 items-center gap-2 min-w-0">
                            <span className="truncate text-sm text-foreground font-medium">
                                {row.name}
                            </span>
                            <StatusPill status={row.status} />
                        </div>
                        <span
                            className={cn(
                                'ml-3 shrink-0 text-sm font-semibold',
                                row.status === 'Served' ? 'text-primary' : 'text-muted-foreground',
                            )}
                        >
                            {formatCurrency(row.price)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total + button */}
            <div className="border-t border-border-subtle px-4 py-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Tổng cộng
                    </span>
                    <span className="text-xl font-black text-primary">{formatCurrency(total)}</span>
                </div>

                {hasUnfinished && billState === 'idle' && (
                    <p className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-[11px] text-amber-400">
                        Một số món vẫn đang được chế biến. Bạn vẫn có thể yêu cầu thanh toán sớm.
                    </p>
                )}

                {/* Request button — two states */}
                {billState !== 'requested' ? (
                    <button
                        onClick={handleRequest}
                        disabled={billState === 'requesting'}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold disabled:opacity-60"
                    >
                        {billState === 'requesting' ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Receipt className="h-4 w-4" />
                                Yêu cầu thanh toán
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-primary/30 bg-primary/8 py-3.5 text-sm font-bold uppercase tracking-wide text-primary"
                    >
                        {/* Pulsing dot */}
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        Đã yêu cầu — Chờ nhân viên
                    </button>
                )}
            </div>
        </div>
    )
}