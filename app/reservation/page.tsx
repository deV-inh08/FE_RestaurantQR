'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutGrid, CheckCircle } from 'lucide-react'

// Sample table data (mirroring admin tables page)
const tablesData = [
  { id: 1, number: 1, capacity: 2, status: "Available", qrCode: "tbl-001" },
  { id: 2, number: 2, capacity: 4, status: "Available", qrCode: "tbl-002" },
  { id: 3, number: 3, capacity: 4, status: "Reserved", qrCode: "tbl-003" },
  { id: 4, number: 4, capacity: 6, status: "Available", qrCode: "tbl-004" },
  { id: 5, number: 5, capacity: 2, status: "Hidden", qrCode: "tbl-005" },
  { id: 6, number: 6, capacity: 8, status: "Available", qrCode: "tbl-006" },
  { id: 7, number: 7, capacity: 4, status: "Reserved", qrCode: "tbl-007" },
  { id: 8, number: 8, capacity: 2, status: "Available", qrCode: "tbl-008" },
  { id: 9, number: 9, capacity: 6, status: "Available", qrCode: "tbl-009" },
  { id: 10, number: 10, capacity: 4, status: "Hidden", qrCode: "tbl-010" },
]

interface TableItem {
  id: number
  number: number
  capacity: number
  status: string
  qrCode: string
}

export default function ReservationPage() {
  const router = useRouter()
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('')
  const [note, setNote] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  const isFormValid = selectedTable && name && phone && date && time

  const handleConfirm = () => {
    if (!isFormValid) return

    const reservation = {
      id: Date.now(),
      tableNumber: selectedTable.number,
      tableCapacity: selectedTable.capacity,
      name,
      phone,
      date,
      time,
      guests,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('vietgold_reservations') || '[]')
    existing.push(reservation)
    localStorage.setItem('vietgold_reservations', JSON.stringify(existing))

    setIsConfirmed(true)
  }

  const handleReset = () => {
    setSelectedTable(null)
    setName('')
    setPhone('')
    setDate('')
    setTime('')
    setGuests('')
    setNote('')
    setIsConfirmed(false)
  }

  const availableTables = tablesData.filter(t => t.status === 'Available')
  
  // Group by capacity
  const windowSeats = availableTables.filter(t => t.capacity <= 2)
  const mainFloor = availableTables.filter(t => t.capacity >= 3 && t.capacity <= 6)
  const privateArea = availableTables.filter(t => t.capacity >= 7)

  return (
    <div style={{ backgroundColor: '#0D0B08', color: '#F5F0E8', minHeight: '100vh' }}>
      {/* Header */}
      <header 
        style={{
          backgroundColor: '#0D0B08',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '14px 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#FFC000',
                color: '#000000',
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '14px',
              }}
            >
              VG
            </div>
            <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.1em' }}>
              VIET GOLD
            </span>
          </div>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: '#8A7F72',
              textDecoration: 'none',
              letterSpacing: '0.06em',
            }}
          >
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 57px)' }}>
        {/* Left - Floor Plan */}
        <section style={{ padding: '32px 40px', borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>
            BOOK A TABLE
          </h1>
          <p style={{ fontSize: '12px', color: '#8A7F72', marginBottom: '24px', margin: '0 0 24px 0' }}>
            Select an available table from the floor plan below
          </p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#1A1714', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px' }} />
              <span style={{ fontSize: '11px', color: '#8A7F72' }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#FFC000', borderRadius: '3px' }} />
              <span style={{ fontSize: '11px', color: '#8A7F72' }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px' }} />
              <span style={{ fontSize: '11px', color: '#8A7F72' }}>Occupied</span>
            </div>
          </div>

          {/* Floor Plan */}
          <div style={{ backgroundColor: '#110F0C', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {/* Window Seats */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', color: '#8A7F72', letterSpacing: '0.1em', marginBottom: '10px' }}>
                WINDOW SEATS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {windowSeats.map(table => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: selectedTable?.id === table.id ? '#FFC000' : '#1A1714',
                      border: selectedTable?.id === table.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      transition: 'all 0.15s',
                      color: selectedTable?.id === table.id ? '#000' : '#F5F0E8',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTable?.id !== table.id) {
                        e.currentTarget.style.borderColor = 'rgba(255, 192, 0, 0.4)'
                        e.currentTarget.style.backgroundColor = 'rgba(255, 192, 0, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTable?.id !== table.id) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.backgroundColor = '#1A1714'
                      }
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>{table.number}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.06em', color: selectedTable?.id === table.id ? 'rgba(0, 0, 0, 0.6)' : '#8A7F72' }}>
                      {table.capacity} PAX
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Floor */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', color: '#8A7F72', letterSpacing: '0.1em', marginBottom: '10px' }}>
                MAIN FLOOR
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {mainFloor.map(table => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: selectedTable?.id === table.id ? '#FFC000' : '#1A1714',
                      border: selectedTable?.id === table.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      transition: 'all 0.15s',
                      color: selectedTable?.id === table.id ? '#000' : '#F5F0E8',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTable?.id !== table.id) {
                        e.currentTarget.style.borderColor = 'rgba(255, 192, 0, 0.4)'
                        e.currentTarget.style.backgroundColor = 'rgba(255, 192, 0, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTable?.id !== table.id) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.backgroundColor = '#1A1714'
                      }
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>{table.number}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.06em', color: selectedTable?.id === table.id ? 'rgba(0, 0, 0, 0.6)' : '#8A7F72' }}>
                      {table.capacity} PAX
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Private Area */}
            {privateArea.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', color: '#8A7F72', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  PRIVATE AREA
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {privateArea.map(table => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: selectedTable?.id === table.id ? '#FFC000' : '#1A1714',
                        border: selectedTable?.id === table.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        transition: 'all 0.15s',
                        color: selectedTable?.id === table.id ? '#000' : '#F5F0E8',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTable?.id !== table.id) {
                          e.currentTarget.style.borderColor = 'rgba(255, 192, 0, 0.4)'
                          e.currentTarget.style.backgroundColor = 'rgba(255, 192, 0, 0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTable?.id !== table.id) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.backgroundColor = '#1A1714'
                        }
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '700' }}>{table.number}</div>
                      <div style={{ fontSize: '9px', letterSpacing: '0.06em', color: selectedTable?.id === table.id ? 'rgba(0, 0, 0, 0.6)' : '#8A7F72' }}>
                        {table.capacity} PAX
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right - Booking Panel */}
        <aside style={{ backgroundColor: '#110F0C', padding: '32px 28px', borderLeft: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.06em', margin: '0 0 4px 0' }}>
              YOUR RESERVATION
            </h2>
            <p style={{ fontSize: '12px', color: '#8A7F72', margin: 0 }}>
              Fill in your details to confirm
            </p>
          </div>

          {!selectedTable && !isConfirmed && (
            <div style={{ backgroundColor: '#1A1714', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
              <LayoutGrid size={24} style={{ color: '#8A7F72', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '12px', color: '#8A7F72', lineHeight: '1.5', margin: 0 }}>
                No table selected yet. Click a table on the floor plan.
              </p>
            </div>
          )}

          {selectedTable && !isConfirmed && (
            <div style={{ backgroundColor: 'rgba(255, 192, 0, 0.08)', border: '1px solid rgba(255, 192, 0, 0.2)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#FFC000', color: '#000', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 }}>
                {selectedTable.number}
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#8A7F72', letterSpacing: '0.1em' }}>
                  SELECTED TABLE
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5F0E8' }}>
                  Table {selectedTable.number} · Up to {selectedTable.capacity} guests
                </div>
              </div>
            </div>
          )}

          {!isConfirmed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1A1714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#F5F0E8',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFC000'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1A1714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#F5F0E8',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFC000'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                    DATE
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#1A1714',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      color: '#F5F0E8',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#FFC000'
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                    TIME
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#1A1714',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      color: '#F5F0E8',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#FFC000'
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                  NUMBER OF GUESTS
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="2"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1A1714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#F5F0E8',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFC000'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#8A7F72', display: 'block', marginBottom: '6px' }}>
                  SPECIAL REQUEST
                </label>
                <input
                  type="text"
                  placeholder="Birthday, allergy..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1A1714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#F5F0E8',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFC000'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                onClick={handleConfirm}
                disabled={!isFormValid}
                style={{
                  backgroundColor: '#FFC000',
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  padding: '13px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  width: '100%',
                  opacity: isFormValid ? 1 : 0.35,
                }}
                onMouseEnter={(e) => {
                  if (isFormValid) {
                    e.currentTarget.style.backgroundColor = '#e6ac00'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC000'
                }}
              >
                CONFIRM RESERVATION
              </button>
            </div>
          )}

          {isConfirmed && (
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
              <CheckCircle size={32} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e', margin: '0 0 8px 0' }}>
                RESERVATION CONFIRMED!
              </h3>
              <p style={{ fontSize: '12px', color: '#8A7F72', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                Table {selectedTable!.number} reserved for {name}
                <br />
                {date} at {time} · {guests} guests
              </p>
              <button
                onClick={handleReset}
                style={{
                  fontSize: '11px',
                  color: '#FFC000',
                  letterSpacing: '0.06em',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '16px',
                }}
              >
                MAKE ANOTHER RESERVATION
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
