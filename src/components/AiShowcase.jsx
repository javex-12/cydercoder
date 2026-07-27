import React, { useEffect, useMemo, useRef, useState } from 'react';

const SEEDS = [
  {
    id: 'invoice',
    label: 'Invoice chaser',
    idea:
      'A tool for freelancers that drafts polite payment follow-ups, tracks which invoices are aging, and escalates tone only after clear rules — not another generic CRM.',
    audience: 'Solo freelancers & tiny studios',
    constraint: 'Must work without a mobile app; email + web only. First version under 2 weeks.',
  },
  {
    id: 'handoff',
    label: 'Design handoff',
    idea:
      'Designers dump Figma links and messy notes; engineers get a structured build packet: component inventory, states, edge cases, and open questions — not another AI that rewrites copy.',
    audience: 'Product teams of 3–12',
    constraint: 'Read-only Figma URLs + pasted notes. No design-system generator fantasy.',
  },
  {
    id: 'ops',
    label: 'Ops triage',
    idea:
      'Internal tool that turns messy Slack/support dumps into a ranked incident board: severity, owner, blast radius, and the single next action — not a chatbot in a channel.',
    audience: 'SaaS support + eng leads',
    constraint: 'Pasted text only for MVP. Must be auditable (no silent AI decisions).',
  },
];

const STAGES = [
  { id: 'scan', label: 'Scan idea' },
  { id: 'kill', label: 'Cut scope' },
  { id: 'arch', label: 'Map system' },
  { id: 'stack', label: 'Pick stack' },
  { id: 'ship', label: 'Ship plan' },
  { id: 'risk', label: 'Risk pass' },
];

function NeuralCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let alive = true;

    const nodes = Array.from({ length: 32 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: 1.1 + Math.random() * 1.7,
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

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 95) {
            const alpha = (1 - dist / 95) * 0.32;
            ctx.strokeStyle = `rgba(212, 101, 58, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n, idx) => {
        const pulse = prefersReduced ? 1 : 0.7 + 0.3 * Math.sin(Date.now() / 700 + idx);
        ctx.fillStyle =
          idx % 4 === 0
            ? `rgba(138, 176, 232, ${0.55 * pulse})`
            : `rgba(232, 160, 122, ${0.7 * pulse})`;
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
      className="ai-neural absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden="true"
    />
  );
}

function Severity({ level }) {
  const l = String(level || 'medium').toLowerCase();
  const cls =
    l === 'high' ? 'text-orange-soft border-orange/40 bg-orange/15' : l === 'low' ? 'text-blue border-blue/30 bg-blue/10' : 'text-ink-muted border-ink/20 bg-paper/40';
  return (
    <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${cls}`}>
      {l}
    </span>
  );
}

function Panel({ title, kicker, children, show, delay = 0 }) {
  return (
    <article
      className={`forge-panel border border-ink/12 bg-paper/50 p-4 sm:p-5 ${show ? 'is-in' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {kicker && (
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue mb-1">{kicker}</div>
      )}
      <h3 className="font-display font-bold text-lg sm:text-xl uppercase leading-none mb-3 text-ink">
        {title}
      </h3>
      {children}
    </article>
  );
}

const AiShowcase = () => {
  const [idea, setIdea] = useState(SEEDS[0].idea);
  const [audience, setAudience] = useState(SEEDS[0].audience);
  const [constraint, setConstraint] = useState(SEEDS[0].constraint);
  const [activeSeed, setActiveSeed] = useState(SEEDS[0].id);
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [error, setError] = useState('');
  const [brief, setBrief] = useState(null);
  const [stageIdx, setStageIdx] = useState(-1);
  const [revealStep, setRevealStep] = useState(0);
  const abortRef = useRef(null);

  // Fake compile stages while waiting on Groq (UX only)
  useEffect(() => {
    if (status !== 'running') return undefined;
    setStageIdx(0);
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(i + 1, STAGES.length - 1);
      setStageIdx(i);
    }, 700);
    return () => window.clearInterval(id);
  }, [status]);

  // Cascade reveal after brief arrives
  useEffect(() => {
    if (status !== 'done' || !brief) return undefined;
    setRevealStep(0);
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      setRevealStep(step);
      if (step >= 8) window.clearInterval(id);
    }, 140);
    return () => window.clearInterval(id);
  }, [status, brief]);

  const modules = useMemo(() => brief?.architecture?.modules || [], [brief]);

  const applySeed = (seed) => {
    setActiveSeed(seed.id);
    setIdea(seed.idea);
    setAudience(seed.audience);
    setConstraint(seed.constraint);
    setError('');
  };

  const forge = async () => {
    if (status === 'running') return;
    setError('');
    setBrief(null);
    setRevealStep(0);
    setStatus('running');

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch('/api/ship-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, audience, constraint }),
        signal: ac.signal,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.detail || `Request failed (${res.status})`);
      }
      if (!data.brief) throw new Error('No brief returned');

      setBrief(data.brief);
      setStageIdx(STAGES.length - 1);
      setStatus('done');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setStatus('error');
      setError(
        err?.message ||
          'Ship Forge could not reach the API. On Vercel, set GROQ_API_KEY in Environment Variables.'
      );
    }
  };

  const show = (n) => status === 'done' && revealStep >= n;

  return (
    <section id="ai" className="mb-16 md:mb-24" aria-labelledby="ai-heading">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p
            className="reveal-item font-mono text-[11px] uppercase tracking-[0.14em] text-orange-soft mb-2"
            data-reveal
          >
            Live · Groq LLM · not a chatbot
          </p>
          <h2
            id="ai-heading"
            className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9]"
            data-reveal
          >
            Ship Forge
          </h2>
        </div>
        <p
          className="reveal-item font-body text-sm text-ink-muted max-w-md md:text-right"
          data-reveal
          data-delay="2"
        >
          Drop a messy product idea. The engine returns a kill list, system map, stack tradeoffs,
          7–14 day ship plan, and risks — the way I actually scope work for clients.
        </p>
      </div>

      <div className="ai-stage reveal-item relative overflow-hidden border border-ink/15 bg-surface" data-reveal>
        <NeuralCanvas />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          {/* ── Input forge ─────────────────────────────────────── */}
          <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-ink/12 bg-void/30">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue mb-3">
              Input · product idea
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {SEEDS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => applySeed(s)}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border cursor-pointer ${
                    activeSeed === s.id
                      ? 'border-orange/50 bg-orange/15 text-ink'
                      : 'border-ink/15 text-ink-muted hover:border-ink/35 hover:text-ink bg-transparent'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="block mb-4">
              <span className="seo-only">Product idea</span>
              <textarea
                value={idea}
                onChange={(e) => {
                  setIdea(e.target.value);
                  setActiveSeed(null);
                }}
                rows={5}
                maxLength={900}
                className="forge-input w-full resize-y min-h-[120px]"
                placeholder="Describe the product problem — not a slogan."
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5 block">
                  Audience
                </span>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  maxLength={280}
                  className="forge-input w-full"
                  placeholder="Who pays / who uses"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5 block">
                  Constraints
                </span>
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => setConstraint(e.target.value)}
                  maxLength={280}
                  className="forge-input w-full"
                  placeholder="Time, budget, no-go tech"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={forge}
              disabled={status === 'running' || idea.trim().length < 12}
              className="btn-stamp btn-stamp-paper w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'running' ? 'Forging brief…' : 'Run Ship Forge →'}
            </button>

            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted mb-2">
                Compile stages
              </div>
              <ol className="grid grid-cols-2 sm:grid-cols-3 gap-2 list-none m-0 p-0">
                {STAGES.map((s, i) => {
                  const on = status === 'running' ? i <= stageIdx : status === 'done';
                  const current = status === 'running' && i === stageIdx;
                  return (
                    <li
                      key={s.id}
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-2 border ${
                        on
                          ? 'border-orange/40 text-ink bg-orange/10'
                          : 'border-ink/10 text-ink-muted'
                      } ${current ? 'forge-stage-live' : ''}`}
                    >
                      <span className="text-orange-soft mr-1">{String(i + 1).padStart(2, '0')}</span>
                      {s.label}
                    </li>
                  );
                })}
              </ol>
            </div>

            {error && (
              <p className="mt-4 font-mono text-[11px] text-orange-soft border border-orange/30 bg-orange/10 p-3 leading-relaxed">
                {error}
              </p>
            )}

            <p className="mt-4 font-mono text-[10px] text-ink-muted leading-relaxed">
              Powered by Groq on the server. Your key never touches the browser. Rate-limited for
              demo safety.
            </p>
          </div>

          {/* ── Output blueprint ────────────────────────────────── */}
          <div className="p-5 sm:p-7 min-h-[420px]">
            {status === 'idle' && (
              <div className="h-full flex flex-col justify-center items-start gap-3 py-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue">
                  Output · engineering brief
                </div>
                <p className="font-display font-black text-3xl sm:text-4xl uppercase leading-[0.9] text-ink max-w-sm">
                  Not a chat.
                  <br />
                  A build packet.
                </p>
                <p className="text-ink-muted text-sm max-w-md leading-relaxed">
                  Pick a seed or paste your own idea, then run the forge. You get architecture,
                  stack tradeoffs, and a ship plan — the same rigor I use on client work.
                </p>
              </div>
            )}

            {status === 'running' && (
              <div className="h-full flex flex-col justify-center gap-4 py-12">
                <div className="flex items-center gap-2">
                  <span className="ai-pulse w-2 h-2 rounded-full bg-orange" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                    Compiling with Groq · {STAGES[Math.max(0, stageIdx)]?.label}
                  </span>
                </div>
                <div className="forge-skeleton space-y-3">
                  <div className="h-3 w-2/5 bg-ink/10" />
                  <div className="h-8 w-4/5 bg-ink/10" />
                  <div className="h-24 w-full bg-ink/5 border border-ink/10" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-ink/5 border border-ink/10" />
                    <div className="h-16 bg-ink/5 border border-ink/10" />
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && !brief && (
              <div className="h-full flex flex-col justify-center gap-3 py-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange-soft">
                  Forge failed
                </div>
                <p className="text-ink text-sm leading-relaxed max-w-md">
                  {error || 'Something went wrong.'} Check that{' '}
                  <code className="text-orange-soft">GROQ_API_KEY</code> is set in Vercel, then
                  redeploy.
                </p>
                <button type="button" onClick={forge} className="btn-stamp btn-stamp-outline !py-2.5 !px-4 !text-[11px] w-fit">
                  Retry
                </button>
              </div>
            )}

            {brief && status === 'done' && (
              <div className="space-y-3">
                <div
                  className={`forge-panel border border-orange/30 bg-orange/10 p-4 sm:p-5 ${show(1) ? 'is-in' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange-soft mb-1">
                        Codename
                      </div>
                      <h3 className="font-display font-black text-3xl sm:text-4xl uppercase leading-none text-ink">
                        {brief.codename}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={forge}
                      className="font-mono text-[10px] uppercase tracking-wider border border-ink/25 px-3 py-1.5 hover:border-ink text-ink bg-transparent cursor-pointer"
                    >
                      Re-forge
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-ink/90 leading-relaxed">{brief.one_liner}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Panel title="Problem" kicker="01 · diagnosis" show={show(2)} delay={40}>
                    <ul className="space-y-2 text-[13px] text-ink-muted m-0 p-0 list-none">
                      <li>
                        <span className="text-blue font-mono text-[10px] uppercase">Core · </span>
                        {brief.problem?.core}
                      </li>
                      <li>
                        <span className="text-blue font-mono text-[10px] uppercase">Who · </span>
                        {brief.problem?.who_hurts}
                      </li>
                      <li>
                        <span className="text-blue font-mono text-[10px] uppercase">Why now · </span>
                        {brief.problem?.why_now}
                      </li>
                    </ul>
                  </Panel>

                  <Panel title="Kill list" kicker="02 · do not build" show={show(3)} delay={80}>
                    <ul className="space-y-2 m-0 p-0 list-none">
                      {(brief.kill_list || []).map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-[13px] text-ink-muted border-b border-ink/10 pb-2 last:border-0"
                        >
                          <span className="text-orange shrink-0 font-mono">×</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                <Panel title="System map" kicker="03 · architecture" show={show(4)} delay={120}>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {modules.map((m) => (
                      <div
                        key={m.id || m.name}
                        className="forge-module border border-ink/15 bg-surface px-3 py-2 min-w-[7.5rem]"
                      >
                        <div className="font-mono text-[9px] uppercase tracking-wider text-orange-soft mb-0.5">
                          {m.id || 'module'}
                        </div>
                        <div className="font-display font-bold text-sm uppercase leading-none text-ink mb-1">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-ink-muted leading-snug">{m.role}</div>
                      </div>
                    ))}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-blue mb-2">
                    Critical path
                  </div>
                  <ol className="space-y-1.5 m-0 pl-4 text-[12px] text-ink-muted">
                    {(brief.architecture?.data_flow || []).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </Panel>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Panel title="Stack" kicker="04 · decisions" show={show(5)} delay={160}>
                    <dl className="space-y-2 text-[12px] m-0">
                      {[
                        ['Frontend', brief.stack?.frontend],
                        ['Backend', brief.stack?.backend],
                        ['AI', brief.stack?.ai],
                        ['Data', brief.stack?.data],
                      ].map(([k, v]) => (
                        <div key={k} className="border-b border-ink/10 pb-2">
                          <dt className="font-mono text-[9px] uppercase tracking-wider text-blue">
                            {k}
                          </dt>
                          <dd className="m-0 text-ink-muted">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {brief.stack?.why && (
                      <p className="mt-3 text-[12px] text-ink-muted leading-relaxed">
                        {brief.stack.why}
                      </p>
                    )}
                  </Panel>

                  <Panel title="Ship plan" kicker="05 · timeline" show={show(6)} delay={200}>
                    <ul className="space-y-3 m-0 p-0 list-none">
                      {(brief.ship_plan || []).map((p) => (
                        <li key={`${p.phase}-${p.goal}`} className="border-l-2 border-orange/50 pl-3">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-orange-soft">
                            {p.phase}
                          </div>
                          <div className="text-[13px] text-ink font-medium">{p.goal}</div>
                          <div className="text-[11px] text-ink-muted">Done when: {p.done_when}</div>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                <Panel title="Risks" kicker="06 · red team" show={show(7)} delay={240}>
                  <ul className="space-y-3 m-0 p-0 list-none">
                    {(brief.risks || []).map((r) => (
                      <li
                        key={r.risk}
                        className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-b border-ink/10 pb-3 last:border-0"
                      >
                        <Severity level={r.severity} />
                        <div>
                          <div className="text-[13px] text-ink">{r.risk}</div>
                          <div className="text-[11px] text-ink-muted mt-0.5">{r.mitigation}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <div
                  className={`forge-panel border border-ink/12 bg-surface p-4 sm:p-5 ${show(8) ? 'is-in' : ''}`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue mb-2">
                    MVP slice · anti-gimmick
                  </div>
                  <p className="text-[13px] text-ink-muted leading-relaxed mb-3">{brief.mvp_scope}</p>
                  <p className="text-[13px] text-ink leading-relaxed mb-4">{brief.anti_gimmick}</p>
                  {brief.hire_hook && (
                    <p className="font-mono text-[11px] text-orange-soft border-t border-ink/10 pt-3">
                      {brief.hire_hook}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ink-grid grid-cols-1 sm:grid-cols-3 mt-0.5">
        {[
          {
            k: 'What this proves',
            v: 'I wire real LLM APIs into product workflows — structured outputs, server keys, rate limits.',
          },
          {
            k: 'What this is not',
            v: 'Not a chat toy. Not dialect cosplay. A scoped engineering brief generator.',
          },
          {
            k: 'Want this in your product?',
            v: 'I ship AI features with guardrails, streaming UX, and boring-reliable backends.',
          },
        ].map((card, i) => (
          <div
            key={card.k}
            className="card-stamp reveal-item bg-surface p-5"
            data-reveal
            data-delay={String(i + 1)}
          >
            <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
              {card.k}
            </div>
            <p className="font-body text-sm text-ink-muted m-0 leading-relaxed">{card.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AiShowcase;
