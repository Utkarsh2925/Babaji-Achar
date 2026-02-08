import { canRunAnimations, safeExecute } from './guards';
import { mountThreeJS, unmountThreeJS } from './threeBackground';

// Dynamic imports for GSAP modules (Code Splitting)
const loadHome = async () => (await import('./gsapHome')).animateHome;
const loadProduct = async () => (await import('./gsapProduct')).animateProduct;
const loadCheckout = async () => (await import('./gsapCheckout')).animateCheckout;

export const updateAnimations = (view) => {
    if (!canRunAnimations()) return;

    safeExecute(async () => {
        // 1. Manage Three.js Background (Strict Route Control)
        const threeJSViews = ['HOME', 'DETAILS', 'STORES'];
        if (threeJSViews.includes(view)) {
            // Delay to prioritize Main Paint
            setTimeout(() => mountThreeJS(), 500);
        } else {
            unmountThreeJS();
        }

        // 2. Trigger GSAP Page Animations
        // Small delay to allow React to render the new view DOM
        setTimeout(async () => {
            switch (view) {
                case 'HOME':
                    const animateHome = await loadHome();
                    animateHome();
                    break;
                case 'DETAILS':
                    const animateProduct = await loadProduct();
                    animateProduct();
                    break;
                case 'CHECKOUT':
                    const animateCheckout = await loadCheckout();
                    animateCheckout();
                    break;
                case 'SUCCESS':
                    // Simple inline success animation
                    try {
                        const { default: gsap } = await import('gsap');
                        gsap.fromTo('.success-icon', { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' });
                        gsap.fromTo('.success-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.3 });
                    } catch (e) { }
                    break;
                default:
                    break;
            }
        }, 150); // 150ms buffer for DOM paint
    });
};
