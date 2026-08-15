import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ContactModal from './components/ContactModal';
import StatsBar from './components/StatsBar';
import HeroMotion from './components/HeroMotion';
import HeroText from './components/HeroText';
import { PROJECT_SLUGS } from './data/projectIds';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Navbar } from './components/Navbar';
import { AiStudioPage } from './pages/AiStudioPage';
import { ExternalLink, Github, Eye, Code2, Cpu, Globe2, ArrowRight } from 'lucide-react';
import './index.css';

const skillCategories = [
  {
    title: 'Frontend & Motion',
    icon: Code2,
    skills: ['React / Next.js', 'Three.js / WebGL', 'Framer Motion / GSAP', 'TypeScript'],
    desc: 'Building responsive, high-performance interfaces with modern animations and fluid interactions.',
  },
  {
    title: 'AI & Smart Tools',
    icon: Cpu,
    skills: ['Python / LLM Workflows', 'Generative AI Integration', 'NLP & Vector Search', 'Automation Tools'],
    desc: 'Integrating intelligence directly into applications to solve practical workflow challenges.',
  },
  {
    title: 'Architecture & Infra',
    icon: Globe2,
    skills: ['Fintech PWAs', 'Supabase / Node.js', 'SQL / Real-time APIs', 'Cloud Infrastructure'],
    desc: 'Engineering resilient backends, reliable data models, and progressive web apps built for scale.',
  },
];

const projectData = [
  { id: '01', title: 'Doorstep', type: 'Utility / P2P', desc: 'Instant offline file sharing between phone and computer. Pair once with a QR code, drop files into a folder, and receive them automatically with zero cloud or internet needed.', url: 'https://javex-12.github.io/Doorstep/', githubUrl: 'https://github.com/javex-12/Doorstep.git', tags: ['P2P Transfer', 'QR Sync', 'Cross-Platform'], isPremium: true },
  { id: '02', title: 'SwiftLink Pro', type: 'Commerce', desc: 'Turn WhatsApp chats into an online storefront in under a minute. Designed for digital vendors and local businesses.', url: 'https://swiftlinkpro.vercel.app/', tags: ['Next.js', 'WhatsApp API', 'E-Commerce'], isPremium: true },
  { id: '03', title: 'BioByte Pro', type: 'Education', desc: 'Interactive WAEC Biology exam practice platform with 120+ structured study modules and detailed student progress analytics.', url: 'https://biobyte.vercel.app/', tags: ['React', 'LMS', 'PWA'], isPremium: true },
  { id: '04', title: 'Chaotic Shift', type: 'AI / Interactive', desc: 'An interactive web experience pairing Google Gemini AI with physics-driven interface dynamics.', url: 'https://cyswitch.vercel.app/', tags: ['Gemini AI', 'Framer Motion', 'React'], isPremium: true },
  { id: '05', title: 'Naija Bot AI', type: 'AI Assistant', desc: 'AI assistant tailored for Nigerian context — understanding local nuances, slang, and localized problem solving.', url: 'https://naija-bot.vercel.app/', tags: ['OpenAI', 'NLP', 'Vite'], isPremium: true },
  { id: '06', title: 'Loading Systems', type: 'UI Library', desc: 'Curated collection of micro-animations, loading spinners, and motion components for web applications.', url: 'https://loading-screen-1.vercel.app/', tags: ['GSAP', 'SVG', 'Design System'], isPremium: true },
  { id: '07', title: 'Cydemy', type: 'Education', desc: 'Clean learning management platform tailored for technical engineering and design courses.', url: 'https://cydemy.vercel.app/', tags: ['Next.js', 'LMS', 'Tailwind'], isPremium: true },
  { id: '08', title: 'Adex Concerns', type: 'Corporate', desc: 'Minimalist corporate showcase and ops portal for a professional engineering services firm.', url: 'https://adexconcerns.vercel.app/', tags: ['React', 'Corporate', 'Tailwind'], isPremium: true },
  { id: '09', title: 'AjoSafe', type: 'Fintech', desc: 'Digital thrift (Ajo) community savings circle platform with automated payouts and real-time ledger tracking.', url: 'https://ajosafe.vercel.app/', tags: ['PWA', 'Supabase', 'Fintech'], isPremium: false },
  { id: '10', title: 'CySolfa', type: 'Music Tech', desc: 'Interactive Tonic Solfa pitch training tool for vocalists, choir directors, and music students.', url: 'https://cysolfa.vercel.app/', tags: ['Web Audio API', 'React', 'EdTech'], isPremium: false },
];

const metaCards = [
  { k: 'Core Stack', v: 'TypeScript · React · Next.js · AI' },
  { k: 'Focus Areas', v: 'Fintech PWAs · AI Features · EdTech' },
  { k: 'Location', v: 'Lagos, Nigeria · UTC+1' },
];

const faqItems = [
  {
    q: 'Who is Dosumu Michael (CyderCoder)?',
    a: 'Dosumu Michael, known professionally as CyderCoder, is a full-stack software developer and AI product engineer based in Lagos, Nigeria. He specializes in React, Next.js, AI integrations, and high-performance web applications.',
  },
  {
    q: 'What stack and tools do you use?',
    a: 'My core stack includes React, Next.js, TypeScript, Node.js, Python, Supabase, Tailwind CSS, GSAP/Framer Motion, and LLM API integrations (OpenAI, Gemini).',
  },
  {
    q: 'Are you available for contract or full-time roles?',
    a: 'Yes. I am open to freelance projects, contract engagements, and full-stack engineering roles globally (remote). Contact via WhatsApp (+234 808 574 1430) or email michaeldosunmu22@gmail.com.',
  },
  {
    q: 'What kind of AI features can you build?',
    a: 'I build practical AI product capabilities: real-time streaming chat, document Q&A, context-aware assistants, vector search, automated scoping tools, and generative UI workflows.',
  },
];

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDemoIdx, setActiveDemoIdx] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const siteReady = !isLoading;
  useScrollReveal(siteReady);

  useEffect(() => {
    if (activeDemoIdx !== null || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDemoIdx, isModalOpen]);

  const handleSendWhatsApp = (msg) => {
    window.open(`https://wa.me/2348085741430?text=${encodeURIComponent(msg)}`, '_blank');
    setIsModalOpen(false);
  };

  const openDemo = (i) => setActiveDemoIdx(i);
  const closeDemo = () => setActiveDemoIdx(null);

  // Separate AI Lab Page
  if (currentPath === '/ai') {
    return (
      <AiStudioPage
        onNavigateHome={() => navigate('/')}
        onOpenContact={() => setIsModalOpen(true)}
      />
    );
  }

  // Home Page
  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <Navbar
          onOpenContact={() => setIsModalOpen(true)}
          activeSection="home"
          onNavigate={navigate}
        />
      )}

      {/* Live Preview Modal */}
      {activeDemoIdx !== null && (
        <div
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Project live preview"
        >
          <div className="bg-[#0d131a] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                {projectData[activeDemoIdx].url}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={projectData[activeDemoIdx].url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 no-underline"
              >
                <span>Open site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20 font-mono text-xs hover:bg-white/20"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={closeDemo}
                className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-mono text-xs font-semibold hover:bg-white/30"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-black">
            <iframe
              key={reloadKey}
              src={projectData[activeDemoIdx].url}
              className="w-full h-full border-none absolute inset-0"
              title={projectData[activeDemoIdx].title}
              allow="autoplay; clipboard-write; encrypted-media"
              loading="eager"
            />
          </div>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendWhatsApp}
        initialMessage="Hey Michael — I saw your portfolio and wanted to discuss a project."
      />

      {/* Main Shell */}
      <div
        className={`site-shell min-h-screen transition-opacity duration-500 ${
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
        }}
      >
        <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-24 md:space-y-36">
          
          {/* Hero Section */}
          <section id="home" className="relative pt-8 md:pt-16 pb-8">
            <HeroMotion />

            <div className="relative z-10 space-y-8 max-w-4xl">
              {/* Availability pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-xs tracking-wider uppercase font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Full-Stack Developer · Lagos, Nigeria</span>
              </div>

              <HeroText ready={siteReady} />

              <p className="text-lg sm:text-xl font-normal leading-relaxed max-w-2xl" style={{ color: 'var(--theme-text-muted)' }}>
                Hey — I&apos;m <strong className="font-semibold" style={{ color: 'var(--theme-text)' }}>Dosumu Michael</strong> (<span className="text-orange-400 font-mono">CyderCoder</span>).
                I engineer fast React/Next.js platforms, AI product integrations, and scalable fintech PWAs focused on clean architecture and human-friendly UI.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-mono text-xs font-semibold uppercase tracking-wider no-underline transition-all shadow-lg shadow-orange-950/40 hover:scale-[1.02]"
                >
                  Explore Selected Work →
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/ai')}
                  className="px-6 py-3.5 rounded-xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 hover:bg-orange-500/10 hover:border-orange-500/30"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  <span>AI Engineering Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Hire Me
                </button>
              </div>

              {/* Meta Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                {metaCards.map((card) => (
                  <div key={card.k} className="p-4 rounded-2xl border transition-all hover:border-orange-500/30" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-1 font-semibold">
                      {card.k}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{card.v}</span>
                  </div>
                ))}
              </div>

              <StatsBar />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">01 · About</span>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight" style={{ color: 'var(--theme-text)' }}>
                Engineering with purpose.
              </h2>
            </div>
            <div className="max-w-3xl space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
              <p>
                I&apos;m a software engineer based in Lagos, Nigeria with over 10+ shipped production applications.
                I build tools that solve genuine user problems — from offline P2P file transfers and WhatsApp commerce to exam practice applications and community fintech savings circles.
              </p>
              <p>
                Whether it&apos;s crafting fluid interactive user interfaces with React and Next.js or wiring modern LLMs into automated workflows, I focus on clean maintainable code, high performance, and reliable infrastructure.
              </p>
            </div>
          </section>

          {/* Skills & Services Section */}
          <section id="skills" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">02 · Expertise</span>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight" style={{ color: 'var(--theme-text)' }}>
                Capabilities &amp; Stack
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="p-6 sm:p-8 rounded-2xl border transition-all flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/20"
                    style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>{cat.title}</h3>
                      <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{cat.desc}</p>
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                      {cat.skills.map((s) => (
                        <li key={s} className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Selected Projects Section */}
          <section id="projects" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--theme-border)' }}>
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">03 · Portfolio</span>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight mt-1" style={{ color: 'var(--theme-text)' }}>
                  Selected Works
                </h2>
              </div>
              <span className="font-mono text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                Showing {projectData.length} production applications
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectData.map((proj, i) => (
                <article
                  key={proj.id}
                  className="p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/20"
                  style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-orange-400">{proj.id}</span>
                      <div className="flex items-center gap-2">
                        {proj.isPremium && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-semibold uppercase">
                            Featured
                          </span>
                        )}
                        <span className="font-mono text-[10px] uppercase border px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}>
                          {proj.type}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors" style={{ color: 'var(--theme-text)' }}>
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline group-hover:text-orange-400"
                        style={{ color: 'var(--theme-text)' }}
                      >
                        {proj.title}
                      </a>
                    </h3>

                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--theme-text-muted)' }}>
                      {proj.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border"
                          style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                    <button
                      type="button"
                      onClick={() => openDemo(i)}
                      className="flex-1 py-2 px-3 rounded-lg border font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/30"
                      style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 no-underline transition-all hover:from-orange-500 hover:to-amber-500 shadow-sm"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border no-underline transition-all hover:border-orange-500/30 hover:bg-orange-500/10"
                        style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">04 · Questions</span>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight" style={{ color: 'var(--theme-text)' }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="p-6 rounded-2xl border group cursor-pointer transition-all hover:border-orange-500/30"
                  style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
                >
                  <summary className="font-bold text-lg flex items-center justify-between gap-4 list-none" style={{ color: 'var(--theme-text)' }}>
                    <span>{item.q}</span>
                    <span className="font-mono text-orange-400 text-sm group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--theme-text-muted)' }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Contact CTA Banner */}
          <section id="contact" className="scroll-mt-24">
            <div className="p-8 sm:p-12 rounded-3xl border relative overflow-hidden space-y-6 shadow-2xl shadow-black/40" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold">Let&apos;s Connect</span>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold leading-tight" style={{ color: 'var(--theme-text)' }}>
                  Have a project in mind? Let&apos;s build it.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  Open for freelance builds, full-stack web applications, AI integrations, or contract engineering roles.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-950/40 cursor-pointer hover:scale-[1.02]"
                  >
                    Start a Conversation →
                  </button>
                </div>
              </div>

              {/* Direct links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                <a
                  href="https://wa.me/2348085741430"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border no-underline transition-all hover:border-orange-500/40 hover:bg-orange-500/5"
                  style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
                >
                  <span className="block font-mono text-[10px] uppercase text-orange-400 font-semibold">WhatsApp</span>
                  <span className="text-sm font-semibold">+234 808 574 1430</span>
                </a>
                <a
                  href="mailto:michaeldosunmu22@gmail.com"
                  className="p-4 rounded-xl border no-underline transition-all hover:border-orange-500/40 hover:bg-orange-500/5"
                  style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
                >
                  <span className="block font-mono text-[10px] uppercase text-orange-400 font-semibold">Email</span>
                  <span className="text-sm font-semibold truncate block">michaeldosunmu22@gmail.com</span>
                </a>
                <a
                  href="https://github.com/javex-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border no-underline transition-all hover:border-orange-500/40 hover:bg-orange-500/5"
                  style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
                >
                  <span className="block font-mono text-[10px] uppercase text-orange-400 font-semibold">GitHub</span>
                  <span className="text-sm font-semibold">github.com/javex-12</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-12" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="font-display font-bold text-lg" style={{ color: 'var(--theme-text)' }}>
                CYDER<span className="text-orange-500">CODER</span>
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                © 2026 Dosumu Michael · Full-Stack Developer, Lagos Nigeria
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-4 font-mono text-xs" style={{ color: 'var(--theme-text-muted)' }}>
              <a href="#about" className="hover:text-orange-400 no-underline transition-colors">About</a>
              <a href="#skills" className="hover:text-orange-400 no-underline transition-colors">Skills</a>
              <button type="button" onClick={() => navigate('/ai')} className="hover:text-orange-400 bg-transparent border-0 font-mono text-xs cursor-pointer p-0 transition-colors" style={{ color: 'var(--theme-text-muted)' }}>AI Lab</button>
              <a href="#projects" className="hover:text-orange-400 no-underline transition-colors">Work</a>
              <a href="#faq" className="hover:text-orange-400 no-underline transition-colors">FAQ</a>
              <a href="https://github.com/javex-12" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 no-underline transition-colors">GitHub</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
