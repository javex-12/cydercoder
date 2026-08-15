import React, { useState } from 'react';
import { Cpu, Terminal, Layers, ShieldCheck, Zap, ArrowRight, CheckCircle2, Copy, Sparkles } from 'lucide-react';

const AI_PRESETS = [
  {
    id: 'rag',
    title: 'RAG Knowledge Engine',
    category: 'Semantic Search & Vector RAG',
    desc: 'Retrieval Augmented Generation pipeline connecting local documents to LLMs with vector embeddings.',
    stack: {
      framework: 'Next.js App Router & Vercel AI SDK',
      vectorDb: 'Supabase Vector (pgvector) / Pinecone',
      embeddings: 'text-embedding-3-small (1536 dim)',
      llm: 'OpenAI GPT-4o / Gemini 1.5 Pro',
    },
    latency: '140ms TTFT (Time to First Token)',
    steps: [
      { num: '01', title: 'Intent & Query Embedding', detail: 'Convert incoming text into 1536-dim vector embedding via OpenAI Embedding API.' },
      { num: '02', title: 'Cosine Similarity Search', detail: 'Query pgvector index for top 5 most relevant document chunks (score > 0.82).' },
      { num: '03', title: 'Contextual Prompt Assembly', detail: 'Inject retrieved chunks into system prompt with strict hallucination guardrails.' },
      { num: '04', title: 'Streaming LLM Inference', detail: 'Stream output tokens back to user via Server-Sent Events (SSE).' },
    ],
    codeSnippet: `import { OpenAIEmbeddings } from '@langchain/openai';
import { createClient } from '@supabase/supabase-js';

export async function queryRAGPipeline(userQuery: string) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  
  // 1. Generate Query Vector Embedding
  const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
  const queryVector = await embeddings.embedQuery(userQuery);

  // 2. Vector Similarity Match in pgvector
  const { data: chunks } = await supabase.rpc('match_documents', {
    query_embedding: queryVector,
    match_threshold: 0.82,
    match_count: 5,
  });

  return chunks;
}`,
  },
  {
    id: 'agent',
    title: 'Autonomous Multi-Agent Workflow',
    category: 'Agent Orchestration',
    desc: 'Distributed agent network where specialized LLMs collaborate, validate outputs, and execute multi-step tools.',
    stack: {
      framework: 'LangGraph / Python FastAPI',
      orchestrator: 'StateGraph with conditional edges',
      tools: 'Custom Python API wrappers & Web Scrapers',
      llm: 'Claude 3.5 Sonnet + GPT-4o',
    },
    latency: '1.2s complete task resolution',
    steps: [
      { num: '01', title: 'Task Decomposition', detail: 'Planner agent breaks goal into discrete sub-tasks and assigns worker roles.' },
      { num: '02', title: 'Tool Execution', detail: 'Worker agents call external APIs, query databases, and summarize findings.' },
      { num: '03', title: 'Critic & Guardrail Evaluation', detail: 'Verifier agent checks compliance, schema validity, and hallucination bounds.' },
      { num: '04', title: 'Final Synthesis', detail: 'Consolidated report generated and dispatched to destination webhook.' },
    ],
    codeSnippet: `import { StateGraph, END } from "@langchain/langgraph";

const workflow = new StateGraph({ channels: graphState })
  .addNode("planner", planTaskNode)
  .addNode("executor", executeToolsNode)
  .addNode("verifier", verifyOutputNode)
  .addEdge("planner", "executor")
  .addConditionalEdges("executor", shouldVerifyCondition, {
    verify: "verifier",
    finish: END
  });

export const app = workflow.compile();`,
  },
  {
    id: 'streaming',
    title: 'Low-Latency Streaming Voice/Chat',
    category: 'Real-Time AI Stream',
    desc: 'Ultra-low latency web-socket streaming pipeline for conversational AI assistants and live voice agents.',
    stack: {
      framework: 'WebSockets / Node.js Stream API',
      audio: 'Deepgram Nova-2 STT & ElevenLabs TTS',
      llm: 'Groq Llama 3.3 70B (800 tokens/sec)',
      transport: 'Server-Sent Events / WebRTC',
    },
    latency: '85ms token latency',
    steps: [
      { num: '01', title: 'Speech-to-Text Stream', detail: 'Real-time WebSocket audio buffer transcribed via Deepgram STT.' },
      { num: '02', title: 'Fast LLM Inference', detail: 'Query dispatched to Groq Llama 70B engine for 800+ tokens/sec throughput.' },
      { num: '03', title: 'Text-to-Speech Chunking', detail: 'First sentence chunk sent immediately to ElevenLabs streaming TTS.' },
      { num: '04', title: 'Full Duplex Playback', detail: 'Audio streamed directly to browser audio context buffer with zero delay.' },
    ],
    codeSnippet: `import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}`,
  },
];

const AiShowcase = () => {
  const [activePresetId, setActivePresetId] = useState('rag');
  const [copied, setCopied] = useState(false);

  const currentPreset = AI_PRESETS.find((p) => p.id === activePresetId) || AI_PRESETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentPreset.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-mono text-xs uppercase tracking-wider font-semibold w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>02 · AI Engineering Studio</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight" style={{ color: 'var(--theme-text)' }}>
          AI Product Architecture &amp; RAG Pipelines
        </h2>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--theme-text-muted)' }}>
          I build practical, production-ready AI capabilities into web products — from vector search and RAG knowledge engines to real-time streaming LLM pipelines.
        </p>
      </div>

      {/* Preset Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
        {AI_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setActivePresetId(preset.id)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activePresetId === preset.id
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'hover:bg-blue-500/10'
            }`}
            style={{
              color: activePresetId === preset.id ? '#ffffff' : 'var(--theme-text-muted)',
            }}
          >
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Main Studio Interactive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pipeline Steps & Description (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-6" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-blue-500 font-bold">
                {currentPreset.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-[11px] font-semibold">
                ⚡ {currentPreset.latency}
              </span>
            </div>

            <h3 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
              {currentPreset.title}
            </h3>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
              {currentPreset.desc}
            </p>

            {/* Pipeline Execution Simulator Steps */}
            <div className="space-y-3 pt-4">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--theme-text)' }}>
                Execution Pipeline Visualizer
              </span>
              {currentPreset.steps.map((step) => (
                <div
                  key={step.num}
                  className="p-4 rounded-xl border flex items-start gap-4 transition-all hover:border-blue-500/40"
                  style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}
                >
                  <span className="font-mono text-xs font-bold text-blue-500 pt-0.5">{step.num}</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                      {step.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack Breakdown Row */}
          <div className="p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}>
            <div>
              <span className="font-mono text-[10px] uppercase text-blue-500 block mb-1 font-semibold">Framework</span>
              <span className="font-medium text-[11px] truncate block" style={{ color: 'var(--theme-text)' }}>{currentPreset.stack.framework}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-blue-500 block mb-1 font-semibold">Vector Store</span>
              <span className="font-medium text-[11px] truncate block" style={{ color: 'var(--theme-text)' }}>{currentPreset.stack.vectorDb || currentPreset.stack.orchestrator || currentPreset.stack.audio}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-blue-500 block mb-1 font-semibold">LLM Engine</span>
              <span className="font-medium text-[11px] truncate block" style={{ color: 'var(--theme-text)' }}>{currentPreset.stack.llm}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-blue-500 block mb-1 font-semibold">Embeddings / Tools</span>
              <span className="font-medium text-[11px] truncate block" style={{ color: 'var(--theme-text)' }}>{currentPreset.stack.embeddings || currentPreset.stack.tools || currentPreset.stack.transport}</span>
            </div>
          </div>
        </div>

        {/* Right: Code Snippet & Live Spec (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between space-y-4 bg-slate-950 border-slate-800 text-slate-100 shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-xs font-semibold text-slate-300">Production Code Spec</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-[11px] leading-relaxed text-blue-300">
                <code>{currentPreset.codeSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold font-mono uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Safety &amp; Guardrails</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every AI feature is engineered with strict schema validation, input sanitization, automated fallbacks, and cost-capped request budgets.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiShowcase;
