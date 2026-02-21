/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // We removed static export so Vercel's native zero-config deployment builds perfectly.
    trailingSlash: true,
};

export default nextConfig;
