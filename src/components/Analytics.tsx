import { useEffect } from 'react';
import { ANALYTICS_CONFIG } from '../analyticsConfig';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        clarity: any;
    }
}

const Analytics = () => {
    useEffect(() => {
        // 1. Google Analytics 4
        if (ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}`;
            script.async = true;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID);
        }

        // 2. Google Tag Manager
        if (ANALYTICS_CONFIG.GTM_CONTAINER_ID) {
            (function (w: Window, d: Document, s: string, l: string, i: string) {
                (w as any)[l] = (w as any)[l] || [];
                (w as any)[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                const f = d.getElementsByTagName(s)[0];
                const j = d.createElement(s) as HTMLScriptElement;
                const dl = l !== 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode?.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', ANALYTICS_CONFIG.GTM_CONTAINER_ID);
        }

        // 3. Microsoft Clarity
        if (ANALYTICS_CONFIG.CLARITY_PROJECT_ID) {
            (function (c: any, l: Document, a: string, r: string, i: string) {
                c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args) };
                const t = l.createElement(r) as HTMLScriptElement;
                t.async = true;
                t.src = "https://www.clarity.ms/tag/" + i;
                const y = l.getElementsByTagName(r)[0];
                y.parentNode?.insertBefore(t, y);
            })(window as any, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_PROJECT_ID);
        }

        // 4. Google Verification Meta Tag
        if (ANALYTICS_CONFIG.GOOGLE_VERIFICATION_CONTENT) {
            const meta = document.createElement('meta');
            meta.name = "google-site-verification";
            meta.content = ANALYTICS_CONFIG.GOOGLE_VERIFICATION_CONTENT;
            document.head.appendChild(meta);
        }

    }, []);

    return null; // This component does not render anything visual
};

export default Analytics;
