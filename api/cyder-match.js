/**
 * Cyder AI — portfolio match engine (Groq).
 * Returns structured project/skill matches — not open-ended chat.
 */

import { buildCyderPrompt, sanitizeMatch } from './portfolio-context.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const MODES = new Set(['hire', 'collab', 'learn']);

const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS = 12;

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  const row = hits.get(ip) || [];
  const recent = row.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function extractJson(text) {
  const trimmed = String(text || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error('Model returned non-JSON');
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(503).json({
      error: 'GROQ_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  body = body || {};

  const mode = body.mode;
  if (!MODES.has(mode)) return res.status(400).json({ error: 'Invalid mode.' });

  const message = String(body.message || '').trim();
  if (!message || message.length > 500) {
    return res.status(400).json({ error: 'Message must be 1–500 characters.' });
  }

  const started = Date.now();
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 450,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildCyderPrompt(mode) },
          { role: 'user', content: `Mode: ${mode}\nVisitor need: ${message}` },
        ],
      }),
    });

    const raw = await groqRes.text();
    if (!groqRes.ok) {
      let detail = raw.slice(0, 300);
      try {
        const j = JSON.parse(raw);
        detail = j.error?.message || j.message || detail;
      } catch {
        /* keep slice */
      }
      return res.status(502).json({ error: 'Groq request failed', detail });
    }

    const envelope = JSON.parse(raw);
    const content = envelope.choices?.[0]?.message?.content;
    if (!content) return res.status(502).json({ error: 'Empty model response' });

    const parsed = extractJson(content);
    const match = sanitizeMatch(parsed);

    return res.status(200).json({
      ok: true,
      ...match,
      latencyMs: Date.now() - started,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Cyder match failed',
      detail: err?.message || String(err),
    });
  }
}
