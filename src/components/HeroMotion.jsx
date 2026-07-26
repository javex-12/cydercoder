import React, { useEffect, useRef } from 'react';

/**
 * Lightweight ambient motion for the hero — CSS-friendly canvas dust.
 * Respects prefers-reduced-motion.
 */
const HeroMotion = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let alive = true;
    const dots = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.4 + Math.random() * 1.4,
      sp: 0.00015 + Math.random() * 0.00035,
      a: 0.15 + Math.random() * 0.35,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      if (!alive) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      dots.forEach((d, i) => {
        d.y -= d.sp;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        const pulse = 0.6 + 0.4 * Math.sin(t / 900 + i);
        ctx.fillStyle =
          i % 5 === 0
            ? `rgba(138, 176, 232, ${d.a * pulse})`
            : `rgba(212, 101, 58, ${d.a * pulse})`;
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.s, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="hero-motion absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroMotion;
