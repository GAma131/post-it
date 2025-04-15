/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Habilita las características experimentales que necesites
    serverComponentsExternalPackages: ["mongoose"],
  },
  // Ajusta las políticas de seguridad según sea necesario
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
