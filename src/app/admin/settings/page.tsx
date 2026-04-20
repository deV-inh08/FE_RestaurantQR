"use client"

import { useState } from "react"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { Button } from "@/src/components/ui/button"
import { Eye, EyeOff, Camera } from "lucide-react"

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@vietgold.com",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Settings"
        subtitle="Update profile and preferences"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile Card */}
          <div className="rounded-md border border-border-subtle bg-card p-6 shadow-card">
            <h2 className="mb-6 text-lg font-bold uppercase tracking-wide text-foreground">
              Profile
            </h2>

            {/* Avatar Section */}
            <div className="mb-6 flex justify-center">
              <div
                className="relative h-[120px] w-[120px] cursor-pointer rounded-md"
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
              >
                <div className="h-full w-full rounded-md bg-primary">
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary-foreground">
                    AU
                  </div>
                </div>
                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-md bg-black/70 transition-opacity ${isHoveringAvatar ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <Camera className="mb-1 h-6 w-6 text-white" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white">
                    Change Photo
                  </span>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full rounded-md border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input (Read-only) */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full rounded-md border border-input-border bg-input px-4 py-3 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            <Button className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold">
              Save Changes
            </Button>
          </div>

          {/* Security Card */}
          <div className="rounded-md border border-border-subtle bg-card p-6 shadow-card">
            <h2 className="mb-6 text-lg font-bold uppercase tracking-wide text-foreground">
              Security
            </h2>

            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Change Password
            </h3>

            {/* Current Password */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  className="w-full rounded-md border border-input-border bg-input px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  className="w-full rounded-md border border-input-border bg-input px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="w-full rounded-md border border-input-border bg-input px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-none"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Update Password Button */}
            <Button className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:shadow-gold">
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
