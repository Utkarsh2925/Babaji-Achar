import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Babaji Achar - Official Website | 100% Organic Traditional Indian Pickles',
    description: 'Official website of Babaji Achar by Bhojnamrit Foods. Authentic homemade Indian pickles made with traditional recipes. 100% organic, natural, and preservative-free. Order online from Prayagraj.',
    keywords: 'Babaji Achar official website, Bhojnamrit Foods, organic pickles India, natural achar, traditional Indian pickles, handmade pickles Prayagraj, chemical free achar, authentic Indian pickles',
    openGraph: {
        type: 'website',
        url: 'https://babaji-achar.vercel.app/',
        title: 'Babaji Achar - Official Website | 100% Organic Traditional Pickles',
        description: 'Official website of Babaji Achar. Authentic, handmade, and 100% organic pickles from Prayagraj. Heritage recipes by Bhojnamrit Foods.',
        images: [{ url: 'https://babaji-achar.vercel.app/images/hero_update.png' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Babaji Achar - Official Website | Organic Indian Pickles',
        description: 'Official website. Handmade with love in Prayagraj. No chemicals, just heritage recipes by Bhojnamrit Foods.',
        images: ['https://babaji-achar.vercel.app/images/hero_update.png']
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="hi">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://wa.me" />
                <link rel="dns-prefetch" href="https://esm.sh" />

                {/* Razorpay Setup */}
                <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

                {/* Tailwind CDN (Temporary for migration safety) */}
                <script src="https://cdn.tailwindcss.com" async></script>

                {/* Fonts */}
                <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

                {/* Leaflet CSS */}
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />

                {/* Verification */}
                <meta name="google-site-verification" content="google62b583e67502d8c1" />
            </head>
            <body className="bg-stone-50 text-stone-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
