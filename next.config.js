/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Tree shaking voor lodash-achtige libs
    config.optimization = {
      ...config.optimization,
      sideEffects: false,
      minimize: true,
    };
    
    return config;
  },
};

module.exports = nextConfig;
