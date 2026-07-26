import React, { useEffect, useRef, useState, useCallback } from 'react';

const demos = [
  {
    id: 'product',
    label: 'Product brief → AI plan',
    prompt: 'Turn this idea into a shippable AI feature for a fintech PWA.',
    reply:
      'Scope a savings-circle assistant: intent router (join / pay / remind), RAG over thrift rules, WhatsApp-style short replies, and a fallback to human support. Ship week 1 as a guided flow with guardrails — not a free-form chatbot.',
  },
  {
    id: 'naija',
    label: 'Nigerian context',
    prompt: 'Explain thrift (Ajo) to a first-time user in simple Naija English.',
    reply:
      'Ajo na group savings wey people contribute every week or month. When e reach your turn, you collect the full pot. Digital Ajo keeps the cycle automatic, transparent, and safe — no more “I forget” drama.',
  },
  {
    id: 'stack',
    label: 'Stack recommendation',
    prompt: 'Recommend a stack for an AI chat product that must feel fast on mobile.',
    reply:
      'React/Vite or Next.js for UI, streaming SSE for tokens, edge-friendly API route, light vector store for memory, and optimistic UI so first paint never waits on the model. Cache system prompts; stream only the answer.',
  },
  {
    id: 'ux',
    label: 'AI UX critique',
    prompt: 'What makes AI in a product feel useful instead of gimmicky?',
    reply:
      'Clear job-to-be-done, short latency, editable outputs, and an obvious escape hatch. If users can’t complete a task faster with AI than without it — cut the feature.',
  },
];

const aiProjects = [
  {
    name: 'Naija Bot AI',
    blurb: 'Context-aware assistant tuned for local tone & problems.',
    url: 'https://naija-bot.vercel.app/',
    tag: 'OpenAI · NLP',
  },
  {
    name: 'Chaotic Shift',
    blurb: 'Gemini + physics-y UI — playful, still purposeful.',
    url: 'https://cyswitch.vercel.app/',
    tag: 'Gemini · Motion',
  },
];

function useTypewriter(text, active, speed = 14) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || !text) {
      setOut('');
      setDone(false);
      return undefined;
    }
    setOut('');
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);

  return { out, done };
}

function NeuralCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let alive = true;

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      r: 1.2 + Math.random() * 1.8,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!alive) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      if (!prefersReduced) {
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
        });
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.35;
            ctx.strokeStyle = `rgba(212, 101, 58, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n, idx) => {
        const pulse = prefersReduced ? 1 : 0.7 + 0.3 * Math.sin(Date.now() / 700 + idx);
        ctx.fillStyle = idx % 4 === 0 ? `rgba(138, 176, 232, ${0.55 * pulse})` : `rgba(232, 160, 122, ${0.7 * pulse})`;
        ctx.beginPath();
        ctx.arc(n.x * width, n.y * height, n.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
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
      className="ai-neural absolute inset-0 w-full h-full pointer-events-none opacity-70"
      aria-hidden="true"
    />
  );
}

const AiShowcase = () => {
  const [activeId, setActiveId] = useState(demos[0].id);
  const [running, setRunning] = useState(true);
  const active = demos.find((d) => d.id === activeId) || demos[0];
  const { out, done } = useTypewriter(active.reply, running, 12);

  const runDemo = useCallback((id) => {
    setActiveId(id);
    setRunning(false);
    // restart typewriter on next tick
    window.requestAnimationFrame(() => setRunning(true));
  }, []);

  useEffect(() => {
    setRunning(true);
  }, []);

  return (
    <section id="ai" className="mb-16 md:mb-24" aria-labelledby="ai-heading">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p className="reveal-item font-mono text-[11px] uppercase tracking-[0.14em] text-orange-soft mb-2" data-reveal>
            Live demo · client-side simulation
          </p>
          <h2
            id="ai-heading"
            className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9]"
            data-reveal
          >
            AI in the product
          </h2>
        </div>
        <p className="reveal-item font-body text-sm text-ink-muted max-w-sm md:text-right" data-reveal data-delay="2">
          Not slides — a feel for how I wire LLMs into real flows: streaming UX, local context, and shippable scope.
        </p>
      </div>

      <div className="ai-stage reveal-item relative overflow-hidden border border-ink/15 bg-surface" data-reveal>
        <NeuralCanvas />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-0">
          <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-ink/12">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue mb-4">
              Try a prompt
            </div>
            <div className="flex flex-col gap-2">
              {demos.map((d) => {
                const isOn = d.id === activeId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => runDemo(d.id)}
                    className={`ai-chip text-left px-4 py-3 border transition-colors ${
                      isOn
                        ? 'border-orange/50 bg-orange/15 text-ink'
                        : 'border-ink/15 bg-paper/40 text-ink-muted hover:border-ink/35 hover:text-ink'
                    }`}
                    aria-pressed={isOn}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-orange-soft block mb-1">
                      {d.label}
                    </span>
                    <span className="font-body text-[13px] sm:text-sm leading-snug">{d.prompt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-7 flex flex-col min-h-[280px]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className={`ai-pulse w-2 h-2 rounded-full ${done ? 'bg-emerald-400' : 'bg-orange'}`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {done ? 'Response ready' : 'Streaming…'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => runDemo(activeId)}
                className="font-mono text-[10px] uppercase tracking-wider border border-ink/25 px-3 py-1.5 hover:border-ink text-ink bg-transparent cursor-pointer"
              >
                Replay
              </button>
            </div>

            <div className="ai-terminal flex-1 font-mono text-[12px] sm:text-[13px] leading-relaxed text-ink/90">
              <div className="text-blue mb-3">
                <span className="text-ink-muted">you@cyder</span>
                <span className="text-orange"> · </span>
                <span>{active.prompt}</span>
              </div>
              <div className="text-ink">
                <span className="text-orange-soft">ai</span>
                <span className="text-ink-muted"> ▸ </span>
                <span>{out}</span>
                {!done && <span className="ai-caret" aria-hidden="true" />}
              </div>
            </div>

            <p className="mt-5 font-mono text-[10px] text-ink-muted leading-relaxed border-t border-ink/10 pt-4">
              Demo only — responses are scripted to show UX &amp; product thinking. Live AI products below.
            </p>
          </div>
        </div>
      </div>

      <div className="ink-grid grid-cols-1 sm:grid-cols-2 mt-0.5">
        {aiProjects.map((p, i) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-stamp reveal-item bg-surface p-5 sm:p-6 no-underline text-ink group"
            data-reveal
            data-delay={String(i + 1)}
          >
            <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
              {p.tag}
            </div>
            <div className="font-display font-bold text-2xl uppercase leading-none mb-2 group-hover:text-orange-soft transition-colors">
              {p.name} ↗
            </div>
            <p className="font-body text-sm text-ink-muted">{p.blurb}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default AiShowcase;
