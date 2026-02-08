import gsap from 'gsap';
import { safeExecute } from './guards';

export const animateCheckout = () => {
    safeExecute(() => {
        // 1. Micro-interactions for Inputs (Border Glow)
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, { borderColor: '#ea580c', duration: 0.3 }); // Orange glow
            });
            input.addEventListener('blur', () => {
                gsap.to(input, { borderColor: '#e5e7eb', duration: 0.3 }); // Back to gray (adjust color as needed)
            });
        });

        // 2. Pay Buttons Hover
        const payBtns = document.querySelectorAll('.pay-btn');
        payBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => gsap.to(btn, { opacity: 0.9, duration: 0.2 }));
            btn.addEventListener('mouseleave', () => gsap.to(btn, { opacity: 1, duration: 0.2 }));
        });
    });
};
