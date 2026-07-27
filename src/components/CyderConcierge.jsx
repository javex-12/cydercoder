import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECT_NAMES } from '../data/projectIds';

const MODES = [
  { id: 'hire', label: 'Hire', hint: 'You need something built' },
  { id: 'collab', label: 'Collab', hint: 'Build together' },
  { id: 'learn', label: 'Learn', hint: 'Mentorship' },
];

const PROMPTS = {
  hire: [
    'WhatsApp storefront for my shop',
    'Exam prep app for WAEC students',
    'Savings circle app for my community',
  ],
  collab: [
    'Edtech for Nigerian schools',
    'Open-source tool for creators',
    'Music learning for choirs',
  ],
  learn: [
    '100-day web curriculum for teens',
    'Teaching code through WhatsApp',
    'From zero to shipping a PWA',
  ],
};

function fitLabel(score) {
  if (score >= 80) return 'Strong match';
  if (score >= 55) return 'Good match';
  return 'Partial match';
}

const CyderConcierge = ({ onMatch, onOpenContact }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('hire');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [match, setMatch] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 300);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('compass-open', open);
    return () => document.body.classList.remove('compass-open');
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

      try {
        const res = await fetch('/api/cyder-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, message: trimmed }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Could not run match right now. Try again.');

        setMatch(data);
        onMatch?.(data.matchedProjects || []);

        window.setTimeout(() => {
          const first = data.matchedProjects?.[0];
          if (first) {
            document.querySelector(`[data-project-id="${first}"]`)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 400);
      } catch (err) {
        setError(err?.message || 'Something went wrong. Try again in a moment.');
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

  return (
    <>
      <button
        type="button"
        className={`compass-tab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="compass-panel"
        aria-label={open ? 'Close project finder' : 'Open project finder'}
      >
        <span className="compass-tab-mark" aria-hidden="true">
          <span className="compass-tab-crop compass-tab-crop-tl" />
          <span className="compass-tab-crop compass-tab-crop-br" />
          <span className="compass-tab-letter">?</span>
        </span>
        <span className="compass-tab-text font-mono">Find fit</span>
      </button>

      <div
        id="compass-panel"
        className={`compass-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Project finder"
        aria-hidden={!open}
      >
        <header className="compass-panel-head">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue mb-1 m-0">
              Portfolio compass
            </p>
            <h2 className="font-display font-black text-[clamp(1.75rem,5vw,2.25rem)] uppercase leading-none text-ink m-0">
              What do you need?
            </h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="compass-close" aria-label="Close">
            ×
          </button>
        </header>

        <p className="text-ink-muted text-sm leading-relaxed mb-5">
          Tell me the problem — not the tech. I&apos;ll point to work on this site that&apos;s closest to
          what you&apos;re trying to do, and light them up.
        </p>

        <div className="compass-modes mb-4">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`compass-mode ${mode === m.id ? 'is-active' : ''}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider">{m.label}</span>
              <span className="text-[10px] text-ink-muted">{m.hint}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {PROMPTS[mode].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setMessage(p);
                runMatch(p);
              }}
              className="compass-chip"
            >
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="compass-input">
            Describe what you need
          </label>
          <textarea
            id="compass-input"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. My church choir needs a way to practice solfa on their phones…"
            className="brief-input w-full resize-none min-h-[88px]"
          />
          <button
            type="submit"
            disabled={loading || message.trim().length < 4}
            className="btn-stamp btn-stamp-paper w-full justify-center mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Looking…' : 'Show me the fit →'}
          </button>
        </form>

        {error && (
          <p className="font-mono text-[11px] text-orange-soft border border-orange/30 bg-orange/10 p-3 mt-4 mb-0">
            {error}
          </p>
        )}

        {loading && (
          <div className="compass-loading mt-5" aria-live="polite">
            <div className="compass-loading-track">
              <div className="compass-loading-bar" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mt-2 mb-0">
              Reading your brief against my work…
            </p>
          </div>
        )}

        {match && !loading && (
          <div className="compass-result mt-5">
            <div className="compass-verdict">
              <span className="compass-verdict-label font-mono">{fitLabel(match.fitScore)}</span>
              <p className="text-sm text-ink leading-relaxed m-0">{match.pitch}</p>
            </div>

            {match.matchedProjects?.length > 0 && (
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-orange-soft mb-2">
                  Closest work on this page
                </div>
                <ul className="compass-projects m-0 p-0 list-none">
                  {match.matchedProjects.map((id, i) => (
                    <li key={id} className="compass-project-card" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="font-mono text-[9px] text-blue uppercase">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display font-bold text-sm uppercase">
                        {PROJECT_NAMES[id] || id}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.matchedSkills?.length > 0 && (
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-blue mb-2">
                  Relevant skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills.map((s) => (
                    <span key={s} className="compass-skill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-stamp !py-2.5 !px-4 !text-[11px]"
              >
                See highlighted work →
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenContact?.();
                }}
                className="btn-stamp btn-stamp-outline !py-2.5 !px-4 !text-[11px]"
              >
                {match.nextAction || 'Get in touch'}
              </button>
            </div>
          </div>
        )}
      </div>

      {open && (
        <button
          type="button"
          className="compass-backdrop"
          aria-label="Close project finder"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default CyderConcierge;
