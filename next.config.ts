import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fee notes contain client-identifying matter data; keep response headers strict.
  poweredByHeader: false,
};

export default nextConfig;
