const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://blog-sphere-backend-ruby.vercel.app/api/v1/:path*",
      },
      {
        source: "/api-docs",
        destination: "https://blog-sphere-backend-ruby.vercel.app/api-docs",
      },
    ];
  },
};

export default nextConfig;
