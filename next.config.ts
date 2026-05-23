import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-hackathon.codedematrixtech.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
