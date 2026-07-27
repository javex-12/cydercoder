/** Shared portfolio grounding for AI routes (server-only). */

export const site = {
  name: 'Dosumu Michael (CyderCoder)',
  title: 'Full-Stack Developer · Creative Engineer · AI Product Builder',
  location: 'Lagos, Nigeria',
  email: 'michaeldosunmu22@gmail.com',
  summary:
    'Builds React/Next.js apps, Three.js experiences, Groq-powered AI products, and fintech PWAs. 10+ live projects. Open to freelance and contract work worldwide.',
};

export const skillGroups = [
  { title: 'Frontend', skills: ['React.js', 'Next.js', 'TypeScript', 'Three.js', 'GSAP', 'Framer Motion', 'Tailwind CSS'] },
  { title: 'AI / ML', skills: ['Groq API', 'OpenAI', 'Gemini AI', 'NLP', 'Computer Vision', 'GenAI Integration'] },
  { title: 'Backend', skills: ['Node.js', 'Python', 'Rust', 'Supabase', 'REST APIs', 'Real-time Systems'] },
  { title: 'Domains', skills: ['Fintech PWAs', 'Education', 'Commerce', 'WebGL', 'Cloud Infra'] },
];

export const projects = [
  { id: 'swiftlink', name: 'SwiftLink Pro', description: 'WhatsApp commerce storefront builder for Nigerian businesses.', url: 'https://swiftlinkpro.vercel.app/', stack: ['Next.js', 'WhatsApp API', 'Commerce'] },
  { id: 'biobyte', name: 'BioByte Pro', description: 'WAEC Biology practice app with 120+ modules and progress tracking.', url: 'https://biobyte.vercel.app/', stack: ['React', 'LMS', 'PWA'] },
  { id: 'chaotic', name: 'Chaotic Shift', description: 'Playful Gemini-powered web experiment with physics UI.', url: 'https://cyswitch.vercel.app/', stack: ['Gemini AI', 'Framer', 'React'] },
  { id: 'naijabot', name: 'Naija Bot AI', description: 'Nigerian-context AI assistant with local tone and slang awareness.', url: 'https://naija-bot.vercel.app/', stack: ['OpenAI', 'NLP', 'Vite'] },
  { id: 'loading', name: 'Loading Systems', description: 'Polished loading animations and motion UI kit.', url: 'https://loading-screen-1.vercel.app/', stack: ['GSAP', 'SVG', 'Motion'] },
  { id: 'cydemy', name: 'Cydemy', description: 'Learning platform for engineering and design courses.', url: 'https://cydemy.vercel.app/', stack: ['Next.js', 'LMS', 'Tailwind'] },
  { id: 'adex', name: 'Adex Concerns', description: 'Corporate site and ops showcase for professional services.', url: 'https://adexconcerns.vercel.app/', stack: ['React', 'Business', 'Corporate'] },
  { id: 'ajosafe', name: 'AjoSafe', description: 'Digital thrift circles with automatic cycles and live sync.', url: 'https://ajosafe.vercel.app/', stack: ['PWA', 'Supabase', 'Fintech'] },
  { id: 'cysolfa', name: 'CySolfa', description: 'Interactive Tonic Solfa learning for choirs and students.', url: 'https://cysolfa.vercel.app/', stack: ['Audio API', 'React', 'Education'] },
  { id: 'edumati', name: 'Edumati', description: 'School materials hub with browse and manage dashboard.', url: 'https://edumati.vercel.app/', stack: ['Resources', 'Vite', 'Dashboard'] },
];

export const allSkills = [...new Set(skillGroups.flatMap((g) => g.skills))];

export function buildPortfolioContext() {
  const projectBlock = projects
    .map((p) => `- id:${p.id} | ${p.name}: ${p.description} Stack: ${p.stack.join(', ')} URL: ${p.url}`)
    .join('\n');
  const skillBlock = skillGroups.map((g) => `${g.title}: ${g.skills.join(', ')}`).join('\n');

  return `
Name: ${site.name}
Title: ${site.title}
Location: ${site.location}
Email: ${site.email}
Summary: ${site.summary}

Skills:
${skillBlock}

Projects (use exact id values in matchedProjects):
${projectBlock}
`.trim();
}

export function buildCyderPrompt(mode) {
  const modeGuide =
    mode === 'hire'
      ? 'Visitor wants to hire Michael. Emphasize production delivery, stack fit, and fastest path to value.'
      : mode === 'collab'
        ? 'Visitor wants to collaborate. Emphasize complementary skills, open-source energy, and Nigerian-context product sense.'
        : 'Visitor wants to learn from Michael. Emphasize teaching experience, curriculum design, and approachable AI/web paths.';

  return `You are Cyder AI — Michael Dosumu's portfolio match engine (NOT a generic chatbot).
Your job: given a visitor intent and need, return a JSON match that remaps the portfolio UI.

${modeGuide}

Grounding rules:
- Only recommend projects/skills that exist in the portfolio context below.
- matchedProjects must use exact project id strings from the list.
- matchedSkills must use exact skill name strings from the list.
- fitScore is 0-100 integer.
- pitch: 2-3 punchy sentences, confident, no fluff.
- nextAction: one concrete CTA (e.g. "Open Contact and mention BioByte").
- Prefer 2-3 projects and 3-6 skills max.
- If the ask is unrelated, still pick the closest honest fit and lower the score.

Return ONLY valid JSON matching this schema:
{
  "pitch": string,
  "fitScore": number,
  "matchedProjects": string[],
  "matchedSkills": string[],
  "nextAction": string
}

PORTFOLIO CONTEXT:
${buildPortfolioContext()}`;
}

export function sanitizeMatch(raw) {
  const obj = typeof raw === 'object' && raw !== null ? raw : {};
  const projectIds = new Set(projects.map((p) => p.id));
  const skillSet = new Set(allSkills);

  const matchedProjects = Array.isArray(obj.matchedProjects)
    ? obj.matchedProjects.filter((id) => typeof id === 'string' && projectIds.has(id)).slice(0, 3)
    : [];

  const matchedSkills = Array.isArray(obj.matchedSkills)
    ? obj.matchedSkills.filter((s) => typeof s === 'string' && skillSet.has(s)).slice(0, 6)
    : [];

  const fitScore =
    typeof obj.fitScore === 'number' ? Math.max(0, Math.min(100, Math.round(obj.fitScore))) : 50;

  return {
    pitch:
      typeof obj.pitch === 'string' && obj.pitch.trim()
        ? obj.pitch.trim().slice(0, 600)
        : 'Michael is a strong fit for practical AI-augmented frontend work.',
    fitScore,
    matchedProjects: matchedProjects.length > 0 ? matchedProjects : [projects[0]?.id ?? 'naijabot'],
    matchedSkills:
      matchedSkills.length > 0
        ? matchedSkills
        : ['React.js', 'Next.js', 'Groq API'].filter((s) => skillSet.has(s)),
    nextAction:
      typeof obj.nextAction === 'string' && obj.nextAction.trim()
        ? obj.nextAction.trim().slice(0, 200)
        : 'Open Contact and share your brief.',
  };
}
