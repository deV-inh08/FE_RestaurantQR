"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { NotificationBell } from "./NotificationBellAdmin"
import { useGetMe } from "@/src/queries/useAccount"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/src/hooks/useDebounce"

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

// helper function to get initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')
  const debouncedSearch = useDebounce(searchValue, 400)
  const isFirstRender = useRef(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Bỏ qua lần đầu render để không push URL khi chưa type gì
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedSearch])


  // Reset khi navigate sang trang khác
  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '')
  }, [pathname])


  const { data: meData } = useGetMe()
  const me = meData?.payload.data
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-background px-6">
      <div>
        <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10 w-64 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
          />
        </div> */}

        {/* Notifications */}
        <NotificationBell />

        {/* Admin Avatar */}
        <div className="flex items-center gap-3 border-l border-border-subtle pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">
              {me?.name ? getInitials(me.name) : "AD"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {me?.name ?? "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">
              {me?.email ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
