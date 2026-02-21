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

                {/* Layout Scripts */}
                <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
                <script src="https://cdn.tailwindcss.com" async></script>

                {/* Google Tag Manager */}
                <script dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-N9PKL2X4');`
                }} />

                {/* Fonts */}
                <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

                {/* Leaflet CSS */}
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />

                {/* Verification */}
                <meta name="google-site-verification" content="google62b583e67502d8c1" />

                {/* Splash Screen Styles */}
                <style id="splash-styles" dangerouslySetInnerHTML={{
                    __html: `
                    #splash-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #fef9f3 0%, #fef3e2 100%);
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.5s ease-out;
                    overflow: hidden;
                    }
                    .splash-emoji {
                    position: absolute;
                    font-size: 1.5rem;
                    opacity: 0.4;
                    animation: float 4s ease-in-out infinite;
                    user-select: none;
                    }
                    @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                    }
                    .splash-logo-container {
                    width: 140px;
                    height: 140px;
                    background: white;
                    border-radius: 50%;
                    border: 4px solid #ffedd5;
                    box-shadow: 0 10px 30px rgba(124, 45, 18, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    animation: popZoom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    z-index: 10;
                    }
                    .splash-logo-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    }
                    @keyframes popZoom {
                    0% { transform: scale(0); opacity: 0; }
                    70% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                    }
                    .splash-text-container {
                    text-align: center;
                    margin-top: 24px;
                    animation: fadeSlideUp 0.8s ease-out 0.3s forwards;
                    opacity: 0;
                    transform: translateY(20px);
                    z-index: 10;
                    }
                    .splash-brand {
                    font-family: 'Tiro Devanagari Hindi', serif;
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #7c2d12;
                    margin: 0;
                    line-height: 1;
                    }
                    .splash-tagline {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #d97706;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-top: 8px;
                    }
                    @keyframes fadeSlideUp {
                    to { opacity: 1; transform: translateY(0); }
                    }
                    .splash-spinner {
                    width: 36px;
                    height: 36px;
                    border: 4px solid #ffedd5;
                    border-top-color: #f97316;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-top: 40px;
                    opacity: 0;
                    animation: fadeSlideUp 0.5s ease-out 0.6s forwards, spin 1s linear infinite;
                    }
                    @keyframes spin {
                    to { transform: rotate(360deg); }
                    }
                `}} />
            </head>
            <body className="bg-stone-50 text-stone-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div id="splash-screen">
                    <div className="splash-emoji" style={{ top: '10%', left: '15%', animationDuration: '4.5s', fontSize: '2rem' }}>🌶️</div>
                    <div className="splash-emoji" style={{ top: '20%', left: '80%', animationDuration: '5s', fontSize: '1.5rem', animationDelay: '0.2s' }}>🍋</div>
                    <div className="splash-emoji" style={{ top: '40%', left: '10%', animationDuration: '4s', fontSize: '1.8rem', animationDelay: '0.5s' }}>🧄</div>
                    <div className="splash-emoji" style={{ top: '75%', left: '20%', animationDuration: '5.5s', fontSize: '1.4rem', animationDelay: '1s' }}>🥬</div>
                    <div className="splash-emoji" style={{ top: '85%', left: '85%', animationDuration: '4.2s', fontSize: '2.2rem', animationDelay: '0.3s' }}>🌿</div>
                    <div className="splash-emoji" style={{ top: '60%', left: '90%', animationDuration: '4.8s', fontSize: '1.5rem', animationDelay: '0.8s' }}>🎋</div>
                    <div className="splash-emoji" style={{ top: '15%', left: '50%', animationDuration: '5.2s', fontSize: '1.7rem', animationDelay: '0.6s' }}>🍅</div>
                    <div className="splash-emoji" style={{ top: '50%', left: '75%', animationDuration: '4.1s', fontSize: '1.9rem', animationDelay: '0.1s' }}>🧂</div>
                    <div className="splash-emoji" style={{ top: '80%', left: '50%', animationDuration: '4.7s', fontSize: '1.6rem', animationDelay: '0.9s' }}>🥜</div>
                    <div className="splash-emoji" style={{ top: '30%', left: '30%', animationDuration: '5.3s', fontSize: '1.4rem', animationDelay: '0.4s' }}>🧅</div>
                    <div className="splash-emoji" style={{ top: '65%', left: '15%', animationDuration: '4.4s', fontSize: '2.1rem', animationDelay: '0.7s' }}>🥕</div>
                    <div className="splash-emoji" style={{ top: '35%', left: '60%', animationDuration: '4.9s', fontSize: '1.8rem', animationDelay: '0.4s' }}>🥭</div>
                    <div className="splash-emoji" style={{ top: '5%', left: '90%', animationDuration: '5.1s', fontSize: '1.6rem', animationDelay: '0.2s' }}>🌶️</div>
                    <div className="splash-emoji" style={{ top: '90%', left: '10%', animationDuration: '4.3s', fontSize: '1.8rem', animationDelay: '0.5s' }}>🍅</div>

                    <div className="splash-logo-container">
                        <img src="/images/logo.jpg" alt="Logo" />
                    </div>
                    <div className="splash-text-container">
                        <h1 className="splash-brand">बाबा जी <span style={{ fontStyle: 'italic', color: '#f97316' }}>अचार</span></h1>
                        <p className="splash-tagline">100% Organic | Made in Prayagraj</p>
                    </div>
                    <div className="splash-spinner"></div>
                </div>

                {children}
                <Analytics />
            </body>
        </html>
    );
}
