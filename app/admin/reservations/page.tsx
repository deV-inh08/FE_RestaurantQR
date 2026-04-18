'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Search, CalendarDays } from 'lucide-react'

interface Reservation {
  id: number
  name: string
  phone: string
  tableNumber: number
  tableCapacity: number
  date: string
  time: string
  guests: number
  note: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const SEED_DATA: Reservation[] = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901 234 567", tableNumber: 5, tableCapacity: 4, date: "2024-12-20", time: "18:00", guests: 3, note: "Birthday dinner", status: "pending", createdAt: "2024-12-19T10:00:00Z" },
  { id: 2, name: "Trần Thị B", phone: "0912 345 678", tableNumber: 2, tableCapacity: 2, date: "2024-12-20", time: "19:30", guests: 2, note: "", status: "confirmed", createdAt: "2024-12-19T11:00:00Z" },
  { id: 3, name: "Lê Minh C", phone: "0923 456 789", tableNumber: 7, tableCapacity: 6, date: "2024-12-21", time: "12:00", guests: 5, note: "Window seat preferred", status: "pending", createdAt: "2024-12-19T12:00:00Z" },
  { id: 4, name: "Phạm Thu D", phone: "0934 567 890", tableNumber: 10, tableCapacity: 8, date: "2024-12-21", time: "20:00", guests: 7, note: "Anniversary", status: "confirmed", createdAt: "2024-12-19T13:00:00Z" },
  { id: 5, name: "Hoàng Văn E", phone: "0945 678 901", tableNumber: 4, tableCapacity: 4, date: "2024-12-22", time: "11:30", guests: 4, note: "", status: "cancelled", createdAt: "2024-12-19T14:00:00Z" },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('vietgold_reservations')
    if (stored) {
      setReservations(JSON.parse(stored))
    } else {
      setReservations(SEED_DATA)
      localStorage.setItem('vietgold_reservations', JSON.stringify(SEED_DATA))
    }
  }, [])

  const filteredReservations = reservations
    .filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
    )
    .filter(r => dateFilter ? r.date === dateFilter : true)
    .filter(r => statusFilter === 'all' ? true : r.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalBookings = reservations.length
  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const todayCount = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length

  const updateStatus = (id: number, newStatus: 'confirmed' | 'cancelled') => {
    const updated = reservations.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    )
    setReservations(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vietgold_reservations', JSON.stringify(updated))
    }
  }

  const deleteReservation = (id: number) => {
    const updated = reservations.filter(r => r.id !== id)
    setReservations(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vietgold_reservations', JSON.stringify(updated))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(255, 192, 0, 0.12)', color: '#FFC000' }
      case 'confirmed':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }
      default:
        return { bg: 'rgba(255, 192, 0, 0.12)', color: '#FFC000' }
    }
  }

  return (
    <>
      <AdminHeader title="RESERVATIONS" subtitle="Manage table bookings" />

      <div style={{ padding: '32px 40px' }}>
        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {[
            { label: 'TOTAL BOOKINGS', value: totalBookings, color: '#F5F0E8' },
            { label: 'PENDING', value: pendingCount, color: '#FFC000' },
            { label: "TODAY'S BOOKINGS", value: todayCount, color: '#22c55e' },
          ].map((metric, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1A1714',
                borderRadius: '10px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: '#8A7F72',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: metric.color,
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '12px',
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            flex: 1,
            maxWidth: '400px',
          }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8A7F72',
              }}
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: '#1A1714',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                height: '32px',
                paddingLeft: '32px',
                paddingRight: '12px',
                fontSize: '13px',
                color: '#F5F0E8',
                width: '100%',
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                backgroundColor: '#1A1714',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                height: '32px',
                padding: '0 12px',
                fontSize: '13px',
                color: '#F5F0E8',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: '#1A1714',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                height: '32px',
                padding: '0 12px',
                fontSize: '13px',
                color: '#F5F0E8',
                minWidth: '140px',
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: '#1A1714',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          {filteredReservations.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#8A7F72',
            }}>
              <CalendarDays size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontSize: '14px' }}>No reservations found</div>
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                Try adjusting your filters
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#110F0C',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    height: '40px',
                  }}>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>GUEST</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>PHONE</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>TABLE</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>DATE & TIME</th>
                    <th style={{ padding: '0 16px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>GUESTS</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>NOTE</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>STATUS</th>
                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#8A7F72', letterSpacing: '0.08em' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => {
                    const statusColor = getStatusColor(res.status)
                    const initials = res.name.split(' ').map(n => n[0]).join('')
                    return (
                      <tr
                        key={res.id}
                        style={{
                          height: '56px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 192, 0, 0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Guest with Avatar */}
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                backgroundColor: 'rgba(255, 192, 0, 0.1)',
                                color: '#FFC000',
                                width: '32px',
                                height: '32px',
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '13px',
                              }}
                            >
                              {initials}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F5F0E8' }}>
                              {res.name}
                            </span>
                          </div>
                        </td>
                        {/* Phone */}
                        <td style={{ padding: '0 16px', fontSize: '13px', color: '#8A7F72' }}>
                          {res.phone}
                        </td>
                        {/* Table */}
                        <td style={{ padding: '0 16px' }}>
                          <span style={{
                            backgroundColor: 'rgba(255, 192, 0, 0.1)',
                            color: '#FFC000',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}>
                            Table {res.tableNumber}
                          </span>
                        </td>
                        {/* Date & Time */}
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#F5F0E8' }}>
                            {res.date}
                          </div>
                          <div style={{ fontSize: '11px', color: '#8A7F72', marginTop: '2px' }}>
                            {res.time}
                          </div>
                        </td>
                        {/* Guests */}
                        <td style={{ padding: '0 16px', fontSize: '13px', color: '#F5F0E8', textAlign: 'center' }}>
                          {res.guests}
                        </td>
                        {/* Note */}
                        <td style={{
                          padding: '0 16px',
                          fontSize: '12px',
                          color: '#8A7F72',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {res.note || '—'}
                        </td>
                        {/* Status */}
                        <td style={{ padding: '0 16px' }}>
                          <span style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                            borderRadius: '999px',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '3px 10px',
                            display: 'inline-block',
                          }}>
                            {res.status.toUpperCase()}
                          </span>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {res.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateStatus(res.id, 'confirmed')}
                                  style={{
                                    backgroundColor: '#FFC000',
                                    color: '#000000',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    height: '28px',
                                  }}
                                >
                                  CONFIRM
                                </button>
                                <button
                                  onClick={() => updateStatus(res.id, 'cancelled')}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: '#ef4444',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    cursor: 'pointer',
                                    height: '28px',
                                  }}
                                >
                                  CANCEL
                                </button>
                              </>
                            )}
                            {res.status === 'confirmed' && (
                              <button
                                onClick={() => updateStatus(res.id, 'cancelled')}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#ef4444',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  cursor: 'pointer',
                                  height: '28px',
                                }}
                              >
                                CANCEL
                              </button>
                            )}
                            {res.status === 'cancelled' && (
                              <button
                                onClick={() => deleteReservation(res.id)}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#8A7F72',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  cursor: 'pointer',
                                  height: '28px',
                                }}
                              >
                                DELETE
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
