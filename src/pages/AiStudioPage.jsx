import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Eraser } from 'lucide-react';
import { Navbar } from '../components/Navbar';

// ─── Sentiment Analysis ─────────────────────────────────────────────────────

const POSITIVE_WORDS = new Set([
  'good','great','amazing','awesome','excellent','love','happy','fantastic','wonderful','perfect',
  'beautiful','best','incredible','outstanding','superb','brilliant','delightful','remarkable',
  'enjoy','pleased','glad','thankful','grateful','excited','impressive','magnificent','terrific',
  'marvelous','splendid','exceptional','phenomenal','spectacular','fabulous','nice','fine','cool',
  'positive','success','win','winning','strong','powerful','effective','innovative','creative',
  'productive','efficient','reliable','fast','quick','smart','intelligent','talented','skilled',
  'like','recommend','helpful','useful','valuable','interesting','fun','exciting','fresh',
  'sweet','super','stellar','flawless','legendary','epic','solid','genius','clean','neat',
]);

const NEGATIVE_WORDS = new Set([
  'bad','terrible','awful','horrible','hate','sad','angry','worst','ugly','poor',
  'disgusting','disappointing','dreadful','pathetic','miserable','annoying','frustrating',
  'boring','useless','stupid','weak','slow','broken','failed','failure','crash','bug',
  'error','wrong','painful','toxic','dangerous','scary','worried','anxious',
  'confused','lost','stuck','difficult','hard','impossible','never','nothing','nobody',
  'rubbish','trash','garbage','waste','mess','chaos','disaster','catastrophe','sucks','suck',
  'dislike','uncomfortable','unhappy','unpleasant','irritating','disgusted','depressed',
  'fuck','fucking','fucked','fucker','shit','shitty','bitch','ass','asshole','bastard',
  'damn','crap','hell','piss','pissed','screw','screwed','dumb','idiot','fool','stinks','stink',
]);

const INTENSIFIERS = new Set(['very','really','extremely','incredibly','absolutely','totally','completely','utterly','so','such','highly','deeply','truly','fucking']);
const NEGATORS = new Set(['not','no','never','neither','nor','hardly','barely','scarcely',"don't","doesn't","didn't","isn't","aren't","wasn't","weren't","won't","wouldn't","shouldn't","can't","cannot"]);

function analyzeSentiment(text) {
  if (!text.trim()) return { score: 0, label: 'Neutral', confidence: 0, breakdown: { positive: 0, negative: 0, neutral: 0 } };
  const words = text.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/).filter(Boolean);
  let score = 0, posCount = 0, negCount = 0, totalRelevant = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const isNegated = NEGATORS.has(prevWord);
    const isIntensified = INTENSIFIERS.has(prevWord);
    const multiplier = isIntensified ? 1.5 : 1;
    if (POSITIVE_WORDS.has(word)) {
      if (isNegated) { score -= 1 * multiplier; negCount++; } else { score += 1 * multiplier; posCount++; }
      totalRelevant++;
    } else if (NEGATIVE_WORDS.has(word)) {
      if (isNegated) { score += 0.8 * multiplier; posCount++; } else { score -= 1 * multiplier; negCount++; }
      totalRelevant++;
    }
  }
  const exclamations = (text.match(/!/g) || []).length;
  score *= (1 + exclamations * 0.1);
  const capsWords = text.split(/\s+/).filter(w => w.length > 2 && w === w.toUpperCase()).length;
  score *= (1 + capsWords * 0.15);
  const questions = (text.match(/\?/g) || []).length;
  const maxPossible = Math.max(totalRelevant, 1);
  const normalizedScore = totalRelevant === 0 ? 0 : Math.max(-1, Math.min(1, score / maxPossible));
  const neutralCount = words.length - posCount - negCount;
  const total = Math.max(words.length, 1);
  const confidence = totalRelevant === 0 ? 0.05 : Math.min(0.99, 0.5 + (totalRelevant / total) * 0.5 - questions * 0.05);
  let label = 'Neutral';
  if (normalizedScore > 0.15) label = normalizedScore > 0.5 ? 'Very Positive' : 'Positive';
  else if (normalizedScore < -0.15) label = normalizedScore < -0.5 ? 'Very Negative' : 'Negative';
  return { score: normalizedScore, label, confidence, breakdown: { positive: posCount / total, negative: negCount / total, neutral: neutralCount / total }, wordCount: words.length, posCount, negCount };
}

// ─── Text Similarity (TF-IDF + Cosine) ─────────────────────────────────────

function tokenize(text) {
  const stops = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had',
    'do','does','did','will','would','could','should','may','might','shall','can','to','of','in',
    'for','on','with','at','by','from','as','into','through','during','before','after','and','but',
    'or','nor','not','so','yet','both','either','neither','each','every','all','any','few','more',
    'most','other','some','such','than','too','very','just','also','it','its','this','that','these',
    'those','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their']);
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 1 && !stops.has(w));
}

function computeTFIDF(tokens, allDocs) {
  const tf = {};
  tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
  const maxTf = Math.max(...Object.values(tf), 1);
  const tfidf = {};
  const N = allDocs.length;
  for (const term of Object.keys(tf)) {
    const normalizedTf = tf[term] / maxTf;
    const df = allDocs.filter(doc => doc.includes(term)).length;
    const idf = Math.log((N + 1) / (df + 1)) + 1;
    tfidf[term] = normalizedTf * idf;
  }
  return tfidf;
}

function cosineSimilarity(vecA, vecB) {
  const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;
  for (const key of allKeys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ─── Animated bar component ────────────────────────────────────────────────

const ConfidenceBar = ({ value, label, color, delay = 0, large = false }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value * 100), 50 + delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={`font-mono uppercase tracking-wider ${large ? 'text-xs' : 'text-[11px]'}`} style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
        <span className={`font-mono font-bold ${large ? 'text-sm' : 'text-[11px]'}`} style={{ color }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className={`${large ? 'h-3' : 'h-2'} rounded-full overflow-hidden`} style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color, boxShadow: width > 10 ? `0 0 12px ${color}40` : 'none' }}
        />
      </div>
    </div>
  );
};

// ─── EXPERIMENT 1: Sentiment Analysis ───────────────────────────────────────

const SentimentExperiment = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim()) setResult(analyzeSentiment(text));
      else setResult(null);
    }, 150);
    return () => clearTimeout(timer);
  }, [text]);

  const getSentimentColor = (score) => {
    if (score > 0.3) return '#10b981';
    if (score > 0) return '#34d399';
    if (score < -0.3) return '#ef4444';
    if (score < 0) return '#f87171';
    return '#64748b';
  };

  const gaugeRotation = result ? result.score * 90 : 0;

  const SENTIMENT_PRESETS = [
    { label: '🌟 Positive Review', text: 'This product is absolutely fantastic! Super fast, reliable, and exceptionally well designed.' },
    { label: '💔 Negative Feedback', text: 'Terrible experience. The system crashed constantly with bugs and slow performance.' },
    { label: '🤔 Negated Sentiment', text: 'The interface is not bad at all, actually quite pleasant and fast.' },
    { label: '😐 Neutral Statement', text: 'The report was generated on Monday and sent to the development team.' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Test Presets */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
        <span className="font-mono text-xs text-orange-400 font-semibold px-2">Quick Test Samples:</span>
        {SENTIMENT_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setText(preset.text)}
            className="px-3 py-1.5 rounded-xl border font-mono text-xs transition-all hover:bg-orange-500/20 cursor-pointer"
            style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type anything — a review, a tweet, a message — or click a preset above to test..."
        className="w-full h-36 p-5 rounded-2xl border bg-transparent text-base resize-none focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-slate-600 leading-relaxed"
        style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
      />

      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Big gauge - center stage */}
          <div className="flex flex-col items-center py-8">
            <div className="relative w-72 h-36 sm:w-96 sm:h-48">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M 15 92 A 85 85 0 0 1 185 92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
                {/* Negative zone */}
                <path d="M 15 92 A 85 85 0 0 1 100 7" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="10" strokeLinecap="round" />
                {/* Positive zone */}
                <path d="M 100 7 A 85 85 0 0 1 185 92" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="10" strokeLinecap="round" />
                {/* Active arc */}
                <path
                  d="M 15 92 A 85 85 0 0 1 185 92"
                  fill="none"
                  stroke={getSentimentColor(result.score)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${((result.score + 1) / 2) * 267} 267`}
                  className="transition-all duration-700 ease-out"
                  style={{ filter: `drop-shadow(0 0 12px ${getSentimentColor(result.score)}80)` }}
                />
                {/* Needle */}
                <g transform={`rotate(${gaugeRotation}, 100, 92)`} className="transition-all duration-500">
                  <line x1="100" y1="92" x2="100" y2="20" stroke={getSentimentColor(result.score)} strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="92" r="6" fill={getSentimentColor(result.score)} />
                  <circle cx="100" cy="92" r="3" fill="#0a0a0a" />
                </g>
                <text x="12" y="99" fill="#a39589" fontSize="7" fontFamily="monospace">NEGATIVE</text>
                <text x="152" y="99" fill="#a39589" fontSize="7" fontFamily="monospace">POSITIVE</text>
              </svg>
            </div>

            <div className="text-center mt-4 space-y-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono block" style={{ color: getSentimentColor(result.score) }}>
                {result.label}
              </span>
              <span className="block font-mono text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                Score: {result.score > 0 ? '+' : ''}{result.score.toFixed(3)} · {result.wordCount} tokens analyzed
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <ConfidenceBar value={result.breakdown.positive} label={`Positive · ${result.posCount} matches`} color="#10b981" delay={0} large />
            </div>
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <ConfidenceBar value={result.breakdown.negative} label={`Negative · ${result.negCount} matches`} color="#ef4444" delay={100} large />
            </div>
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <ConfidenceBar value={result.confidence} label="Model Confidence" color="#ea580c" delay={200} large />
            </div>
          </div>

          {/* Pipeline info */}
          <div className="p-4 rounded-xl border font-mono text-xs leading-relaxed" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}>
            <span className="text-orange-400 font-semibold">Pipeline:</span> Tokenize ({result.wordCount} tokens) → Lexicon Match ({POSITIVE_WORDS.size + NEGATIVE_WORDS.size} terms) → Negation Handling ({NEGATORS.size} patterns) → Intensity Scaling → Normalize → Classify
          </div>
        </div>
      )}
    </div>
  );
};

// ─── EXPERIMENT 2: Text Similarity ──────────────────────────────────────────

const SimilarityExperiment = () => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [sharedTerms, setSharedTerms] = useState([]);
  const [vectorDims, setVectorDims] = useState({ a: 0, b: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textA.trim() && textB.trim()) {
        const tokensA = tokenize(textA);
        const tokensB = tokenize(textB);
        const allDocs = [tokensA, tokensB];
        const vecA = computeTFIDF(tokensA, allDocs);
        const vecB = computeTFIDF(tokensB, allDocs);
        const sim = cosineSimilarity(vecA, vecB);
        setSimilarity(sim);
        setVectorDims({ a: Object.keys(vecA).length, b: Object.keys(vecB).length });
        const setA = new Set(tokensA);
        const shared = tokensB.filter(t => setA.has(t));
        setSharedTerms([...new Set(shared)]);
      } else {
        setSimilarity(null);
        setSharedTerms([]);
        setVectorDims({ a: 0, b: 0 });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [textA, textB]);

  const getSimColor = (s) => {
    if (s > 0.7) return '#10b981';
    if (s > 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getSimLabel = (s) => {
    if (s > 0.8) return 'Very Similar';
    if (s > 0.6) return 'Similar';
    if (s > 0.4) return 'Somewhat Similar';
    if (s > 0.2) return 'Loosely Related';
    return 'Dissimilar';
  };

  const SIMILARITY_PRESETS = [
    {
      label: '📄 Machine Learning vs AI',
      a: 'Machine learning algorithms train mathematical models on large datasets to make predictions.',
      b: 'Artificial intelligence models analyze data patterns using machine learning algorithms to predict outcomes.',
    },
    {
      label: '⚡ Front-End vs Databases',
      a: 'React components manage user interface state, render virtual DOM nodes, and handle CSS animations.',
      b: 'PostgreSQL database stores relational records with primary keys, indexes, and SQL query transactions.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Test Presets */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
        <span className="font-mono text-xs text-orange-400 font-semibold px-2">Quick Test Pairs:</span>
        {SIMILARITY_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setTextA(preset.a);
              setTextB(preset.b);
            }}
            className="px-3 py-1.5 rounded-xl border font-mono text-xs transition-all hover:bg-orange-500/20 cursor-pointer"
            style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold block">Document A</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste or type the first text passage..."
            className="w-full h-36 p-5 rounded-2xl border bg-transparent text-base resize-none focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-slate-600 leading-relaxed"
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold block">Document B</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste or type the second text passage..."
            className="w-full h-36 p-5 rounded-2xl border bg-transparent text-base resize-none focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-slate-600 leading-relaxed"
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          />
        </div>
      </div>

      {similarity !== null && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Big center score */}
          <div className="flex flex-col items-center py-8">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={getSimColor(similarity)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${similarity * 263.9} 263.9`}
                  className="transition-all duration-700 ease-out"
                  style={{ filter: `drop-shadow(0 0 12px ${getSimColor(similarity)}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl font-bold font-mono" style={{ color: getSimColor(similarity) }}>
                  {(similarity * 100).toFixed(0)}%
                </span>
                <span className="font-mono text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>
                  {getSimLabel(similarity)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <span className="text-3xl font-bold font-mono text-orange-400 block">{vectorDims.a}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider mt-1 block" style={{ color: 'var(--theme-text-muted)' }}>Doc A Terms</span>
            </div>
            <div className="p-5 rounded-2xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <span className="text-3xl font-bold font-mono text-orange-400 block">{vectorDims.b}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider mt-1 block" style={{ color: 'var(--theme-text-muted)' }}>Doc B Terms</span>
            </div>
            <div className="p-5 rounded-2xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <span className="text-3xl font-bold font-mono block" style={{ color: getSimColor(similarity) }}>{sharedTerms.length}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider mt-1 block" style={{ color: 'var(--theme-text-muted)' }}>Shared Terms</span>
            </div>
            <div className="p-5 rounded-2xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <span className="text-3xl font-bold font-mono text-orange-400 block">{vectorDims.a + vectorDims.b}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider mt-1 block" style={{ color: 'var(--theme-text-muted)' }}>Vector Dims</span>
            </div>
          </div>

          {/* Shared vocabulary */}
          {sharedTerms.length > 0 && (
            <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
              <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold block">
                Shared Vocabulary
              </span>
              <div className="flex flex-wrap gap-2">
                {sharedTerms.map(term => (
                  <span key={term} className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-sm">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border font-mono text-xs leading-relaxed" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}>
            <span className="text-orange-400 font-semibold">Pipeline:</span> Tokenize → Stop-word Removal → TF-IDF Vectorize ({vectorDims.a + vectorDims.b}-dim space) → Cosine Similarity → Term Overlap Analysis
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Experiments config ─────────────────────────────────────────────────────

const EXPERIMENTS = [
  {
    id: 'sentiment',
    title: 'Sentiment Analysis',
    tagline: 'NLP Classification & Negation',
    desc: 'Real-time NLP sentiment engine with negation handling, intensity scaling, and confidence scoring. Type any text or select a preset to analyze.',
    Component: SentimentExperiment,
  },
  {
    id: 'similarity',
    title: 'Text Similarity & Semantic Match',
    tagline: 'Information Retrieval (TF-IDF & Cosine)',
    desc: 'Compare document vectors using TF-IDF tokenization and Cosine distance — the foundational math powering semantic search and RAG knowledge pipelines.',
    Component: SimilarityExperiment,
  },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export const AiStudioPage = ({ onNavigateHome, onOpenContact }) => {
  const [activeExperiment, setActiveExperiment] = useState('sentiment');
  const current = EXPERIMENTS.find(e => e.id === activeExperiment) || EXPERIMENTS[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      <Navbar onOpenContact={onOpenContact} activeSection="ai" onNavigate={(path) => { if (path === '/') onNavigateHome(); }} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-6 border-b pb-8" style={{ borderColor: 'var(--theme-border)' }}>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all hover:bg-orange-500/10 cursor-pointer"
            style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to Portfolio</span>
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-xs uppercase tracking-wider font-semibold w-fit">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Live ML Experiments · Client-Side Inference</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight" style={{ color: 'var(--theme-text)' }}>
              AI Engineering Lab
            </h1>
            <p className="text-base sm:text-lg max-w-3xl leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
              Interactive machine learning algorithms executing entirely in your browser with zero latency. Real mathematical vectors, tokenizers, and NLP classifiers.
            </p>
          </div>
        </div>

        {/* Experiment Tabs */}
        <div className="flex flex-wrap gap-3 p-2 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
          {EXPERIMENTS.map(exp => (
            <button
              key={exp.id}
              type="button"
              onClick={() => setActiveExperiment(exp.id)}
              className={`flex-1 min-w-[200px] px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer text-center font-bold ${
                activeExperiment === exp.id
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/40'
                  : 'hover:bg-orange-500/10'
              }`}
              style={{ color: activeExperiment === exp.id ? '#ffffff' : 'var(--theme-text-muted)' }}
            >
              {exp.title}
            </button>
          ))}
        </div>

        {/* Experiment Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>{current.title}</h2>
              <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                {current.tagline}
              </span>
            </div>
            <p className="text-sm max-w-3xl leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{current.desc}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">Client-Side WASM / JS</span>
          </div>
        </div>

        {/* Active Experiment */}
        <div className="p-6 sm:p-10 rounded-3xl border shadow-xl shadow-black/20" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
          <current.Component />
        </div>

        {/* Bottom note */}
        <div className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--theme-border)' }}>
          <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">Architecture &amp; Algorithm Stack</span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
            Every experiment on this page runs <strong style={{ color: 'var(--theme-text)' }}>real ML algorithms in your browser</strong> — no external APIs, no backend inference servers.
            Sentiment analysis uses a weighted lexicon classifier with negation detection and intensity scaling.
            Text similarity computes TF-IDF vectors with stop-word filtering and measures cosine distance — the same mathematical foundation powering retrieval ranking and semantic search in modern RAG architectures.
          </p>
        </div>
      </main>
    </div>
  );
};
