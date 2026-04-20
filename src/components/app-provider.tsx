'use client'
import React, { useEffect, useState } from "react"
import { create } from 'zustand'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLS } from "@/src/lib/utils"
import { RoleType } from '../constants/role'


interface AppProvider {
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
}

export const useAppProviderStore = create<AppProvider>()((set) => ({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role: RoleType | undefined) => {
        set({ role, isAuth: Boolean(role) })
        if (!role) {
            removeTokensFromLS()
        }
    }
}))

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tab 1 -> Tab 2 => refetch API
            // false: Chuyển tab không refetch API
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        }
    }
})

function AppProvider({ children }: { children: React.ReactNode }) {

    const [role, setRole] = useState<RoleType | undefined>()

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            const decodeAccessToken = decodeToken(accessToken) as { role: RoleType }
            setRole(decodeAccessToken.role)
        }
    }, [role])

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default AppProvider;