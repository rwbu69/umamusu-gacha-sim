/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable experimental features for better performance
    optimizePackageImports: ['react', 'react-dom'],
  },
  // Optimize images and static assets
  images: {
    domains: [],
    unoptimized: false,
  },
  // Enable compression
  compress: true,
  // Optimize for static export if needed
  trailingSlash: false,
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
