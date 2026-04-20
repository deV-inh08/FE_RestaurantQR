import { NextResponse, type NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { RoleType } from "@/src/constants/role";
import { Roles } from "@/src/constants/role";
import { decodeToken } from "./lib/utils";

// Định nghĩa các nhóm route
const adminPaths = ['/admin']
const loginPaths = ['/login']
const privatePaths = [...adminPaths]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Đọc token từ cookie (được set bởi Next.js route handler khi login)
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    console.log(`accessToken____________________________: ${accessToken}`)
    console.log(`refreshToken____________________________: ${refreshToken}`)
    /**
     * 1. Chưa đăng nhập mà vào private route → redirect về /login
     */
    if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('clearTokens', 'true')
        return NextResponse.redirect(url)
    }

    /**
     * 2. Đã đăng nhập (có refreshToken)
     */
    if (accessToken && refreshToken) {
        // Decode để lấy role
        const decoded = decodeToken(accessToken) as { role: RoleType }
        const role = decoded?.role
        // 2.1 Đã login rồi thì không cho vào trang login nữa
        if (loginPaths.some((path) => pathname.startsWith(path)) && accessToken) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        // 2.2 Đã login nhưng accessToken hết hạn → refresh
        if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        // 2.3 Chỉ Admin/SuperAdmin mới được vào /admin
        if (adminPaths.some((path) => pathname.startsWith(path))) {
            if (role !== Roles.Admin && role !== Roles.SuperAdmin) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        return NextResponse.next()
    }
}

// Chỉ chạy middleware cho các path cần bảo vệ
export const config = {
    matcher: ['/admin/:path*', '/login']
}
