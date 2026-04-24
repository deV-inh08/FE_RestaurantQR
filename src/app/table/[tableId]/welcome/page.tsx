'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGuestLoginMutation, useGetTablePublic } from '@/src/queries/useGuest'
import { setGuestTokens, setGuestInfo, isGuestLoggedIn } from '../../../../lib/guest-session'
import { useState } from 'react'
import { handleErrorApi } from '@/src/lib/utils'
import { useUpdateTableStatusMutation } from '@/src/queries/useTable'

export default function GuestLoginPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = Number(params.tableId) // tableId === tableNumber

  const updateTableStatusMutation = useUpdateTableStatusMutation()

  const [name, setName] = useState('')

  // Redirect nếu đã login rồi
  useEffect(() => {
    if (isGuestLoggedIn()) {
      router.replace(`/table/${tableId}`)
    }
  }, [tableId, router])

  // Fetch table public info — lấy tableNumber và kiểm tra status
  const {
    data: tableData,
    isLoading: isLoadingTable,
    error: tableError } = useGetTablePublic(tableId)

  const table = tableData?.payload.data


  const isTableUnavailable = table && table.status === 'Hidden'

  // Login mutation
  const loginMutation = useGuestLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !table) return
    if (table.status !== "Available") toast.error('Bàn này hiện không khả dụng. Vui lòng liên hệ nhân viên.')
    try {
      const result = await loginMutation.mutateAsync({
        tableNumber: table.number,
        name: name.trim()
      })
      console.log("Guest result", result.payload)
      const { guest, accessToken, refreshToken } = result.payload.data
      // Lưu Guest JWT vào sessionStorage (tách biệt với admin localStorage)
      setGuestTokens(accessToken, refreshToken)
      setGuestInfo(guest.name, guest.tableNumber)
      updateTableStatusMutation.mutateAsync({ id: tableId, status: 'Occupied' })
      router.push(`/table/${tableId}`)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="absolute inset-0 bg-background/75" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-lg border border-gold-border bg-surface px-8 py-12 shadow-card">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">VG</span>
            </div>
            <span className="text-lg font-bold uppercase tracking-wide text-foreground">
              Viet Gold
            </span>
          </div>

          {/* Loading table info */}
          {isLoadingTable && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Table not found */}
          {tableError && (
            <p className="text-center text-sm text-destructive py-4">
              Không tìm thấy bàn này. Vui lòng quét lại QR.
            </p>
          )}

          {/* Table unavailable */}
          {table && isTableUnavailable && (
            <div className="text-center space-y-3 py-4">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-primary">
                Bàn {table.number}
              </h1>
              <p className="text-muted-foreground text-sm">
                Bàn này hiện không khả dụng. Vui lòng liên hệ nhân viên.
              </p>
            </div>
          )}

          {/* Login form */}
          {table && !isTableUnavailable && (
            <>
              <h1 className="mb-2 text-center text-3xl font-bold uppercase tracking-wide text-primary">
                Bàn {table.number}
              </h1>
              <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-foreground">
                Chào mừng đến Viet Gold
              </h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">
                Nhập tên của bạn để bắt đầu đặt món
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  disabled={loginMutation.isPending}
                  className="w-full rounded-md border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none disabled:opacity-50"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={!name.trim() || loginMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Đang kết nối...</>
                  ) : (
                    'Bắt đầu gọi món'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2024 Viet Gold
          </p>
        </div>
      </div>
    </div>
  )
}