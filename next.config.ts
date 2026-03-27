import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 确保静态文件正确提供
  async headers() {
    return [
      {
        source: '/tfjs/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
