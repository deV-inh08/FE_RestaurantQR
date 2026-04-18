"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login - replace with actual auth
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Food Image */}
      <div 
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden bg-card"
        style={{
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 800%22><rect fill=%22%23221F1A%22 width=%22600%22 height=%22800%22/></svg>')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-60" />
        
        {/* Bottom Overlay Text */}
        <div className="absolute bottom-8 left-0 right-0 z-10 px-8">
          <p className="text-2xl italic text-foreground mb-2">
            Taste the Tradition
          </p>
          <p className="text-sm text-muted-foreground">
            Experience authentic Vietnamese flavors at Viet Gold
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">VG</span>
            </div>
            <span className="text-lg font-bold uppercase tracking-wide text-foreground">
              Viet Gold
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide text-foreground">
            Welcome Back
          </h1>
          
          {/* Subtitle */}
          <p className="mb-8 text-sm text-muted-foreground">
            Sign in to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vietgold.com"
                required
                className="w-full rounded-md border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-md border border-input-border bg-input px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 border-t border-border-subtle" />

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © 2024 Viet Gold
          </p>
        </div>
      </div>
    </div>
  )
}
