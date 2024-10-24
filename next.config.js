/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: "/",
          destination: "/tictactoe",
          permanent: true,
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  