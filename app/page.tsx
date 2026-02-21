'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import dynamicImport from 'next/dynamic';
import '../src/index.css';

// Crucial: Load the massive Vite application completely client-side
// This prevents Next.js from throwing 'window is not defined' errors
const App = dynamicImport(() => import('../src/App'), {
    ssr: false,
});

export default function Page() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .catch(registrationError => {
                        console.log('Kill Switch SW registration failed: ', registrationError);
                    });
            });
        }

        // Gracefully remove the instant splash screen once React is mounted
        const timer1 = setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.style.opacity = '0';

                // Wait for CSS opacity transition to finish before removing DOM node
                setTimeout(() => {
                    splash.remove();
                    const splashStyles = document.getElementById('splash-styles');
                    if (splashStyles) splashStyles.remove();
                }, 500);
            }
        }, 300);

        return () => clearTimeout(timer1);
    }, []);

    return <App />;
}
