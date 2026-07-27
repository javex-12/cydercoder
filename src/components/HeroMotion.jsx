import React, { useEffect, useRef } from 'react';

/**
 * Riso misprint halftone — stencil letterforms with registration drift.
 * Matches the portfolio's print/stamp identity. 2D canvas only — no 3D clichés.
 */
const HeroMotion = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parent = canvas.parentElement;
    if (!parent) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let alive = true;
    let visible = true;
    let mx = 0.5;
    let my = 0.5;
    let wipe = 0;
    let densityMap = null;
    let cols = 0;
    let rows = 0;
    let cell = 7;

    const GLYPHS = ['{', '}', '</', '/>', '01', '·', '▸', '◆'];

    const buildMap = (w, h) => {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      octx.fillStyle = '#000';
      octx.fillRect(0, 0, w, h);

      const fontSize = Math.min(w * 0.34, h * 0.55);
      octx.font = `900 ${fontSize}px "Big Shoulders Stencil Display", Impact, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';
      octx.fillText('CYDER', w * 0.52, h * 0.46);

      octx.font = `700 ${fontSize * 0.22}px "Martian Mono", monospace`;
      octx.fillText('CODER', w * 0.52, h * 0.62);

      GLYPHS.forEach((g, i) => {
        octx.font = `600 ${12 + (i % 3) * 4}px "Martian Mono", monospace`;
        octx.fillText(g, (w * 0.08) + (i % 4) * (w * 0.22), h * 0.12 + Math.floor(i / 4) * (h * 0.18));
      });

      const data = octx.getImageData(0, 0, w, h).data;
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      const map = new Float32Array(cols * rows);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = Math.min(w - 1, x * cell + cell / 2);
          const py = Math.min(h - 1, y * cell + cell / 2);
          const idx = (py * w + px) * 4;
          map[y * cols + x] = data[idx] / 255;
        }
      }
      densityMap = map;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildMap(width, height);
    };

    const drawLayer = (w, h, ox, oy, color, t) => {
      if (!densityMap) return;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const d = densityMap[y * cols + x];
          if (d < 0.08) continue;

          const nx = x / cols;
          const ny = y / rows;
          const dist = Math.hypot(nx - mx, ny - my);
          const ripple = reduced ? 0 : Math.sin(dist * 14 - t * 0.002) * 0.15 * (1 - Math.min(dist, 1));
          const radius = (cell * 0.22 + d * cell * 0.38) * (1 + ripple);

          const px = x * cell + cell / 2 + ox;
          const py = y * cell + cell / 2 + oy;

          if (py < wipe) continue;

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    };

    const draw = (t) => {
      if (!alive) return;
      raf = requestAnimationFrame(draw);
      if (!visible || !densityMap) return;

      const { width: w, height: h } = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);

      const driftX = (mx - 0.5) * 18;
      const driftY = (my - 0.5) * 12;
      const pulse = reduced ? 0 : Math.sin(t * 0.0012) * 1.5;

      if (!reduced) {
        wipe += 0.35;
        if (wipe > h + 40) wipe = -30;
      }

      drawLayer(w, h, driftX * 0.6 + pulse, driftY * 0.4, 'rgba(138, 176, 232, 0.38)', t);
      drawLayer(w, h, -driftX * 0.9 - 2, driftY * 0.7 + 1.5, 'rgba(212, 101, 58, 0.52)', t);
      drawLayer(w, h, driftX * 0.3 + 3, -driftY * 0.5 - 1, 'rgba(242, 239, 232, 0.14)', t);

      if (!reduced && wipe > 0) {
        ctx.fillStyle = 'rgba(10, 9, 8, 0.55)';
        ctx.fillRect(0, 0, w, wipe);
        ctx.fillStyle = 'rgba(212, 101, 58, 0.85)';
        ctx.fillRect(0, wipe, w, 2);
      }

      ctx.strokeStyle = 'rgba(212, 101, 58, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, w - 20, h - 20);
    };

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && document.visibilityState === 'visible';
      },
      { threshold: 0.05 }
    );

    const onVis = () => {
      visible = document.visibilityState === 'visible';
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    io.observe(parent);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-motion absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroMotion;
