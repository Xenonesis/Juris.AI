/** @type {import('next').NextConfig} */
const CSSPreloadFixPlugin = require('./lib/css-preload-fix.js');
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
    // Disable automatic static optimization for better resource control
    largePageDataBytes: 128 * 1000, // 128KB
    // Disable CSS preloading for better control
    optimizeCss: false,
    // More granular control over chunk loading
    esmExternals: true,
    scrollRestoration: true,
  },

  // Disable automatic preloading and configure CSS handling
  async rewrites() {
    return [];
  },

  // Custom resource loading strategy
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
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
          // Separate chunk for icons to prevent preload issues
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 10,
            maxSize: 64 * 1024,
          },
        },
      };

      // Prevent automatic preloading of unused chunks
      config.optimization.moduleIds = 'deterministic';
      config.optimization.runtimeChunk = {
        name: 'runtime',
      };

      // Configure CSS chunk loading to prevent preload warnings
      if (config.plugins) {
        config.plugins.forEach(plugin => {
          if (plugin.constructor.name === 'MiniCssExtractPlugin') {
            plugin.options.linkType = false; // Disable preload links for CSS
          }
        });
      }

      // Disable automatic CSS preloading
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add custom CSS loading logic
        for (const key in entries) {
          if (Array.isArray(entries[key])) {
            entries[key] = entries[key].filter(entry => 
              !entry.includes('_next/static/css/') || 
              entry.includes('globals.css')
            );
          }
        }
        
        return entries;
      };

      // Add CSS preload fix plugin
      config.plugins.push(new CSSPreloadFixPlugin());
    }

    return config;
  },

  compress: true,

  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    const devHeaders = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live https://*.vercel.app",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://api.mistral.ai https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://*.case.law https://llm.chutes.ai https://vercel.live https://*.vercel.app",
              "frame-src 'self' https://www.google.com https://google.com https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
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
        ],
      },
    ];

    const prodHeaders = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live https://*.vercel.app",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://api.mistral.ai https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://*.case.law https://llm.chutes.ai https://vercel.live https://*.vercel.app",
              "frame-src 'self' https://www.google.com https://google.com https://vercel.live",
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
    ];

    return [
      ...(isDev ? devHeaders : prodHeaders),
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
