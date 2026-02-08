import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { safeExecute } from './guards';

if (typeof window !== 'undefined') {
    safeExecute(() => gsap.registerPlugin(ScrollTrigger));
}

export const animateHome = () => {
    safeExecute(() => {
        // 1. Hero Text Reveal (Slide Up)
        const heroTexts = document.querySelectorAll('.hero-text, h1, h2');
        if (heroTexts.length > 0) {
            gsap.fromTo(heroTexts,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
            );
        }

        // 2. Search Bar Glow
        const searchBar = document.querySelector('input[type="text"]');
        if (searchBar) {
            gsap.fromTo(searchBar,
                { scale: 0.98 },
                { scale: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.5 }
            );
        }

        // 3. Product Cards (Scroll Trigger)
        const cards = document.querySelectorAll('.product-card');
        if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
                start: 'top 85%',
                onEnter: batch => gsap.to(batch, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.12,
                    duration: 0.6,
                    ease: 'power2.out',
                    overwrite: true
                }),
                once: true
            });
            gsap.set(cards, { y: 40, opacity: 0 });
        }

        // 4. Offer Strip Shimmer
        const offerStrip = document.querySelector('.offer-strip, .bg-amber-600');
        if (offerStrip) {
            gsap.fromTo(offerStrip,
                { backgroundPosition: '200% 0' },
                { backgroundPosition: '-200% 0', duration: 2, ease: 'linear', repeat: 1, yoyo: true }
            );
        }
    });
};
