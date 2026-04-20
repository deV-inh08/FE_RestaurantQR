import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UseFormSetError } from 'react-hook-form'
import { EntityError } from "../lib/http"
import { toast } from "sonner"
import jwt, { JwtPayload } from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export function getClientCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const

export function setAccessTokenToLocalStorage(token: string): void {
  localStorage.setItem(TOKEN_KEYS.ACCESS, token)
}

export function setRefreshTokenToLocalStorage(token: string): void {
  localStorage.setItem(TOKEN_KEYS.REFRESH, token)
}
const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('accessToken') : null

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('refreshToken') : null

export function removeTokensFromLS(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS)
  localStorage.removeItem(TOKEN_KEYS.REFRESH)
}

export const decodeToken = (token: string): JwtPayload | string | null => {
  return jwt.decode(token)
}


export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}


export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast(error?.payload?.message ?? 'Lỗi không xác định', {
      duration: duration ?? 5000
    })
  }
}