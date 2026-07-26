import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Live projects', value: 10, suffix: '+' },
  { label: 'AI products shipped', value: 2, suffix: '' },
  { label: 'Focus stack', value: null, display: 'React · AI · WebGL' },
  { label: 'Based in', value: null, display: 'Lagos · UTC+1' },
];

function useCountUp(target, active, duration = 1100) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active || target == null) return undefined;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setN(target);
      return undefined;
    }
    let start = null;
    let raf = 0;
    const step = (ts) => {
      if (start == null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setN(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return n;
}

const StatCell = ({ stat, active }) => {
  const count = useCountUp(stat.value, active);

  return (
    <div className="bg-surface p-4 sm:p-5">
      <div className="font-mono text-[10px] sm:text-[11px] text-blue tracking-[0.1em] uppercase font-semibold mb-2">
        {stat.label}
      </div>
      <div className="font-display font-black text-[clamp(1.35rem,4vw,1.85rem)] uppercase leading-none text-ink">
        {stat.value != null ? (
          <>
            {count}
            {stat.suffix}
          </>
        ) : (
          stat.display
        )}
      </div>
    </div>
  );
};

const StatsBar = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="ink-grid grid-cols-2 lg:grid-cols-4 reveal-item mt-0.5 mb-0"
      data-reveal
      aria-label="Portfolio highlights"
    >
      {stats.map((s) => (
        <StatCell key={s.label} stat={s} active={active} />
      ))}
    </div>
  );
};

export default StatsBar;
