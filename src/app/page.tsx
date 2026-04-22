'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGetDishes } from "../queries/useDish"
import Image from "next/image"
import envConfig from "../config"
import { handleImageURL } from "../lib/utils"


export default function HomePage() {
  const router = useRouter()
  const { data, isLoading } = useGetDishes()
  const featuredDishes = (data?.payload.data.data ?? [])
    .filter((d) => d.status === "Available")
    .slice(0, 3)

  console.log('featuredDishes_______________________________', featuredDishes)
  return (
    <div style={{ backgroundColor: "#0D0B08", color: "#F5F0E8" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#0D0B08",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "14px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "#FFC000",
                color: "#000000",
                width: "34px",
                height: "34px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "14px",
              }}
            >
              VG
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                color: "#F5F0E8",
              }}
            >
              VIET GOLD
            </span>
          </div>

          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/login"
              style={{
                fontSize: "13px",
                color: "#8A7F72",
                letterSpacing: "0.06em",
                textDecoration: "none",
              }}
            >
              ADMIN LOGIN
            </Link>
            <button
              onClick={() => router.push("/tables/1")}
              style={{
                backgroundColor: "#FFC000",
                color: "#000000",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                padding: "9px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              SCAN QR
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#0D0B08",
        }}
      >
        {/* Right Side - Hero Image with Mask */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "55%",
            backgroundImage: `url(https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, black 65%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, black 65%)",
          }}
        />

        {/* Left Side - Content */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            paddingLeft: "56px",
            maxWidth: "500px",
            display: "flex",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div>
            {/* Label */}
            <div
              style={{
                color: "#FFC000",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.2em",
                marginBottom: "14px",
              }}
            >
              AUTHENTIC VIETNAMESE CUISINE
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: "68px",
                fontWeight: "800",
                lineHeight: "0.92",
                letterSpacing: "-0.02em",
                color: "#F5F0E8",
                margin: "0 0 18px 0",
              }}
            >
              VIET GOLD
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: "15px",
                color: "#8A7F72",
                lineHeight: "1.6",
                maxWidth: "340px",
                margin: "0 0 32px 0",
              }}
            >
              Experience the finest Vietnamese flavors, crafted with tradition and passion.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => router.push("/login")}
                style={{
                  backgroundColor: "#FFC000",
                  color: "#000000",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.06em",
                  padding: "12px 22px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                EXPLORE MENU →
              </button>
              <button
                onClick={() => router.push("/reservation_public")}
                style={{
                  backgroundColor: "transparent",
                  color: "#F5F0E8",
                  fontSize: "13px",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                  padding: "12px 22px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  cursor: "pointer",
                }}
              >
                BOOK A TABLE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div
        style={{
          backgroundColor: "#110F0C",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "center",
          gap: "48px",
        }}
      >
        {[
          { value: "50+", label: "DISHES" },
          { value: "15", label: "TABLES" },
          { value: "4.9★", label: "RATING" },
          { value: "8yr", label: "SERVING" },
        ].map((stat, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: idx < 3 ? "48px" : "0" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#FFC000",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#8A7F72",
                  letterSpacing: "0.12em",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
            {idx < 3 && (
              <div
                style={{
                  width: "1px",
                  height: "30px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Featured Dishes Section */}
      <section style={{ padding: "36px 40px" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              color: "#F5F0E8",
              margin: 0,
            }}
          >
            FEATURED DISHES
          </h2>
          <Link
            href="/login"
            style={{
              fontSize: "11px",
              color: "#FFC000",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            VIEW ALL MENU →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          {featuredDishes.map((dish, idx) => (
            <div
              key={dish.id}
              style={{
                backgroundColor: "#1A1714",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 192, 0, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
              }}
            >
              {/* Image */}

              <div
                style={{
                  height: "150px",
                  backgroundImage: `url(http://localhost:3002/${dish.imagePath})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Card Body */}
              <div style={{ padding: "14px 16px" }}>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                    color: "#F5F0E8",
                    margin: "0 0 6px 0",
                  }}
                >
                  {dish.name}
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#8A7F72",
                    lineHeight: "1.4",
                    margin: "0 0 10px 0",
                  }}
                >
                  Vietnamese specialty with authentic flavors
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#FFC000" }}>
                    ₫{dish.price.toLocaleString()}
                  </span>
                  {idx === 0 && (
                    <span
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.12)",
                        color: "#22c55e",
                        borderRadius: "999px",
                        fontSize: "10px",
                        padding: "3px 9px",
                      }}
                    >
                      POPULAR
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Viet Gold Section */}
      <section
        style={{
          backgroundColor: "#110F0C",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "32px 40px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            color: "#F5F0E8",
            margin: "0 0 16px 0",
          }}
        >
          WHY VIET GOLD
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {[
            { label: "Fresh Daily", text: "Ingredients sourced fresh every morning" },
            { label: "QR Ordering", text: "Scan, order and pay from your table" },
            { label: "Family Recipes", text: "Authentic recipes passed down through generations" },
            { label: "Fast Service", text: "Real-time kitchen updates, minimal wait times" },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#1A1714",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#FFC000",
                  marginBottom: "8px",
                }}
              >
                ★
              </div>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                  color: "#F5F0E8",
                  margin: "0 0 4px 0",
                }}
              >
                {feature.label}
              </h3>
              <p
                style={{
                  fontSize: "11px",
                  color: "#8A7F72",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left - Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              backgroundColor: "#FFC000",
              color: "#000000",
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "700",
            }}
          >
            VG
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              color: "#F5F0E8",
            }}
          >
            VIET GOLD
          </span>
        </div>

        {/* Center - Copyright */}
        <p
          style={{
            fontSize: "11px",
            color: "#8A7F72",
            margin: 0,
          }}
        >
          © 2024 Viet Gold Restaurant
        </p>

        {/* Right - Links */}
        <div style={{ display: "flex", gap: "20px" }}>
          {["MENU", "PRIVACY", "CONTACT"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: "11px",
                color: "#8A7F72",
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}


