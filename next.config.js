/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Allow Three.js to work without SSR issues
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
}

module.exports = nextConfig
