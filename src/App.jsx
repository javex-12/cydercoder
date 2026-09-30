import React, { useState, useEffect } from 'react';

const featuredProjects = [
  {
    id: 'doorstep',
    title: 'Doorstep',
    year: '2025',
    tagline: 'Send files from your phone to your laptop. No cable, no WhatsApp, no internet data.',
    description:
      'You scan a code on your screen with your phone, and the file moves across — instantly, directly. No uploading to Google Drive, no sending it to yourself on WhatsApp. Works on any Wi-Fi, completely private.',
    stack: 'WebRTC · Vanilla JS · PWA',
    liveUrl: 'https://trydoorstep.vercel.app',
    githubUrl: 'https://github.com/javex-12/Doorstep.git',
  },
  {
    id: 'swiftlink',
    title: 'SwiftLink Pro',
    year: '2025',
    tagline: 'A real shop page for people selling on WhatsApp.',
    description:
      'If you sell clothes, shoes, or food on WhatsApp, SwiftLink gives you a clean shop page in under a minute. Your customer browses, picks what they want, and the order lands straight in your WhatsApp — formatted and clear. No back-and-forth.',
    stack: 'Next.js · React · Tailwind CSS',
    liveUrl: 'https://swiftlinkpro.vercel.app/',
  },
  {
    id: 'biobyte',
    title: 'BioByte Pro',
    year: '2025',
    tagline: 'WAEC Biology practice that works even when your data finishes.',
    description:
      'A study app for secondary school students preparing for WAEC. Past questions, topic-by-topic drills, instant explanations — all of it works offline. You download once, you study anytime.',
    stack: 'React · Service Workers · IndexedDB',
    liveUrl: 'https://biobyte.vercel.app/',
  },
  {
    id: 'ajosafe',
    title: 'AjoSafe',
    year: '2025',
    tagline: 'Digital records for your Ajo or Esusu savings group.',
    description:
      'Keeps track of who paid, who is next to collect, and the full contribution history — so nobody is arguing over a paper book. Built directly with Ajo coordinators who were tired of disputes.',
    stack: 'Supabase · PostgreSQL · PWA',
    liveUrl: 'https://ajosafe.vercel.app/',
  },
  {
    id: 'naijabot',
    title: 'Naija Bot',
    year: '2024',
    tagline: 'A chatbot that understands how Nigerians actually talk.',
    description:
      'Most AI assistants trip over Pidgin, local slang, and Nigerian context. This one was built for exactly that — tested with real phrases, real scenarios, real humour.',
    stack: 'React · OpenAI API · Streaming UI',
    liveUrl: 'https://naija-bot.vercel.app/',
  },
  {
    id: 'chaoticshift',
    title: 'Chaotic Shift',
    year: '2024',
    tagline: 'An experiment — AI answers that move and bounce on screen like physics.',
    description:
      'Instead of a boring chat box, the AI\'s response breaks apart into words that fly around the screen and react to each other. A creative experiment in how AI output can look and feel different.',
    stack: 'React · Google Gemini API · Canvas',
    liveUrl: 'https://cyswitch.vercel.app/',
  },
];

const collaborations = [
  {
    group: 'WhatsApp vendors and market sellers',
    summary:
      'Sat with sellers in Lagos, watched how they take orders on WhatsApp, and built SwiftLink around their exact problems. They tested every version. The checkout flow they use now took four rounds of feedback to get right.',
  },
  {
    group: 'Secondary school students and biology tutors',
    summary:
      'Worked with teachers and students preparing for WAEC to check that every module in BioByte Pro was accurate and actually useful — not just copied from a textbook.',
  },
  {
    group: 'Ajo and Esusu group coordinators',
    summary:
      'Designed AjoSafe side by side with savings circle managers. They showed me exactly how disputes happen in paper-based groups, and that shaped every feature in the app.',
  },
  {
    group: 'Choir singers and music directors',
    summary:
      'Built CySolfa with choir members who needed a quick, phone-friendly tool for Tonic Solfa practice. Their feedback made it simpler and faster than the first version.',
  },
];

const other = [
  { title: 'Loading Systems', desc: 'A set of 20+ small animated loading indicators. Lightweight and easy to drop into any project.', url: 'https://loading-screen-1.vercel.app/' },
  { title: 'Cydemy', desc: 'A clean course platform for reading and watching technical content without distractions.', url: 'https://cydemy.vercel.app/' },
  { title: 'Adex Concerns', desc: 'Website for a technical engineering firm — clean, professional, inquiry-focused.', url: 'https://adexconcerns.vercel.app/' },
  { title: 'CySolfa', desc: 'A practice tool for choir singers who want to train their ear and read Tonic Solfa on the go.', url: 'https://cysolfa.vercel.app/' },
];

const TICKER_ITEMS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'WebRTC', 'Web Audio API',
  'Supabase', 'PostgreSQL', 'IndexedDB', 'Service Workers', 'Tailwind CSS',
  'Python', 'Machine Learning', 'Canvas API', 'PWA', 'REST APIs',
];

function ProjectRow({ project, index, expanded, onToggle }) {
  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left py-5 flex items-baseline gap-4 group focus:outline-none"
      >
        <span className="font-mono text-xs text-neutral-700 w-5 shrink-0 pt-px">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 min-w-0 space-y-0.5">
          <span className="block text-base font-semibold text-neutral-200 group-hover:text-white transition-colors">
            {project.title}
          </span>
          <span className="block text-sm text-neutral-600">{project.tagline}</span>
        </span>
        <span className="flex items-center gap-3 shrink-0 ml-2">
          <span className="font-mono text-xs text-neutral-700 hidden sm:block">{project.year}</span>
          <span
            className={`text-neutral-500 transition-transform duration-200 text-lg leading-none ${
              expanded ? 'rotate-45' : 'group-hover:text-neutral-300'
            }`}
          >
            ↗
          </span>
        </span>
      </button>

      {expanded && (
        <div className="pl-9 pb-6 space-y-4">
          <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">{project.description}</p>
          <p className="font-mono text-xs text-neutral-700">{project.stack}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              Open live ↗
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-700 text-neutral-400 text-xs hover:text-white hover:border-neutral-500 transition-colors"
              >
                Source code
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const App = () => {
  const [copied, setCopied]           = useState(false);
  const [timeString, setTimeString]   = useState('');
  const [expandedId, setExpandedId]   = useState(null);

  useEffect(() => {
    const tick = () =>
      setTimeString(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('michaeldosunmu22@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#e4e4e7] font-sans antialiased selection:bg-neutral-800">

      {/* ── STICKY TOP BAR ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/60 bg-[#0d0d0f]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.jpg" alt="CyderCoder logo" className="w-7 h-7 rounded-md" />
            <span className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-300 transition-colors">Dosumu Michael</span>
          </a>
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:block">Lagos · WAT</span>
            <span className="text-neutral-400">{timeString}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="pt-16 pb-12 space-y-6">
          <div className="overflow-hidden">
            <h1
              className="font-display text-[clamp(3.5rem,12vw,7rem)] font-black leading-none tracking-tight text-white uppercase"
              style={{ letterSpacing: '-0.03em' }}
            >
              CYDER
              <span className="text-[#D4653A]">.</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl">
            I make web apps and digital tools. Based in Lagos. Most of my work is for
            real people with real problems — market sellers, students, savings groups,
            musicians. If a problem can be solved with a good website or app, I build it.
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://github.com/javex-12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://wa.me/2348085741430"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              WhatsApp ↗
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer font-mono"
            >
              {copied ? '✓ copied' : 'Email'}
            </button>
          </div>
        </section>

        {/* ── SCROLLING TICKER ───────────────────────────────────────── */}
        <div className="relative -mx-5 sm:-mx-8 overflow-hidden border-y border-neutral-800/60 py-3 mb-16 select-none">
          <div
            className="flex gap-8 whitespace-nowrap"
            style={{ animation: 'ticker 28s linear infinite', width: 'max-content' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-xs font-mono text-neutral-600 uppercase tracking-widest">
                {item}
                <span className="ml-8 text-neutral-800">·</span>
              </span>
            ))}
          </div>
          <style>{`
            @keyframes ticker {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* ── WORK ───────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest">Work</h2>
            <span className="text-xs font-mono text-neutral-800">{featuredProjects.length} projects</span>
          </div>
          <div className="border-t border-neutral-800">
            {featuredProjects.map((p, i) => (
              <ProjectRow
                key={p.id}
                project={p}
                index={i}
                expanded={expandedId === p.id}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </div>
        </section>

        {/* ── COLLABS ────────────────────────────────────────────────── */}
        <section className="mb-20 space-y-8">
          <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest">Who I've worked with</h2>
          {collaborations.map((c) => (
            <div key={c.group} className="space-y-1.5">
              <span className="text-sm font-semibold text-neutral-300">{c.group}</span>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">{c.summary}</p>
            </div>
          ))}
        </section>

        {/* ── OTHER ──────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-4">Other things I built</h2>
          <div className="divide-y divide-neutral-800/50 border-t border-b border-neutral-800/50">
            {other.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 py-4 group"
              >
                <div className="min-w-0">
                  <span className="text-sm text-neutral-300 group-hover:text-white transition-colors block">{item.title}</span>
                  <span className="text-xs text-neutral-600 block mt-0.5">{item.desc}</span>
                </div>
                <span className="text-neutral-700 group-hover:text-neutral-400 transition-colors shrink-0 text-sm">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────────────── */}
        <section className="mb-20 space-y-3">
          <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest">About me</h2>
          <div className="space-y-3 text-sm text-neutral-500 leading-relaxed">
            <p>
              I'm a software and machine learning engineer. I like building things
              that actually get used — apps that work on slow internet, that make
              sense to first-time users, that solve a problem people actually have.
            </p>
            <p>
              I work with React, Next.js, Node.js, and Python. Most of my recent
              projects are offline-first: they load once and keep working even when
              you lose your connection.
            </p>
            <p>
              Open to freelance work, contracts, and full-time roles. Worldwide.
            </p>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────── */}
        <section className="mb-20 space-y-3">
          <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest">Get in touch</h2>
          <button
            type="button"
            onClick={copyEmail}
            className="block text-sm font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? '✓ copied to clipboard' : 'michaeldosunmu22@gmail.com'}
          </button>
          <a
            href="https://wa.me/2348085741430"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            +234 808 574 1430 · WhatsApp
          </a>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer className="border-t border-neutral-800/50 py-6 flex items-center justify-between text-xs font-mono text-neutral-700">
          <span>© 2025 Dosumu Michael</span>
          <span>Lagos, NG</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
