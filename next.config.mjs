/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Output as a pure static SPA - exactly like Vite but with Next.js SEO power.
    // This fully bypasses SSR so we avoid all window/document build-time errors
    // from Three.js, GSAP, Leaflet, Firebase Auth etc.
    output: 'export',
    // Required for static export: disable image optimization (incompatible with static)
    images: {
        unoptimized: true
    },
    // Trailing slash for compatibility with static hosting
    trailingSlash: true,
};

export default nextConfig;
