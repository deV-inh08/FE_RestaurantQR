import { handleErrorApi } from "@/src/lib/utils"
import { useUpdateDepositStatusMutation, useUpdateReservationStatusMutation } from "@/src/queries/useReservation"
import { DepositStatusType, ReservationDto, ReservationStatusType } from "@/src/schema/reservation.schema"
import { toast } from "sonner"


// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    })
}
function formatTime(date: Date | string) {
    return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
    })
}
function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}


// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    ReservationStatusType,
    { label: string; bg: string; color: string }
> = {
    Booked: { label: 'Đã đặt', bg: 'rgba(255,192,0,0.12)', color: '#FFC000' },
    CheckedIn: { label: 'Đã đến', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
    Cancelled: { label: 'Đã hủy', bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
}

const DEPOSIT_CONFIG: Record<
    DepositStatusType,
    { label: string; color: string }
> = {
    None: { label: 'Không cọc', color: '#8A7F72' },
    Pending: { label: 'Chờ cọc', color: '#FFC000' },
    Paid: { label: 'Đã cọc', color: '#22c55e' },
    Refunded: { label: 'Đã hoàn', color: '#60a5fa' },
    Forfeited: { label: 'Mất cọc', color: '#ef4444' },
}
function TableReservation({
    res,
    onDelete,
}: {
    res: ReservationDto
    onDelete: (r: ReservationDto) => void
}) {
    const statusMutation = useUpdateReservationStatusMutation()
    const depositMutation = useUpdateDepositStatusMutation()
    const statusCfg = STATUS_CONFIG[res.status]
    const depositCfg = DEPOSIT_CONFIG[res.depositStatus]

    const confirm = async () => {
        try {
            await statusMutation.mutateAsync({ id: res.id, status: 'CheckedIn' })
            toast.success('Đã xác nhận khách đến')
        } catch (error) { handleErrorApi({ error }) }
    }

    const cancel = async () => {
        try {
            await statusMutation.mutateAsync({ id: res.id, status: 'Cancelled' })
            toast.success('Đã hủy lịch đặt')
        } catch (error) { handleErrorApi({ error }) }
    }

    const markPaid = async () => {
        try {
            await depositMutation.mutateAsync({ id: res.id, depositStatus: 'Paid' })
            toast.success('Đã cập nhật cọc → Đã cọc')
        } catch (error) { handleErrorApi({ error }) }
    }

    const isPending = statusMutation.isPending || depositMutation.isPending

    return (
        <tr
            style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,192,0,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
            {/* Guest */}
            <td style={{ padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        backgroundColor: 'rgba(255,192,0,0.1)', color: '#FFC000',
                        width: 32, height: 32, borderRadius: 999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>
                        {getInitials(res.guestName)}
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8' }}>
                            {res.guestName}
                        </div>
                        {res.guestEmail && (
                            <div style={{ fontSize: 11, color: '#8A7F72' }}>{res.guestEmail}</div>
                        )}
                    </div>
                </div>
            </td>

            {/* Phone */}
            <td style={{ padding: '0 16px', fontSize: 13, color: '#8A7F72' }}>{res.guestPhone}</td>

            {/* Table */}
            <td style={{ padding: '0 16px' }}>
                {res.tableId ? (
                    <span style={{
                        backgroundColor: 'rgba(255,192,0,0.1)', color: '#FFC000',
                        fontWeight: 700, padding: '3px 10px', borderRadius: 6, fontSize: 12,
                    }}>
                        Bàn {res.tableNumber}
                    </span>
                ) : (
                    <span style={{ fontSize: 12, color: '#8A7F72' }}>Chưa chọn</span>
                )}
            </td>

            {/* Date & Time */}
            <td style={{ padding: '0 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#F5F0E8' }}>
                    {formatDate(res.reservationDate)}
                </div>
                <div style={{ fontSize: 11, color: '#8A7F72', marginTop: 2 }}>
                    {formatTime(res.reservationDate)}
                </div>
            </td>

            {/* Guests */}
            <td style={{ padding: '0 16px', fontSize: 13, color: '#F5F0E8', textAlign: 'center' }}>
                {res.numberOfPeople}
            </td>

            {/* Deposit */}
            <td style={{ padding: '0 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 10, color: depositCfg.color, fontWeight: 600 }}>
                        {depositCfg.label}
                    </span>
                    {res.depositAmount > 0 && (
                        <span style={{ fontSize: 11, color: '#8A7F72' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                .format(res.depositAmount)}
                        </span>
                    )}
                </div>
            </td>

            {/* Note */}
            <td style={{
                padding: '0 16px', fontSize: 12, color: '#8A7F72',
                maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
                {res.note || '—'}
            </td>

            {/* Status */}
            <td style={{ padding: '0 16px' }}>
                <span style={{
                    backgroundColor: statusCfg.bg, color: statusCfg.color,
                    borderRadius: 999, fontSize: 10, fontWeight: 600,
                    padding: '3px 10px', display: 'inline-block',
                }}>
                    {statusCfg.label}
                </span>
            </td>

            {/* Actions */}
            <td style={{ padding: '0 16px' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {/* Booked → confirm arrival or cancel */}
                    {res.status === 'Booked' && (
                        <>
                            <button
                                onClick={confirm}
                                disabled={isPending}
                                style={{
                                    backgroundColor: '#FFC000', color: '#000',
                                    fontSize: 11, fontWeight: 700,
                                    padding: '4px 10px', borderRadius: 6,
                                    border: 'none', cursor: 'pointer', height: 28,
                                    opacity: isPending ? 0.6 : 1,
                                }}
                            >
                                Check-in
                            </button>
                            <button
                                onClick={cancel}
                                disabled={isPending}
                                style={{
                                    backgroundColor: 'transparent', color: '#ef4444',
                                    fontSize: 11, fontWeight: 700,
                                    padding: '4px 10px', borderRadius: 6,
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    cursor: 'pointer', height: 28,
                                    opacity: isPending ? 0.6 : 1,
                                }}
                            >
                                Hủy
                            </button>
                        </>
                    )}

                    {/* CheckedIn → cancel still allowed */}
                    {res.status === 'CheckedIn' && (
                        <>
                            {res.depositStatus === 'Pending' && (
                                <button
                                    onClick={markPaid}
                                    disabled={isPending}
                                    style={{
                                        backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e',
                                        fontSize: 11, fontWeight: 700,
                                        padding: '4px 10px', borderRadius: 6,
                                        border: '1px solid rgba(34,197,94,0.3)',
                                        cursor: 'pointer', height: 28,
                                        opacity: isPending ? 0.6 : 1,
                                    }}
                                >
                                    Nhận cọc
                                </button>
                            )}
                            <button
                                onClick={cancel}
                                disabled={isPending}
                                style={{
                                    backgroundColor: 'transparent', color: '#ef4444',
                                    fontSize: 11, fontWeight: 700,
                                    padding: '4px 10px', borderRadius: 6,
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    cursor: 'pointer', height: 28,
                                    opacity: isPending ? 0.6 : 1,
                                }}
                            >
                                Hủy
                            </button>
                        </>
                    )}

                    {/* Cancelled → delete */}
                    {res.status === 'Cancelled' && (
                        <button
                            onClick={() => onDelete(res)}
                            style={{
                                backgroundColor: 'transparent', color: '#8A7F72',
                                fontSize: 11, fontWeight: 700,
                                padding: '4px 10px', borderRadius: 6,
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', height: 28,
                            }}
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default TableReservation;