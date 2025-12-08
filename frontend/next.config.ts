// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['isitmondaytoday2.com'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'isitmondaytoday2.com',
//         pathname: '/storage/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'encrypted-tbn0.gstatic.com',
//       },
//     ],
//   },
// };

// export default nextConfig;




import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'isitmondaytoday2.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'isitmondaytoday2.com',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
  },
};

export default nextConfig;

