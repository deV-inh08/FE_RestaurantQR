/**
 * Guest tokens → sessionStorage (tab-scoped)
 * Admin tokens → localStorage (cross-tab persistent)
 *
 * Lý do tách biệt:
 * - Guest session kết thúc khi đóng tab — không nên persist
 * - Tránh xung đột nếu nhân viên dùng cùng browser để test
 * - http.ts chỉ đọc admin token từ localStorage → không ảnh hưởng lẫn nhau
 */

const KEYS = {
    ACCESS: 'guestAccessToken',
    REFRESH: 'guestRefreshToken',
    NAME: 'guestName',
    TABLE_NUMBER: 'guestTableNumber',
} as const

const isBrowser = typeof window !== 'undefined'

export const setGuestTokens = (accessToken: string, refreshToken: string) => {
    if (!isBrowser) return
    sessionStorage.setItem(KEYS.ACCESS, accessToken)
    sessionStorage.setItem(KEYS.REFRESH, refreshToken)
}

export const getGuestAccessToken = (): string | null =>
    isBrowser ? sessionStorage.getItem(KEYS.ACCESS) : null

export const getGuestRefreshToken = (): string | null =>
    isBrowser ? sessionStorage.getItem(KEYS.REFRESH) : null

export const setGuestInfo = (name: string, tableNumber: number) => {
    if (!isBrowser) return
    sessionStorage.setItem(KEYS.NAME, name)
    sessionStorage.setItem(KEYS.TABLE_NUMBER, String(tableNumber))
}

export const getGuestInfo = () => {
    if (!isBrowser) return null
    const name = sessionStorage.getItem(KEYS.NAME)
    const tableNumber = sessionStorage.getItem(KEYS.TABLE_NUMBER)
    if (!name || !tableNumber) return null
    return { name, tableNumber: Number(tableNumber) }
}

export const clearGuestSession = () => {
    if (!isBrowser) return
    Object.values(KEYS).forEach(k => sessionStorage.removeItem(k))
}

export const isGuestLoggedIn = (): boolean =>
    isBrowser ? Boolean(sessionStorage.getItem(KEYS.ACCESS)) : false