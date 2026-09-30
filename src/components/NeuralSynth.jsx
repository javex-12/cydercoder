import React, { useState, useRef, useEffect, useCallback } from 'react';

// Full C major octave with Tonic Solfa labels
const KEYS = [
  { solfa: 'Do',  note: 'C4',  freq: 261.63, white: true  },
  { solfa: 'Re',  note: 'D4',  freq: 293.66, white: true  },
  { solfa: 'Mi',  note: 'E4',  freq: 329.63, white: true  },
  { solfa: 'Fa',  note: 'F4',  freq: 349.23, white: true  },
  { solfa: 'Sol', note: 'G4',  freq: 392.00, white: true  },
  { solfa: 'La',  note: 'A4',  freq: 440.00, white: true  },
  { solfa: 'Ti',  note: 'B4',  freq: 493.88, white: true  },
  { solfa: 'Do\'', note: 'C5', freq: 523.25, white: true  },
];

// Harmony intervals: maps each degree to a pleasant response chord tone
// These are the 3rd and 5th above in the scale (classic counterpoint)
const HARMONY_MAP = {
  0: [2, 4],      // Do  → Mi,  Sol  (major tonic chord)
  1: [2, 4],      // Re  → Fa,  La   (supertonic)
  2: [2, 4],      // Mi  → Sol, Ti   (mediant)
  3: [2, 4],      // Fa  → La,  Do'  (subdominant)
  4: [2, 3],      // Sol → Ti,  Re (shift for variety)
  5: [1, 3],      // La  → Ti,  Do' (leading back home)
  6: [1, 2],      // Ti  → Do', Re  (leading tone resolution)
  7: [0, 2],      // Do' → Do,  Mi  (octave echo down)
};

// Neural network layers for visualisation
const LAYER_SIZES = [4, 6, 3];

// Deterministic weights for the visualisation pass
const W1 = [
  [ 0.85, -0.42,  0.65, -0.28],
  [-0.62,  0.77,  0.15,  0.54],
  [ 0.34,  0.88, -0.71,  0.22],
  [-0.19, -0.55,  0.92, -0.41],
  [ 0.72,  0.31, -0.38,  0.83],
  [-0.45,  0.66,  0.49, -0.73],
];
const W2 = [
  [ 0.68, -0.52,  0.74, -0.31,  0.82, -0.44],
  [-0.39,  0.81, -0.47,  0.63, -0.25,  0.79],
  [ 0.55, -0.33,  0.61, -0.72,  0.48,  0.37],
];

function tanh(x)    { return Math.tanh(x); }
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function forwardPass(keyIndex) {
  const norm  = keyIndex / (KEYS.length - 1);
  const phase = Math.sin(keyIndex * 0.7);
  const parity = keyIndex % 2 === 0 ? 0.9 : 0.1;
  const octave = keyIndex > 3 ? 0.8 : 0.2;
  const input = [norm, phase, parity, octave];

  const hidden = W1.map(row =>
    tanh(row.reduce((s, w, i) => s + w * input[i], 0))
  );
  const output = W2.map(row =>
    sigmoid(row.reduce((s, w, i) => s + w * hidden[i], 0))
  );

  return { input, hidden, output };
}

// One shared AudioContext
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    const Cls = window.AudioContext || window.webkitAudioContext;
    _audioCtx = new Cls();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playNote(freq, delay = 0, duration = 0.7, gain = 0.18, type = 'triangle') {
  try {
    const ctx  = getAudioCtx();
    const now  = ctx.currentTime + delay;
    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm sub-harmonic
    const sub  = ctx.createOscillator();
    sub.type   = 'sine';
    sub.frequency.setValueAtTime(freq / 2, now);

    filt.type            = 'lowpass';
    filt.frequency.value = 1800;
    filt.Q.value         = 1.4;

    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(gain, now + 0.025);
    env.gain.exponentialRampToValueAtTime(gain * 0.55, now + 0.18);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    [osc, sub].forEach(o => { o.connect(filt); o.start(now); o.stop(now + duration + 0.05); });
    filt.connect(env);
    env.connect(ctx.destination);
  } catch { /* audio blocked */ }
}

function playHarmony(rootIdx) {
  const root = KEYS[rootIdx];
  // Play root first
  playNote(root.freq, 0, 0.8, 0.14);

  // Play harmony notes after a tiny offset so it sounds like a chord
  const intervals = HARMONY_MAP[rootIdx] || [2, 4];
  intervals.forEach((offset, i) => {
    const targetIdx = Math.min(rootIdx + offset, KEYS.length - 1);
    const f = KEYS[targetIdx].freq;
    playNote(f, 0.02 + i * 0.01, 0.9, 0.10, 'sine');
  });

  // AI "response" — play a gentle melodic echo 500ms later
  const responseIdx = intervals[0] ? Math.min(rootIdx + intervals[0], KEYS.length - 1) : rootIdx;
  const responseFreq = KEYS[responseIdx].freq;
  playNote(responseFreq,       0.55, 0.55, 0.08, 'sine');
  playNote(root.freq,          0.80, 0.45, 0.06, 'sine');
}

export default function NeuralSynth() {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const [pressed,   setPressed]  = useState(null);   // index of held key
  const [hovered,   setHovered]  = useState(null);
  const [activations, setActivations] = useState(null);
  const [pulseAmt,  setPulseAmt] = useState(0);
  const pulseRef = useRef(0);

  const handlePress = useCallback((idx) => {
    setPressed(idx);
    const result = forwardPass(idx);
    setActivations(result);
    pulseRef.current = 1.0;
    setPulseAmt(1.0);
    playHarmony(idx);
    setTimeout(() => setPressed(null), 500);
  }, []);

  // Draw neural net
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const pulse = pulseRef.current;
      const acts  = activations || {
        input:  [0.3, 0.5, 0.4, 0.2],
        hidden: [0.3, 0.5, 0.2, 0.6, 0.4, 0.35],
        output: [0.5, 0.4, 0.45],
      };

      const layers = [acts.input, acts.hidden, acts.output];
      const xs = [W * 0.15, W * 0.5, W * 0.85];

      const nodeY = (layerIdx) => {
        const n = layers[layerIdx].length;
        return layers[layerIdx].map((_, i) => H * ((i + 1) / (n + 1)));
      };

      // Draw connections
      layers.forEach((_, li) => {
        if (li === layers.length - 1) return;
        const W_mat = li === 0 ? W1 : W2;
        const ys1 = nodeY(li);
        const ys2 = nodeY(li + 1);

        ys1.forEach((y1, i) => {
          ys2.forEach((y2, j) => {
            const w = W_mat[j]?.[i] ?? 0;
            const act = Math.abs(layers[li][i]) * pulse;
            const alpha = 0.08 + act * 0.45;
            const color = w > 0
              ? `rgba(52,211,153,${alpha})`
              : `rgba(96,165,250,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(xs[li], y1);
            ctx.lineTo(xs[li + 1], y2);
            ctx.strokeStyle = color;
            ctx.lineWidth   = Math.abs(w) * 1.5 * (1 + pulse * 0.8);
            ctx.stroke();
          });
        });
      });

      // Draw nodes
      layers.forEach((vals, li) => {
        const ys = nodeY(li);
        const colors = ['#60A5FA', '#34D399', '#F472B6'];
        vals.forEach((v, i) => {
          const r = 5 + Math.abs(v) * 5 * (1 + pulse * 0.5);
          ctx.beginPath();
          ctx.arc(xs[li], ys[i], r, 0, Math.PI * 2);
          ctx.fillStyle   = colors[li];
          ctx.shadowColor = colors[li];
          ctx.shadowBlur  = pulse * 14;
          ctx.fill();
          ctx.shadowBlur  = 0;
          ctx.strokeStyle = '#0d0d0f';
          ctx.lineWidth   = 2;
          ctx.stroke();
        });
      });

      // Decay pulse
      if (pulseRef.current > 0.02) {
        pulseRef.current *= 0.96;
        setPulseAmt(pulseRef.current);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [activations]);

  // Harmony degree labels shown when a key is pressed
  const harmonyIdxs = pressed !== null ? (HARMONY_MAP[pressed] || []).map(o => Math.min(pressed + o, KEYS.length - 1)) : [];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-neutral-800/80">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-white">
            Tonic Solfa Harmony Engine
          </h3>
          <p className="text-[11px] text-neutral-500 font-mono">
            Press a note → network computes &amp; plays back a harmony
          </p>
        </div>
        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
          Web Audio API · feedforward harmoniser
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Piano Keys */}
        <div
          className="relative select-none"
          style={{ touchAction: 'none' }}
        >
          <div className="flex gap-1.5 items-end">
            {KEYS.map((k, idx) => {
              const isHeld   = pressed  === idx;
              const isHover  = hovered  === idx;
              const isHarmony = harmonyIdxs.includes(idx);

              return (
                <button
                  key={k.solfa}
                  type="button"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handlePress(idx); }}
                  onPointerEnter={() => setHovered(idx)}
                  onPointerLeave={() => setHovered(null)}
                  className={[
                    'flex-1 flex flex-col items-center justify-end pb-3 pt-6 rounded-t-xl',
                    'border-l border-r border-t transition-all duration-75 cursor-pointer',
                    'focus:outline-none',
                    isHeld
                      ? 'bg-emerald-400 border-emerald-300 shadow-lg shadow-emerald-500/30 scale-y-95 translate-y-0.5'
                      : isHarmony
                      ? 'bg-blue-300 border-blue-200 shadow-md shadow-blue-400/25'
                      : isHover
                      ? 'bg-neutral-200 border-neutral-300'
                      : 'bg-neutral-100 border-neutral-300',
                  ].join(' ')}
                  style={{ height: '9rem', minWidth: 0 }}
                >
                  <span className={`text-[11px] font-bold font-mono ${isHeld || isHarmony ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    {k.solfa}
                  </span>
                  <span className={`text-[9px] font-mono mt-0.5 ${isHeld || isHarmony ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {k.note}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Harmony label strip */}
          <div className="mt-2 h-5 flex gap-1.5">
            {KEYS.map((k, idx) => {
              const isHeld    = pressed === idx;
              const isHarmony = harmonyIdxs.includes(idx);
              return (
                <div key={k.solfa} className="flex-1 flex items-center justify-center">
                  {isHeld && (
                    <span className="text-[9px] font-mono text-emerald-400 font-bold animate-pulse">ROOT</span>
                  )}
                  {isHarmony && (
                    <span className="text-[9px] font-mono text-blue-400 font-semibold">HARM</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Neural net canvas */}
        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <div className="flex gap-5 text-[10px] font-mono text-neutral-600">
              <span><span className="text-blue-400">●</span> Input [4]</span>
              <span><span className="text-emerald-400">●</span> Hidden [6]</span>
              <span><span className="text-pink-400">●</span> Output [3]</span>
            </div>
            {activations && pressed === null && (
              <span className="text-[10px] font-mono text-emerald-400/80 animate-pulse">
                harmony computed ✓
              </span>
            )}
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={170}
            className="w-full block"
            style={{ height: '9rem' }}
          />
        </div>

        {/* Info row */}
        <p className="text-[11px] text-neutral-500 leading-relaxed font-mono text-center">
          The network maps each note to hidden activations (tanh) then outputs
          harmony selection weights (sigmoid) to pick chord tones from the scale.
          Touch or click a key to hear the computed harmony respond.
        </p>
      </div>
    </div>
  );
}
