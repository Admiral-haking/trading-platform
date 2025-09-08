/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  // Only push to build/.next in production builds to avoid dev watcher loops
  ...(isProd ? { distDir: '../build/.next' } : {}),
};

module.exports = nextConfig;
