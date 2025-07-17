/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle canvas dependency for pdf-parse
      config.resolve.alias.canvas = false;
      
      // Exclude test files and problematic imports
      config.module.rules.push({
        test: /\.pdf$/,
        type: 'asset/resource',
      });
    }
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js']
  }
}

module.exports = nextConfig