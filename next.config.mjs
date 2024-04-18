/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/v1/:path*',
          destination: `https://noorwave-ex.com//api/v1/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

//
