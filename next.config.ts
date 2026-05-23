import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/warranty",
  assetPrefix: "/warranty",
  images: {
    path: "/warranty/_next/image",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "private.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
