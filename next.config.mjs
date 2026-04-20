/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "vietgold.vn"],
  },
}

export default nextConfig
