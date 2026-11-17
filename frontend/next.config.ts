import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow viewing the dev server from devices on the local network (e.g. an iPhone).
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*", "10.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
