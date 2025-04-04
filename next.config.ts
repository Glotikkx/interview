import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

module.exports = {
  webpack: (config: { resolve: { fallback: unknown; }; }) => {
    config.resolve.fallback = {
      ...(typeof config.resolve.fallback === 'object' && config.resolve.fallback !== null ? config.resolve.fallback : {}),
      fs: false,
    };
    return config;
  },
};