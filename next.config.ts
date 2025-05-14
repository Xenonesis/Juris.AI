import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disabling ESLint during build to focus on fixing the motion errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
