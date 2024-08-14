/ @type {import('next').NextConfig} /
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.anilist.co', 'api.myanimelist.net', 'api.jikan.moe', 'media.discordapp.net'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;