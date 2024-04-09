/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

//
