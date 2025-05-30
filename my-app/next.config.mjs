/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INVENTORY_SERVICE_URL:
      process.env.INVENTORY_SERVICE_URL || "http://localhost:3001",
    CUSTOMER_SERVICE_URL:
      process.env.CUSTOMER_SERVICE_URL || "http://localhost:3002",
  },
};

export default nextConfig;
