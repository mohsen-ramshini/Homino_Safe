/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  // ...existing config options...
};

module.exports = nextConfig;