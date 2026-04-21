import { clearGuestSession, getGuestRefreshToken, setGuestTokens } from '../lib/guest-session'
import {
    getClientCookie,
    removeTokensFromLS, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage
} from '../lib/utils'
import guestApiRequest from '../apiRequests/guest.request'

function extractTableIdFromPath(): string {
    const match = window.location.pathname.match(/^\/table\/(\d+)/)
    return match?.[1] ?? ''
}

const isClient = typeof window !== 'undefined'

let clientLogoutRequest: null | Promise<void> = null

export async function handleUnauthorized(tokenFromHeader: string | null): Promise<void> {
    if (!isClient) return

    const isGuestRoute = window.location.pathname.startsWith('/table/')

    if (isGuestRoute) {
        // ── Guest path: thử refresh, nếu thất bại → về welcome page ──
        const refreshToken = getGuestRefreshToken()

        if (refreshToken) {
            try {
                const res = await guestApiRequest.refreshToken(refreshToken)
                // Refresh thành công → lưu token mới, reload lại trang
                setGuestTokens(res.payload.accessToken, res.payload.refreshToken)
                window.location.reload()
                return
            } catch {
                // Refresh thất bại → xóa session, redirect về welcome
            }
        }

        clearGuestSession()
        const tableId = extractTableIdFromPath()
        window.location.href = `/table/${tableId}`
        return
    }

    // ── Admin path: logout + redirect về login ──
    if (!clientLogoutRequest) {
        clientLogoutRequest = fetch('/api/auth/logout', { method: 'POST' })
            .then(() => {
                removeTokensFromLS()
                const locale = getClientCookie('NEXT_LOCALE') ?? 'en'
                location.href = `/${locale}/login`
            })
            .finally(() => {
                clientLogoutRequest = null
            })
    }

    await clientLogoutRequest
}

export function saveTokens(accessToken: string, refreshToken: string): void {
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)
}