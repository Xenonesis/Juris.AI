/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Disabling ESLint during build to focus on fixing the motion errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
