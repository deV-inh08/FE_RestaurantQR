import {
    getClientCookie,
    removeTokensFromLS, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage
} from '../lib/utils'



const isClient = typeof window !== 'undefined'

let clientLogoutRequest: null | Promise<void> = null

export async function handleUnauthorized(accessToken: string | null): Promise<void> {
    if (!isClient) return

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