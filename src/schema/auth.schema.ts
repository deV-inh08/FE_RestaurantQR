import z from 'zod'
import { RoleValues } from '../constants/role'

export const LoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'minmaxPassword').max(100, 'minmaxPassword')
})

// type LoginBody
export type LoginBodyType = z.TypeOf<typeof LoginBodySchema>

// Response Login
export const LoginResponse = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        account: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.enum(RoleValues),
            avatar: z.string().nullable()
        })
    }),
    message: z.string()
})
// type Login Response
export type LoginResponseType = z.TypeOf<typeof LoginResponse>

// Refresh Token
export const RefreshTokenBody = z
    .object({
        refreshToken: z.string()
    })
    .strict()

// RefreshToken type
export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string()
    }),
    message: z.string()
})
export type RefreshTokenResponseType = z.TypeOf<typeof RefreshTokenRes>

// Logout
export const LogoutBody = z
    .object({
        refreshToken: z.string()
    })
    .strict()

// Logout Type
export type LogoutBodyType = z.TypeOf<typeof LogoutBody>