/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static photography is pre-optimized in /public; keep the build simple and
  // host-agnostic. Flip this off to use next/image optimization if desired.
  images: { unoptimized: true },
};

export default nextConfig;
