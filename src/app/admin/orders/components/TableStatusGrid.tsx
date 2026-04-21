import { cn } from "@/src/lib/utils"
import { useGetOrders } from "@/src/queries/useOrder"
import { useGetTables } from "@/src/queries/useTable"
import { useMemo } from "react"

export default function TableStatusGrid({
    onSelectTable,
}: {
    onSelectTable?: (tableId: number) => void
}) {
    const { data: tablesData } = useGetTables({ page: 1, pageSize: 50 })
    const { data: ordersData } = useGetOrders({ page: 1, pageSize: 50 })

    const tables = tablesData?.payload.data.data ?? []
    const orders = ordersData?.payload.data.data ?? []

    // Count active (non-cancelled, non-served) orders per table
    const activeCountByTable = useMemo(() => {
        const map: Record<number, number> = {}
        for (const o of orders) {
            if (o.status !== 'Cancelled' && o.status !== 'Served') {
                map[o.tableId] = (map[o.tableId] ?? 0) + 1
            }
        }
        return map
    }, [orders])

    const TABLE_STATUS_STYLES: Record<string, { card: string; badge: string; label: string }> = {
        Available: {
            card: 'border-white/10 bg-white/4 hover:border-white/20',
            badge: 'border border-white/20 text-muted-foreground',
            label: 'EMPTY',
        },
        Occupied: {
            card: 'border-primary/60 bg-primary/5 hover:border-primary',
            badge: 'bg-primary text-black',
            label: 'OCCUPIED',
        },
        Hidden: {
            card: 'border-white/5 bg-white/2 opacity-60',
            badge: 'border border-white/10 text-muted-foreground/60',
            label: 'RESERVED',
        },
    }

    return (
        <section className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Table Status
            </h2>
            <div className="grid grid-cols-5 gap-3 xl:grid-cols-8">
                {tables.map((table) => {
                    const count = activeCountByTable[table.id]
                    const styleCfg = TABLE_STATUS_STYLES[table.status] ?? TABLE_STATUS_STYLES.Available

                    return (
                        <div
                            key={table.id}
                            onClick={() => onSelectTable?.(table.id)}
                            className={cn(
                                'relative cursor-pointer rounded-md border p-3 transition-all select-none',
                                styleCfg.card,
                            )}
                        >
                            {/* Active order badge */}
                            {count ? (
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
                                    {count}
                                </span>
                            ) : null}

                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                TABLE
                            </p>
                            <p className="mb-3 text-2xl font-black text-foreground leading-none">
                                {table.number}
                            </p>
                            <span className={cn('rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', styleCfg.badge)}>
                                {styleCfg.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}