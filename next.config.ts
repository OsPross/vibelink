import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - Ignorujemy błąd typowania, bo ta opcja jest wymagana przez Next.js przy dostępie z IP
    allowedDevOrigins: ["192.168.50.100:3000", "localhost:3000"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;