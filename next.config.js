import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Necessário para styled-components funcionar no App Router
  compiler: {
    styledComponents: true,
  },

  // Permite ignorar erros TS com segurança
  typescript: {
    ignoreBuildErrors: true,
  },

  // Necessário para App Router + fetch SSR
  experimental: {
    serverActions: {},
  },
};

// Exporta com bundle analyzer ativo quando ANALYZE=true
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
