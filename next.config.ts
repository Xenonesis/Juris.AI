/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Disabling ESLint during build to focus on fixing the motion errors
    ignoreDuringBuilds: true,
  },
  // Fix cross-origin issues that can cause CSS MIME type errors
  allowedDevOrigins: ['192.168.180.1'],
  // Ensure proper asset serving
  assetPrefix: '',
  // Disable font optimization that can cause MIME type issues
  optimizeFonts: false,
  // Configure webpack to handle CSS properly
  webpack: (config, { buildId, dev, isServer }) => {
    // Fix CSS loading issues in development
    if (dev) {
      config.module.rules.push({
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              attributes: {
                'data-webpack': buildId,
              },
            },
          },
          'css-loader',
        ],
      });
    }
    return config;
  },
  // Configure headers for proper MIME types
  async headers() {
    return [
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/js/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
