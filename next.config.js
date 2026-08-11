const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // Allow Three.js to work without SSR issues
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
}

module.exports = withPWA(nextConfig)
