/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed deprecated appDir from experimental (Next.js 14+ has app directory by default)
  experimental: {
    // appDir: true // Removed - deprecated in Next.js 14+
  },
  trailingSlash: false,
}

module.exports = nextConfig

