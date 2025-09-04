/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Fix workspace root warning
  outputFileTracingRoot: __dirname,

  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],

  // Vercel optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    config.module.parser = config.module.parser || {};
    config.module.parser.javascript = config.module.parser.javascript || {};
    config.module.parser.javascript.maxSize = 512 * 1024;

    // Optimize cache strategy to reduce serialization of large strings
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.buildDependencies = config.cache.buildDependencies || {};
      config.cache.buildDependencies.config = [__filename];
      config.cache.maxMemoryGenerations = 1;
    }

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /Serializing big strings/,
    ];

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            maxSize: 128 * 1024,
          },
        },
      };
    }

    return config;
  },

  compress: true,

  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://api.mistral.ai https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://*.case.law",
              "frame-src 'self' https://www.google.com https://google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
