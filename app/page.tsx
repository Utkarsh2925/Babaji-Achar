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
    }, []);

    return <App />;
}
