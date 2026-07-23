/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  turbopack: {},
  experimental: {
    optimizePackageImports: [
      "firebase",
      "@headlessui/react",
      "@heroicons/react/24/outline",
      "@heroicons/react/24/solid",
      "@heroicons/react/20/solid",
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    qualities: [75, 80],
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woodleyjewelers.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/shop-all", permanent: true },
      { source: "/appointments", destination: "/contact", permanent: true },
      { source: "/work", destination: "/", permanent: true },
      // Legacy flat diamond shape URLs → diamonds hub (choose natural or lab-grown)
      { source: "/diamonds/round", destination: "/diamonds", permanent: true },
      { source: "/diamonds/oval", destination: "/diamonds", permanent: true },
      { source: "/diamonds/emerald", destination: "/diamonds", permanent: true },
      { source: "/diamonds/pear", destination: "/diamonds", permanent: true },
      { source: "/diamonds/cushion", destination: "/diamonds", permanent: true },
      { source: "/diamonds/princess", destination: "/diamonds", permanent: true },
      { source: "/diamonds/radiant", destination: "/diamonds", permanent: true },
      { source: "/diamonds/marquise", destination: "/diamonds", permanent: true },
      { source: "/diamonds/heart", destination: "/diamonds", permanent: true },
      // Nested metal/shape routes → query-param filters on the parent page
      {
        source: "/fine-jewelry/rings/:metal",
        destination: "/fine-jewelry/rings?metal=:metal",
        permanent: true,
      },
      {
        source: "/fine-jewelry/necklaces/:metal",
        destination: "/fine-jewelry/necklaces?metal=:metal",
        permanent: true,
      },
      {
        source: "/fine-jewelry/earrings/:metal",
        destination: "/fine-jewelry/earrings?metal=:metal",
        permanent: true,
      },
      {
        source: "/fine-jewelry/bracelets/:metal",
        destination: "/fine-jewelry/bracelets?metal=:metal",
        permanent: true,
      },
      {
        source: "/engagement-wedding/wedding-bands/:metal",
        destination: "/engagement-wedding/wedding-bands?metal=:metal",
        permanent: true,
      },
      {
        source: "/engagement-wedding/:metal(yellow-gold|white-gold|rose-gold|platinum)",
        destination: "/women/engagement-rings?metal=:metal",
        permanent: true,
      },
      {
        source: "/diamonds/natural-diamonds/:shape",
        destination: "/diamonds/natural-diamonds?shape=:shape",
        permanent: true,
      },
      {
        source: "/diamonds/lab-grown-diamonds/:shape",
        destination: "/diamonds/lab-grown-diamonds?shape=:shape",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
