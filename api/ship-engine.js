/**
 * Ship Forge — product architecture engine (Groq).
 * Server-side only. Set GROQ_API_KEY in Vercel env.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const MAX_IDEA = 900;
const MAX_CONSTRAINT = 280;

// Best-effort rate limit (resets on cold start)
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS = 8;

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

const SYSTEM = `You are Ship Forge — an elite product engineering engine used on a developer portfolio.
You do NOT chat. You do NOT roleplay. You do NOT use slang, pidgin, or cultural dialect.
You turn a messy product idea into a ruthless, shippable engineering brief.

Return ONLY valid JSON matching this schema (no markdown fences):
{
  "codename": "short product codename, 1-3 words",
  "one_liner": "one crisp sentence of what ships",
  "problem": {
    "core": "the real user pain in one sentence",
    "who_hurts": "specific user segment",
    "why_now": "timing / market force"
  },
  "kill_list": ["3-5 things people would overbuild that we deliberately cut"],
  "architecture": {
    "modules": [
      { "id": "mod_a", "name": "Module name", "role": "what it owns", "depends_on": [] }
    ],
    "data_flow": ["step 1 of the critical path", "step 2", "step 3", "step 4"]
  },
  "stack": {
    "frontend": "choice + why in few words",
    "backend": "choice + why",
    "ai": "where AI is used (or none) + model role",
    "data": "storage / sync choice",
    "why": "one paragraph tradeoff reasoning"
  },
  "ship_plan": [
    { "phase": "Day 1-2", "goal": "concrete goal", "done_when": "testable done criteria" }
  ],
  "risks": [
    { "risk": "specific risk", "severity": "high|medium|low", "mitigation": "concrete mitigation" }
  ],
  "mvp_scope": "what is in the first shippable slice (2-4 sentences)",
  "anti_gimmick": "how this avoids fake AI / demo-ware (1-2 sentences)",
  "hire_hook": "one line: why a product engineer like CyderCoder is the right builder for this"
}

Rules:
- Be specific to the idea. No generic filler.
- Prefer boring reliable systems over clever architecture.
- If the idea is weak, say so in problem.core and still produce a better scoped MVP.
- Exactly 4-6 architecture modules.
- Exactly 4 ship_plan phases covering ~7-14 days.
- Exactly 3 risks.
- kill_list length 3-5.
- English only. Professional tone.`;

function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many runs. Wait a minute, then forge again.' });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(503).json({
      error: 'GROQ_API_KEY is not set on the server. Add it in Vercel → Settings → Environment Variables.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return badRequest(res, 'Invalid JSON body');
    }
  }
  body = body || {};

  const idea = String(body.idea || '').trim();
  const constraint = String(body.constraint || '').trim();
  const audience = String(body.audience || '').trim();

  if (idea.length < 12) {
    return badRequest(res, 'Give Ship Forge a real idea (at least a short paragraph).');
  }
  if (idea.length > MAX_IDEA) {
    return badRequest(res, `Idea too long (max ${MAX_IDEA} chars).`);
  }
  if (constraint.length > MAX_CONSTRAINT || audience.length > MAX_CONSTRAINT) {
    return badRequest(res, 'Constraint / audience fields are too long.');
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  const userPayload = [
    `PRODUCT IDEA:\n${idea}`,
    audience ? `TARGET AUDIENCE:\n${audience}` : null,
    constraint ? `HARD CONSTRAINTS:\n${constraint}` : null,
    'Compile a full Ship Forge engineering brief as JSON only.',
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.55,
        max_tokens: 2800,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userPayload },
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
      return res.status(502).json({
        error: 'Groq request failed',
        detail,
      });
    }

    let parsed;
    try {
      const envelope = JSON.parse(raw);
      const content = envelope.choices?.[0]?.message?.content;
      if (!content) {
        return res.status(502).json({ error: 'Empty model response' });
      }
      parsed = typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      return res.status(502).json({ error: 'Model returned non-JSON. Try again.' });
    }

    // Light shape guard
    if (!parsed || typeof parsed !== 'object' || !parsed.codename) {
      return res.status(502).json({ error: 'Incomplete brief from model. Try again.' });
    }

    return res.status(200).json({
      ok: true,
      model,
      brief: parsed,
      forgedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Ship Forge crashed',
      detail: err?.message || String(err),
    });
  }
}
