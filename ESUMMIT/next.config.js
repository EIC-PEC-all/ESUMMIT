/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // Allow Three.js to work without SSR issues
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
}

module.exports = nextConfig
