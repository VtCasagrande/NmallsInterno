/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
}

module.exports = nextConfig 