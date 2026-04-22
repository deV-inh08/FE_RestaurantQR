"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { NotificationBell } from "./NotificationBellAdmin"

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-md border border-input-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Admin Avatar */}
        <div className="flex items-center gap-3 border-l border-border-subtle pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@vietgold.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
