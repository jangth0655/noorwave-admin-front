/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: `http://192.168.1.102:8200/api/v1/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

//
