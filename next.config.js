/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    patterns: [
      {
        host:'eacaypmoazorrzvhgajm.supabase.co'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
