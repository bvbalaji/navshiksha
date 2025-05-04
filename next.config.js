const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Updated: moved from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ["nock", "canvas", "sqlite3", "sharp", "@prisma/client", ".prisma/client"],
  webpack: (config, { isServer, dev }) => {
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Add proper crypto polyfills
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
      // Replace punycode with our polyfill
      punycode: path.resolve(__dirname, "lib/polyfills/punycode-polyfill.js"),
      "mock-aws-s3": false,
      "aws-sdk": false,
      nock: false,
      fs: false,
      path: false,
      os: false,
      http: false,
      https: false,
      zlib: false,
    }

    // Add resolver for jose webcrypto.js
    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolve the missing isCryptoKey export
      "jose/dist/browser/runtime/webcrypto.js": path.resolve(__dirname, "lib/polyfills/webcrypto-polyfill.js"),
      // Add alias for punycode
      punycode: path.resolve(__dirname, "lib/polyfills/punycode-polyfill.js"),
    }

    // Exclude problematic packages from client bundles
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          canvas: "commonjs canvas",
          sqlite3: "commonjs sqlite3",
          sharp: "commonjs sharp",
          "@prisma/client": "commonjs @prisma/client",
          ".prisma/client": "commonjs .prisma/client",
        },
      ]

      // Only add HtmlWebpackPlugin in non-server builds and when not in development
      // This is to avoid conflicts with Next.js's built-in HTML generation
      if (!dev) {
        config.plugins.push(
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/template.html"),
            filename: "index.html",
            inject: true,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
        )
      }
    }

    // Add specific rule to ignore HTML files in node_modules
    config.module.rules.push({
      test: /\.html$/,
      include: /node_modules/,
      type: "javascript/auto",
    })

    // Explicitly ignore the problematic file
    config.module.rules.push({
      test: /node-pre-gyp[\\/]lib[\\/]util[\\/]nw-pre-gyp[\\/]index\.html$/,
      use: "null-loader",
      type: "javascript/auto",
    })

    // Add rule to handle Prisma in client bundles
    if (!isServer) {
      config.module.rules.push({
        test: /\.prisma\/client/,
        use: "null-loader",
      })

      config.module.rules.push({
        test: /@prisma\/client/,
        use: "null-loader",
      })
    }

    return config
  },
}

module.exports = nextConfig
