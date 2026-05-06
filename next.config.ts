import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.56"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbohowilkhagxaolniob.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
