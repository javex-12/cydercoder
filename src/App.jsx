import React, { useState } from 'react';

const ORANGE = '#F15A22';
const INDIGO = '#3730A3';

const featuredProjects = [
  {
    id: 'transformer-lm',
    title: 'Custom AI Model (From Scratch)',
    year: 'Still building',
    tag: 'Still building',
    tagline: 'An AI text model I am training from scratch that beats GPT-2 on BPB.',
    description:
      'I wanted to see if I could build a language model from scratch on my own. I wrote the code in Python and PyTorch and am currently training it. On the BPB test (which measures how well a model predicts text), it scores better than GPT-2.',
    stack: 'Python · PyTorch · GPU',
  },
  {
    id: 'doorstep',
    title: 'Doorstep',
    year: '2025',
    tag: 'Mobile & Computer App',
    tagline: 'Send files between your phone and laptop without internet or cables.',
    description:
      'Moves files directly over Wi-Fi without using your mobile data or uploading to the cloud. You download the app on your phone (Android) and your computer (Windows, Mac, or Linux), scan a QR code, and send your files straight across.',
    stack: 'Flutter · Android · Windows · Mac · Linux',
    liveUrl: 'https://trydoorstep.vercel.app',
    liveLabel: 'Download the Apps ↗',
    githubUrl: 'https://github.com/javex-12/Doorstep.git',
  },
  {
    id: 'swiftlink',
    title: 'SwiftLink Pro',
    year: '2025',
    tag: 'Online Stores',
    tagline: 'A simple online shop for anyone selling products on WhatsApp.',
    description:
      'Gives WhatsApp sellers a clean website where customers can view products with prices, add items to a cart, and click checkout. The formatted order goes straight into the seller’s WhatsApp ready to deliver.',
    stack: 'Next.js · React · WhatsApp',
    liveUrl: 'https://swiftlinkpro.vercel.app/',
    liveLabel: 'View Live Store ↗',
  },
  {
    id: 'biobyte',
    title: 'BioByte Pro',
    year: '2025',
    tag: 'Education',
    tagline: 'WAEC Biology study app that works even without internet data.',
    description:
      'A study tool for secondary school students preparing for WAEC exams. Has over 100 past questions, topic tests, and explanations that keep working even when you run out of data.',
    stack: 'React · Works Offline',
    liveUrl: 'https://biobyte.vercel.app/',
    liveLabel: 'Try the App ↗',
  },
  {
    id: 'ajosafe',
    title: 'AjoSafe',
    year: '2025',
    tag: 'Group Savings',
    tagline: 'A digital record book for Ajo and Esusu savings groups.',
    description:
      'Replaces paper notebooks for group savings circles. Keeps clear records of who paid, who is next to collect, and the full payment history so members do not argue over money.',
    stack: 'Next.js · Database',
    liveUrl: 'https://ajosafe.vercel.app/',
    liveLabel: 'Open App ↗',
  },
  {
    id: 'naijabot',
    title: 'Naija Bot',
    year: '2024',
    tag: 'Chatbot',
    tagline: 'A chatbot that understands Nigerian Pidgin and local slang.',
    description:
      'A chatbot that actually understands how Nigerians talk in daily life — local idioms, street slang, and Pidgin included.',
    stack: 'React · AI',
    liveUrl: 'https://naija-bot.vercel.app/',
    liveLabel: 'Chat with it ↗',
  },
  {
    id: 'chaoticshift',
    title: 'Chaotic Shift',
    year: '2024',
    tag: 'Interactive',
    tagline: 'AI words that bounce around the screen like balls.',
    description:
      'An experiment where words from an AI response break apart into moving pieces that bounce off each other and react to your mouse.',
    stack: 'React · Physics Canvas',
    liveUrl: 'https://cyswitch.vercel.app/',
    liveLabel: 'Play with it ↗',
  },
];

const collaborations = [
  {
    group: 'Market Sellers and WhatsApp Vendors',
    summary:
      'I spoke with sellers in Lagos, watched how they take orders in WhatsApp chats, and built SwiftLink around what they needed.',
  },
  {
    group: 'WAEC Students and Teachers',
    summary:
      'I worked with secondary school teachers and students to verify that the biology questions and explanations in BioByte were accurate.',
  },
  {
    group: 'Savings Group Coordinators',
    summary:
      'I talked with people who manage Ajo savings groups to learn how disputes happen with paper books, which helped me build AjoSafe.',
  },
  {
    group: 'Choir Members',
    summary:
      'Built CySolfa with singers who needed a simple phone app to practice their Tonic Solfa notes on the go.',
  },
];

const other = [
  { title: 'Loading Systems', desc: 'Over 20 animated loading icons for websites.', url: 'https://loading-screen-1.vercel.app/' },
  { title: 'Cydemy', desc: 'A clean reading and video tutorial platform.', url: 'https://cydemy.vercel.app/' },
  { title: 'Adex Concerns', desc: 'Website for an engineering consultancy company.', url: 'https://adexconcerns.vercel.app/' },
  { title: 'CySolfa', desc: 'Practice tool for choir singers on their phones.', url: 'https://cysolfa.vercel.app/' },
];

const TICKER_ITEMS = [
  'Python', 'PyTorch', 'Flutter', 'Dart', 'React', 'Next.js',
  'TypeScript', 'JavaScript', 'Node.js', 'PostgreSQL', 'WebRTC',
  'Tailwind CSS', 'Mobile Apps', 'Web Apps',
];

/* ── PENCIL UNDERLINE (RESPONSIVE, STOPS EXACTLY UNDER MICHAEL) ───────────── */
function PencilUnderline() {
  return (
    <svg
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      className="w-full h-full block"
      aria-hidden="true"
    >
      <path
        d="M2,6 C30,2 65,10 100,5 C135,1 175,9 215,5 C255,1 295,9 335,5 C365,2 385,7 398,5"
        stroke="#F15A22"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 500,
          strokeDashoffset: 500,
          animation: 'draw-line 1s ease 0.2s forwards',
        }}
      />
      <path
        d="M4,9 C35,6 70,11 105,8 C145,5 185,10 225,7 C265,4 305,10 345,7 C375,5 388,8 396,8"
        stroke="#F15A22"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
        style={{
          strokeDasharray: 500,
          strokeDashoffset: 500,
          animation: 'draw-line 1.2s ease 0.3s forwards',
        }}
      />
    </svg>
  );
}

/* ── SOFT MARKER HIGHLIGHT ───────────────────────────────────────────────── */
function Highlight({ children }) {
  return (
    <span className="relative inline-block font-semibold text-gray-900">
      <span
        className="absolute inset-0 -skew-x-2 rounded-sm"
        style={{
          background: '#FFE8DE',
          top: '12%',
          bottom: '2%',
          left: '-3px',
          right: '-3px',
        }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/* ── PROJECT ROW ─────────────────────────────────────────────────────────── */
function ProjectRow({ project, index, expanded, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left py-4 sm:py-5 flex items-start sm:items-baseline gap-3 sm:gap-4 group focus:outline-none"
      >
        <span
          className="font-mono text-xs w-6 shrink-0 mt-1 sm:mt-0 font-bold"
          style={{ color: ORANGE }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-baseline gap-2 mb-1">
            <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#F15A22] transition-colors">
              {project.title}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ background: project.tag === 'Still building' ? ORANGE : INDIGO }}
            >
              {project.tag}
            </span>
          </span>
          <span className="block text-sm text-gray-600 leading-snug">{project.tagline}</span>
        </span>

        <span className="flex items-center gap-3 shrink-0 ml-2">
          <span className="font-mono text-xs text-gray-400 hidden sm:block">{project.year}</span>
          <span
            className={`text-lg leading-none transition-transform duration-200 ${
              expanded ? 'rotate-45 text-[#F15A22]' : 'text-gray-300 group-hover:text-[#F15A22]'
            }`}
          >
            ↗
          </span>
        </span>
      </button>

      {expanded && (
        <div className="pl-9 sm:pl-10 pb-6 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed max-w-xl">{project.description}</p>
          <p className="font-mono text-xs text-gray-400 font-medium">Built with: {project.stack}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: ORANGE }}
              >
                {project.liveLabel || 'Open Live App ↗'}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:border-gray-500 hover:text-gray-900 transition-colors bg-white shadow-sm"
              >
                View Code on GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const App = () => {
  const [copied, setCopied]         = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('michaeldosunmu22@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-orange-100 overflow-x-hidden w-full">

      {/* ── TOP BAR (CLEAN & MINIMAL) ────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.jpg" alt="CyderCoder" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-bold text-gray-900 group-hover:text-[#F15A22] transition-colors tracking-tight">
              Dosumu Michael
            </span>
          </a>
        </div>
      </header>

      {/* ── NAMEPLATE ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-4 w-full">
        <h1
          className="font-display uppercase leading-[0.92] tracking-tight font-black select-none"
          style={{ fontSize: 'clamp(2.4rem, 9.5vw, 6.5rem)' }}
        >
          <span className="block text-gray-900">DOSUMU</span>
          {/* Constrained strictly to the text MICHAEL */}
          <span className="relative inline-block pb-1.5 sm:pb-3" style={{ color: ORANGE }}>
            <span className="relative z-10">MICHAEL</span>
            {/* SVG line terminates under the letter L */}
            <span className="absolute left-0 bottom-0 w-full h-[6px] sm:h-[10px] pointer-events-none">
              <PencilUnderline />
            </span>
          </span>
        </h1>

        {/* Clean, simple role and links strip (no messy badges) */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
          <p className="font-semibold text-gray-900">Software &amp; Machine Learning Engineer</p>
          <div className="flex items-center gap-4 font-mono text-xs text-gray-500">
            <a href="https://github.com/javex-12" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
              GitHub ↗
            </a>
            <a href="https://wa.me/2348085741430" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
              WhatsApp ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── BIO ──────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 w-full">
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl font-normal">
          I am a software engineer and machine learning builder based in Lagos.
          I build practical apps like Doorstep, simple online shops for vendors, and right now I am <Highlight>building an AI model from scratch</Highlight> that beats GPT-2 on BPB.
        </p>
      </section>

      {/* ── TICKER (INFINITE AUTOMATIC AUTO-SCROLLING BANNER) ─────────── */}
      <div
        className="w-full max-w-full overflow-hidden border-y border-gray-100 py-3 select-none"
        style={{ background: '#FFF8F5' }}
      >
        <div className="animate-ticker flex gap-8 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: ORANGE }}>
              {item}
              <span className="ml-8 text-orange-200">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">Things I have built</h2>
          <span className="text-xs font-mono text-gray-400">{featuredProjects.length} projects</span>
        </div>
        <div className="border-t border-gray-100">
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

      {/* ── REAL PEOPLE ──────────────────────────────────────────────── */}
      <section style={{ background: '#F9F7FF' }} className="py-12 sm:py-16 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest mb-6" style={{ color: INDIGO }}>
            Tested with real people
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {collaborations.map((c) => (
              <div key={c.group} className="space-y-1.5 bg-white p-5 rounded-2xl border border-indigo-50/50 shadow-sm">
                <span className="text-sm font-bold text-gray-900 block">{c.group}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER TOOLS ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-4">
          Other practical tools
        </h2>
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {other.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 py-4 group"
            >
              <div className="min-w-0">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#F15A22] transition-colors block">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 block mt-0.5">{item.desc}</span>
              </div>
              <span className="text-gray-300 group-hover:text-[#F15A22] transition-colors shrink-0 text-sm">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── ABOUT ME ─────────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F5' }} className="py-12 sm:py-16 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest mb-3" style={{ color: ORANGE }}>
            About me
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700 leading-relaxed">
            <p>
              My name is Dosumu Michael. I live in Lagos, Nigeria. I like building things from scratch — from training a model that beats GPT-2 on BPB, to building apps like Doorstep that transfer files between devices without internet.
            </p>
            <p>
              I build tools that save real people time and money. I work with clients, startups, and companies from anywhere in the world. Available for full-time roles, contract work, and freelance builds.
            </p>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ───────────────────────────────────────────── */}
      <section style={{ background: ORANGE }} className="py-12 sm:py-16 w-full text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Have a project in mind?<br />Let’s build it.
            </h2>
            <p className="text-orange-100 mt-1 text-sm">Available for work right now.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={copyEmail}
              className="px-6 py-3 bg-white font-bold text-sm rounded-full hover:bg-orange-50 transition-colors cursor-pointer text-center shadow-sm"
              style={{ color: ORANGE }}
            >
              {copied ? '✓ Email copied!' : 'Email me ↗'}
            </button>
            <a
              href="https://wa.me/2348085741430"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white text-white font-bold text-sm rounded-full hover:bg-white/15 transition-colors text-center"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER (KISS, DRY, NO REPETITION) ────────────────────────── */}
      <footer className="py-6 w-full text-center text-xs text-gray-400 font-mono">
        <p>© 2025 Dosumu Michael</p>
      </footer>
    </div>
  );
};

export default App;
