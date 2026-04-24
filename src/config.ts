import { z } from 'zod'

// type schema '.env'
const configSchema = z.object({
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_API_IDENTITY: z.string(),
    NEXT_PUBLIC_API_MENU: z.string(),
    NEXT_PUBLIC_API_ORDER: z.string(),
    NEXT_PUBLIC_API_RESERVATION: z.string(),
    NEXT_PUBLIC_SIGNALR_ORDER: z.string()
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_IDENTITY: process.env.NEXT_PUBLIC_API_IDENTITY,
    NEXT_PUBLIC_API_MENU: process.env.NEXT_PUBLIC_API_MENU,
    NEXT_PUBLIC_API_ORDER: process.env.NEXT_PUBLIC_API_ORDER,
    NEXT_PUBLIC_API_RESERVATION: process.env.NEXT_PUBLIC_API_RESERVATION,
    NEXT_PUBLIC_SIGNALR_ORDER: process.env.NEXT_PUBLIC_SIGNALR_ORDER
});

if (!configProject.success) {
    console.log(configProject.error)
    throw new Error('Các biến môi trường không hợp lệ')
}
const envConfig = configProject.data

export type Locale = (typeof locales)[number]

export const locales = ['en', 'vi'] as const
export const defaultLocale: Locale = 'en'

export default envConfig
export const PAGE_SIZE = 10