export const canRunAnimations = () => {
    if (typeof window === 'undefined') return false;

    // 1. Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return false;

    return true;
};

export const canRunThreeJS = () => {
    if (!canRunAnimations()) return false;

    // STRICT DISABLE ON MOBILE (User Directive)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return false;

    // Check for low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;

    return true;
};

export const safeExecute = (fn) => {
    try {
        fn();
    } catch (e) {
        // Silent failure as requested
    }
};
