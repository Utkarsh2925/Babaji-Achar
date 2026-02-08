import gsap from 'gsap';
import { safeExecute } from './guards';

export const animateProduct = () => {
    safeExecute(() => {
        // 1. Image Zoom/Fade
        const img = document.querySelector('.product-detail-img');
        if (img) {
            gsap.fromTo(img,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
        }

        // 2. Ingredients Reveal
        const ingredients = document.querySelectorAll('.ingredient-item');
        if (ingredients.length > 0) {
            gsap.fromTo(ingredients,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power1.out', delay: 0.3 }
            );
        }

        // 3. Add to Cart Button Feedback
        const btn = document.querySelector('.add-to-cart-btn, button');
        if (btn) {
            btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.95, duration: 0.1 }));
            btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1, duration: 0.1 }));
        }
    });
};
