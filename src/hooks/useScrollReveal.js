import { useEffect } from 'react';

/**
 * Observes elements with [data-reveal] and adds .is-in when visible.
 * Safe: never leaves content permanently hidden (fallback after timeout).
 */
export function useScrollReveal(ready = true) {
  useEffect(() => {
    if (!ready) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));

    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add('is-in'));
      return;
    }

    // Fallback: force-show anything that hasn't revealed after 1.5s
    const fallback = window.setTimeout(() => {
      nodes.forEach((el) => el.classList.add('is-in'));
    }, 1500);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    nodes.forEach((el) => {
      // Already in viewport (e.g. meta cards under hero)
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) {
        // small stagger via data-delay is handled by CSS transition-delay
        requestAnimationFrame(() => el.classList.add('is-in'));
      } else {
        io.observe(el);
      }
    });

    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, [ready]);
}
