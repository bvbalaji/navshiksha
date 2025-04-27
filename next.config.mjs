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
  },
  webpack: (config, { isServer }) => {
    // Add fallback for the deprecated punycode module using ES modules syntax
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false, // This tells webpack to use the browser's version or the npm package
    };
    
    return config;
  },
}

export default nextConfig;
