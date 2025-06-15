import { nodePolyfills } from 'vite-plugin-node-polyfills';

/** @type {import('next').NextConfig} */
const nextConfig = {
      plugins: [nodePolyfills(),],
};

export default nextConfig;
