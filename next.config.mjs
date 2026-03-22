import withPWA from 'next-pwa'

const pwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-pwa options embedded in manifest.json
}

export default pwa(nextConfig)
