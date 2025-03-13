import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aqua-nearby-earwig-269.mypinata.cloud',
        port: ''
      }
    ]
  }
};

export default nextConfig;
