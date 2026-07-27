import React, { useEffect, useRef } from 'react';

const LINES = ['I build', 'things that', 'actually work.'];

const HeroText = ({ ready }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ready || !ref.current) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let killed = false;

    const run = async () => {
      const { gsap } = await import('gsap');
      if (killed || !ref.current) return;

      const inners = ref.current.querySelectorAll('.hero-title-inner');
      gsap.fromTo(
        inners,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'expo.out',
          delay: 0.15,
        }
      );
    };

    run();
    return () => {
      killed = true;
    };
  }, [ready]);

  return (
    <h1
      ref={ref}
      className="relative z-10 font-display font-black text-[clamp(2.75rem,12vw,6rem)] uppercase leading-[0.82] tracking-tight mb-6"
      style={{ color: '#F2EFE8' }}
    >
      {LINES.map((line) => (
        <span key={line} className="hero-title-line block overflow-hidden">
          <span className="hero-title-inner inline-block">{line}</span>
        </span>
      ))}
    </h1>
  );
};

export default HeroText;
