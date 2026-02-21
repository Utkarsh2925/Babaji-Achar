/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Output as a pure static SPA
    output: 'export',
    images: {
        unoptimized: true
    },
    trailingSlash: true,
};

export default nextConfig;
