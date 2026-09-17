import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  images: { remotePatterns: [{ protocol: "https", hostname: "*.blob.vercel-storage.com" }] },
};

export default nextConfig;
