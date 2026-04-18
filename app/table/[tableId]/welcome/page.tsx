"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function GuestLoginPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.tableId as string
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setIsLoading(true)
    // Store guest name in sessionStorage for the session
    sessionStorage.setItem("guestName", name.trim())
    // Redirect to menu
    router.push(`/table/${tableId}`)
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-background"
      style={{
        backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 800%22><rect fill=%22%231A1714%22 width=%221200%22 height=%22800%22/></svg>')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-background/75" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-lg border border-gold-border bg-surface px-8 py-12 shadow-card">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">VG</span>
            </div>
            <span className="text-lg font-bold uppercase tracking-wide text-foreground">
              Viet Gold
            </span>
          </div>

          {/* Table Number */}
          <h1 className="mb-2 text-center text-3xl font-bold uppercase tracking-wide text-primary">
            Table {tableId}
          </h1>

          {/* Heading */}
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-foreground">
            Welcome to Viet Gold
          </h2>

          {/* Subtitle */}
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Enter your name to begin
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-md border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              autoFocus
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Start Ordering"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2024 Viet Gold
          </p>
        </div>
      </div>
    </div>
  )
}
