import React, { useCallback, useEffect, useRef, useState } from 'react';

const MODES = [
  { id: 'hire', label: 'Hire me', hint: 'Need a builder who ships' },
  { id: 'collab', label: 'Collab', hint: 'Build something together' },
  { id: 'learn', label: 'Learn', hint: 'Mentorship & curriculum' },
];

const PROMPTS = {
  hire: [
    'Need a React dashboard with AI chat',
    'Groq-powered Nigerian product UX',
    'Fast Next.js portfolio engineer',
  ],
  collab: [
    'Open-source AI tooling for Africa',
    'Edtech for WAEC students',
    'Fintech for rotating savings',
  ],
  learn: [
    'Teach teens web + AI in 100 days',
    'WhatsApp-first coding curriculum',
    'How you ship with Groq so fast',
  ],
};

function FitRing({ score, active }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="cyder-ring relative w-[5.5rem] h-[5.5rem] shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(242,239,232,0.12)" strokeWidth="5" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="5"
          strokeLinecap="square"
          strokeDasharray={c}
          strokeDashoffset={active ? offset : c}
          className="cyder-ring-progress"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-2xl leading-none text-ink">{score}</span>
        <span className="font-mono text-[8px] uppercase tracking-widest text-ink-muted">fit</span>
      </div>
    </div>
  );
}

const CyderConcierge = ({ onMatch, onOpenContact }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('hire');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [match, setMatch] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 280);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const runMatch = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setLoading(true);
      setError('');
      setMatch(null);
      setLatencyMs(null);
      const started = performance.now();

      try {
        const res = await fetch('/api/cyder-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, message: trimmed }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || data.detail || `Request failed (${res.status})`);

        setMatch(data);
        setLatencyMs(data.latencyMs ?? Math.round(performance.now() - started));
        onMatch?.(data.matchedProjects || []);
      } catch (err) {
        setError(err?.message || 'Cyder could not connect. Check GROQ_API_KEY on the server.');
      } finally {
        setLoading(false);
      }
    },
    [loading, mode, onMatch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    runMatch(message);
  };

  const scrollToProjects = () => {
    setOpen(false);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <button
        type="button"
        className={`cyder-fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="cyder-panel"
        aria-label={open ? 'Close Cyder AI' : 'Open Cyder AI match engine'}
      >
        <span className="cyder-fab-core" aria-hidden="true" />
        <span className="cyder-fab-label font-mono text-[10px] uppercase tracking-[0.14em]">
          {open ? 'Close' : 'Cyder AI'}
        </span>
      </button>

      <div
        id="cyder-panel"
        className={`cyder-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cyder AI portfolio matcher"
        aria-hidden={!open}
      >
        <div className="cyder-panel-head">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange-soft mb-1">
              Live · Groq · not a chatbot
            </div>
            <h2 className="font-display font-black text-2xl uppercase leading-none text-ink m-0">
              Cyder Match
            </h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="cyder-close" aria-label="Close">
            ×
          </button>
        </div>

        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Describe what you need. Cyder maps you to real projects and skills on this page — then
          highlights them live.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`cyder-mode-btn ${mode === m.id ? 'is-active' : ''}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider">{m.label}</span>
              <span className="text-[10px] text-ink-muted">{m.hint}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {PROMPTS[mode].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setMessage(p);
                runMatch(p);
              }}
              className="cyder-chip"
            >
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <label className="sr-only" htmlFor="cyder-input">
            Describe your need
          </label>
          <textarea
            id="cyder-input"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. I need a fintech PWA with Supabase and offline support…"
            className="forge-input w-full resize-none min-h-[88px]"
          />
          <button
            type="submit"
            disabled={loading || message.trim().length < 4}
            className="btn-stamp btn-stamp-paper w-full justify-center mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Matching…' : 'Run Cyder Match →'}
          </button>
        </form>

        {error && (
          <p className="font-mono text-[11px] text-orange-soft border border-orange/30 bg-orange/10 p-3 mb-4">
            {error}
          </p>
        )}

        {loading && (
          <div className="cyder-thinking space-y-2" aria-live="polite">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Scanning portfolio…
            </div>
            <div className="h-2 bg-ink/10 overflow-hidden">
              <div className="cyder-thinking-bar h-full bg-orange/60" />
            </div>
          </div>
        )}

        {match && !loading && (
          <div className="cyder-result space-y-4">
            <div className="flex gap-4 items-start">
              <FitRing score={match.fitScore} active />
              <div className="min-w-0">
                <p className="text-sm text-ink leading-relaxed m-0">{match.pitch}</p>
                {latencyMs != null && (
                  <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mt-2 mb-0">
                    {latencyMs}ms · Groq inference
                  </p>
                )}
              </div>
            </div>

            {match.matchedSkills?.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-blue mb-2">
                  Matched skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills.map((s) => (
                    <span key={s} className="cyder-skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={scrollToProjects} className="btn-stamp !py-2.5 !px-4 !text-[11px]">
                See projects →
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenContact?.();
                }}
                className="btn-stamp btn-stamp-outline !py-2.5 !px-4 !text-[11px]"
              >
                {match.nextAction || 'Contact'}
              </button>
            </div>
          </div>
        )}
      </div>

      {open && (
        <button
          type="button"
          className="cyder-backdrop"
          aria-label="Close Cyder panel"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default CyderConcierge;
