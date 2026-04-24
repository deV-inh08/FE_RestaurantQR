import { clearGuestSession, getGuestRefreshToken, setGuestTokens } from '../lib/guest-session'
import {
    getClientCookie,
    removeTokensFromLS, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage
} from '../lib/utils'
import guestApiRequest from '../apiRequests/guest.request'
import authApiRequest from '../apiRequests/auth.request'
import { toast } from 'sonner'

function extractTableIdFromPath(): string {
    const match = window.location.pathname.match(/^\/table\/(\d+)/)
    return match?.[1] ?? ''
}

const isClient = typeof window !== 'undefined'

let clientLogoutRequest: null | Promise<void> = null

export async function handleUnauthorized(tokenFromHeader: string | null): Promise<void> {
    if (!isClient) return

    const isGuestRoute = window.location.pathname.startsWith('/table/')

    // Guest
    if (isGuestRoute) {
        // ── Guest path: thử refresh, nếu thất bại → về welcome page ──
        const refreshToken = getGuestRefreshToken()

        if (refreshToken) {
            try {
                const res = await guestApiRequest.refreshToken(refreshToken)
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.payload.data
                // Refresh thành công → lưu token mới, reload lại trang
                setGuestTokens(newAccessToken, newRefreshToken)
                window.location.reload()
                return
            } catch {
                // Refresh thất bại → xóa session, redirect về welcome
                clearGuestSession()
                toast.error("Session đã hết hạn, vui lòng đăng nhập lại")
                const tableId = extractTableIdFromPath()
                window.location.href = `/table/${tableId}`
                return
            }
        }

        clearGuestSession()
        const tableId = extractTableIdFromPath()
        window.location.href = `/table/${tableId}`
        return
    }

    // ── Admin path: thử refresh token trước khi logout ──
    try {
        const res = await authApiRequest.refreshToken()
        const { accessToken, refreshToken } = res.payload.data
        saveTokens(accessToken, refreshToken)
        window.location.reload()
        return
    } catch {
        if (!clientLogoutRequest) {
            clientLogoutRequest = fetch('/api/auth/logout', { method: 'POST' })
                .then(() => {
                    removeTokensFromLS()
                    location.href = `/login`
                })
                .finally(() => {
                    clientLogoutRequest = null
                })
        }
        await clientLogoutRequest
    }
}

export function saveTokens(accessToken: string, refreshToken: string): void {
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)
}

// kcnlDKGcaWL0ZGFFUEYlF7Tozi_eZ7JJvYNThoEH1N0