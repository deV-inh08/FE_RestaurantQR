import { NextResponse, type NextRequest } from "next/server";
import { RoleType } from "@/src/constants/role";
import { Roles } from "@/src/constants/role";
import { decodeToken } from "./lib/utils";

const adminPaths = ['/admin']
const loginPaths = ['/login']
const privatePaths = [...adminPaths]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

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

        // 2.3 Chỉ Admin, SuperAdmin và Staff mới được vào /admin
        if (adminPaths.some((path) => pathname.startsWith(path))) {
            const allowedRoles: RoleType[] = [Roles.Admin, Roles.SuperAdmin, Roles.Staff]
            if (!allowedRoles.includes(role)) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/admin/:path*', '/login']
}