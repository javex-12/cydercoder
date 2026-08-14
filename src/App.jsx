import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ContactModal from './components/ContactModal';
import AiShowcase from './components/AiShowcase';
import StatsBar from './components/StatsBar';
import HeroMotion from './components/HeroMotion';
import HeroText from './components/HeroText';
import { PROJECT_SLUGS } from './data/projectIds';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Navbar } from './components/Navbar';
import './index.css';

const CyderConcierge = lazy(() => import('./components/CyderConcierge'));

const skillCategories = [
  {
    title: 'Front-end & motion',
    skills: ['React / Next.js', 'Three.js / WebGL', 'GSAP / Framer', 'TypeScript'],
    desc: 'I build interfaces that feel smooth and intentional — the kind people enjoy using, not just looking at.',
  },
  {
    title: 'AI & smart tools',
    skills: ['Python / Rust', 'AI / NLP', 'GenAI Integration', 'Computer Vision'],
    desc: 'I wire AI into real products so it actually helps people get things done, instead of sitting there as a gimmick.',
  },
  {
    title: 'Solid foundations',
    skills: ['Fintech PWAs', 'Cloud Infra', 'SQL / NoSQL', 'Real-time Systems'],
    desc: 'I care about the boring stuff too — clean structure, reliable data, and apps that don’t fall over under pressure.',
  },
];

const projectData = [
  { id: '01', title: 'Doorstep', type: 'Utility / P2P', desc: 'Instant offline file sharing between phone and computer. Pair once with a QR code, drop files into a folder, and receive them automatically with zero cloud, internet, or account required.', url: 'https://javex-12.github.io/Doorstep/', githubUrl: 'https://github.com/javex-12/Doorstep.git', tags: ['P2P File Transfer', 'QR Sync', 'Android & Windows'], isPremium: true },
  { id: '02', title: 'SwiftLink Pro', type: 'Commerce', desc: 'Turn WhatsApp chats into a proper online storefront in about a minute. Built for businesses that sell where their customers already are.', url: 'https://swiftlinkpro.vercel.app/', tags: ['Next.js', 'WhatsApp API', 'Commerce'], isPremium: true },
  { id: '03', title: 'BioByte Pro', type: 'Education', desc: 'A WAEC Biology practice app with 120+ modules, progress tracking, and the kind of feedback students actually need before exam day.', url: 'https://biobyte.vercel.app/', tags: ['React', 'LMS', 'PWA'], isPremium: true },
  { id: '04', title: 'Chaotic Shift', type: 'AI / Play', desc: 'A playful web app that pairs Google Gemini with physics-y UI — part experiment, part useful tool.', url: 'https://cyswitch.vercel.app/', tags: ['Gemini AI', 'Framer', 'React'], isPremium: true },
  { id: '05', title: 'Naija Bot AI', type: 'AI assistant', desc: 'An AI chat buddy that gets Nigerian context — tone, slang, and local problems — not just generic English answers.', url: 'https://naija-bot.vercel.app/', tags: ['OpenAI', 'NLP', 'Vite'], isPremium: true },
  { id: '06', title: 'Loading Systems', type: 'UI kit', desc: 'A set of polished loading animations and motion bits you can drop into serious products without looking cheap.', url: 'https://loading-screen-1.vercel.app/', tags: ['GSAP', 'SVG', 'Motion'], isPremium: true },
  { id: '07', title: 'Cydemy', type: 'Education', desc: 'A learning platform shaped for engineering and design courses — less clutter, more focus on the work.', url: 'https://cydemy.vercel.app/', tags: ['Next.js', 'LMS', 'Tailwind'], isPremium: true },
  { id: '08', title: 'Adex Concerns', type: 'Business', desc: 'A clean company site and ops showcase for a professional services brand. Straight, credible, no fluff.', url: 'https://adexconcerns.vercel.app/', tags: ['Business', 'React', 'Corporate'], isPremium: true },
  { id: '09', title: 'AjoSafe', type: 'Fintech', desc: 'Digital thrift (Ajo) circles with automatic cycles, live sync, and security you’d actually trust with money.', url: 'https://ajosafe.vercel.app/', tags: ['PWA', 'Supabase', 'Fintech'], isPremium: false },
  { id: '10', title: 'CySolfa', type: 'Music', desc: 'Learn Tonic Solfa with interactive practice — for choirs, students, and anyone who hears music better than they read it.', url: 'https://cysolfa.vercel.app/', tags: ['Audio API', 'React', 'Education'], isPremium: false },
];

const metaCards = [
  { k: 'I work with', v: 'TypeScript, React, AI' },
  { k: 'I care about', v: 'Tools, fintech, education' },
  { k: 'I live in', v: 'Lagos · UTC+1' },
];

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Scope', href: '#ai' },
  { label: 'Work', href: '#projects' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const faqItems = [
  {
    q: 'Who is Dosumu Michael (CyderCoder)?',
    a: 'Dosumu Michael, known as CyderCoder, is a full-stack developer and creative engineer based in Lagos, Nigeria. He builds React and Next.js applications, Three.js/WebGL experiences, AI-powered products, and fintech progressive web apps.',
  },
  {
    q: 'What technologies does CyderCoder specialize in?',
    a: 'Core stack includes React, Next.js, TypeScript, Three.js, WebGL, GSAP, Framer Motion, Node.js, Python, Rust, Supabase, and AI/LLM integrations for real product features.',
  },
  {
    q: 'Is Dosumu Michael available for hire?',
    a: 'Yes. Open to freelance, contract, and collaboration work. Reach out via WhatsApp (+234 808 574 1430) or email michaeldosunmu22@gmail.com.',
  },
  {
    q: 'Where is CyderCoder based?',
    a: 'Lagos, Nigeria (UTC+1), available for remote work worldwide.',
  },
  {
    q: 'What kinds of products has CyderCoder shipped?',
    a: 'Live products include SwiftLink Pro (WhatsApp commerce), BioByte Pro (WAEC Biology practice), AjoSafe (digital thrift/fintech PWA), Naija Bot AI, Cydemy, and more — over 10 production projects.',
  },
  {
    q: 'Does CyderCoder build AI features into products?',
    a: 'Yes. He ships AI product features with practical UX — streaming chat, Nigerian-context assistants (Naija Bot AI), Gemini experiments (Chaotic Shift), and LLM integrations scoped to real jobs-to-be-done rather than gimmicks.',
  },
];

const tickerWords = [
  'React & Next.js',
  'Fintech apps',
  'AI products',
  'Lagos, Nigeria',
  'Clean code',
  'Shipped on time',
  'Human-friendly UI',
];

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDemoIdx, setActiveDemoIdx] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightedProjects, setHighlightedProjects] = useState([]);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const [activeSection, setActiveSection] = useState('top');

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const siteReady = !isLoading;
  useScrollReveal(siteReady);

  const handleCyderMatch = useCallback((projectIds) => {
    setHighlightedProjects(projectIds || []);
  }, []);

  useEffect(() => {
    if (!highlightedProjects.length) return undefined;
    const t = window.setTimeout(() => setHighlightedProjects([]), 12000);
    return () => window.clearTimeout(t);
  }, [highlightedProjects]);

  useEffect(() => {
    if (activeDemoIdx !== null || isModalOpen || menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDemoIdx, isModalOpen, menuOpen]);

  const handleSendWhatsApp = (msg) => {
    window.open(`https://wa.me/2348085741430?text=${encodeURIComponent(msg)}`, '_blank');
    setIsModalOpen(false);
  };

  const openDemo = (i) => setActiveDemoIdx(i);
  const closeDemo = () => setActiveDemoIdx(null);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <Navbar
          onOpenContact={() => setIsModalOpen(true)}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          activeSection={activeSection}
        />
      )}

      <div className="crop tl" aria-hidden="true" />
      <div className="crop tr" aria-hidden="true" />
      <div className="crop bl" aria-hidden="true" />
      <div className="crop br" aria-hidden="true" />

      {activeDemoIdx !== null && (
        <div
          className="demo-overlay fixed inset-0 z-[1000] bg-paper flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Project preview"
        >
          <div className="demo-chrome px-3 sm:px-4 py-3 flex items-center gap-3 sm:gap-4">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 min-w-0 bg-paper border border-ink/15 py-1.5 px-3 font-mono text-[10px] text-ink-muted truncate flex items-center justify-between gap-2">
              <span className="truncate hidden sm:inline">{projectData[activeDemoIdx].url}</span>
              <span className="sm:hidden text-blue uppercase tracking-wider">Live preview</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase tracking-widest text-[8px] font-bold text-emerald-400">Live</span>
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <a
                href={projectData[activeDemoIdx].url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-stamp !py-2 !px-3 !text-[10px] hidden sm:inline-flex"
              >
                Open site →
              </a>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="p-2 border border-ink/20 hover:border-ink font-mono text-[10px] uppercase text-ink"
                aria-label="Reload preview"
              >
                Reload
              </button>
              <button type="button" onClick={closeDemo} className="btn-stamp !py-2 !px-4 !text-[10px]">
                Close
              </button>
            </div>
          </div>
          <div className="bg-orange/20 border-b border-ink/10 px-4 py-2 text-center font-mono text-[9px] sm:text-[10px] text-ink">
            If this preview stays blank, the site blocked embeds — hit Open site instead.
          </div>
          <div className="flex-1 relative bg-paper">
            <iframe
              key={reloadKey}
              src={projectData[activeDemoIdx].url}
              className="w-full h-full border-none absolute inset-0"
              title={projectData[activeDemoIdx].title}
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="eager"
            />
          </div>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendWhatsApp}
        initialMessage="Hey Michael — I saw your portfolio and wanted to chat about a project."
      />

      {siteReady && (
        <Suspense fallback={null}>
          <CyderConcierge
            onMatch={handleCyderMatch}
            onOpenContact={() => setIsModalOpen(true)}
          />
        </Suspense>
      )}

      <div
        className={`site-shell min-h-screen bg-paper transition-opacity duration-500 ${
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${siteReady ? 'site-ready' : ''}`}
        style={{ backgroundColor: '#121110', color: '#F2EFE8' }}
      >
        <div className="max-w-doc mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-16 md:pb-24">

          <main id="main-content">
          {/* Hero */}
          <section id="home" className="mb-10 md:mb-14" aria-label="Introduction">
            <div className="hero-block px-5 sm:px-8 py-10 sm:py-14 -mx-4 sm:-mx-6 md:-mx-8 mb-0">
              <HeroMotion />
              <div className="hero-line relative z-10">
                <span className="hero-eyebrow">
                  Full-Stack Developer · Open to work · Lagos, Nigeria
                </span>
              </div>
              <p className="seo-only">
                Dosumu Michael (CyderCoder) — Full-Stack Developer &amp; Creative Engineer in Lagos, Nigeria.
                Hire a React, Next.js, Three.js, WebGL, and AI product engineer with 10+ live projects.
              </p>
              <div className="hero-line relative z-10">
                <HeroText ready={siteReady} />
              </div>
              <p
                className="hero-line relative z-10 font-body text-body-lg max-w-lg mb-8 font-medium"
                style={{ color: '#C4BDB2' }}
              >
                Hey — I&apos;m <strong>Dosumu Michael</strong> (<strong>CyderCoder</strong>), a full-stack
                developer &amp; creative engineer in Lagos. I ship React/Next.js apps, Three.js experiences,
                AI tools, and fintech PWAs — clear goals, honest timelines, work you can click and use.
              </p>
              <div className="hero-line flex flex-wrap items-center gap-3 relative z-10">
                <a
                  href="#projects"
                  className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase tracking-wider no-underline transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02]"
                >
                  View Selected Work →
                </a>
                <a
                  href="#ai"
                  className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider no-underline transition-all hover:border-white/30"
                >
                  AI Architecture Scope
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Hire Me
                </button>
              </div>
            </div>

            <div className="ink-grid grid-cols-1 sm:grid-cols-3 mt-0.5">
              {metaCards.map((card, i) => (
                <div
                  key={card.k}
                  className="card-stamp reveal-item bg-surface p-[18px]"
                  data-reveal
                  data-delay={String(i + 1)}
                >
                  <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
                    {card.k}
                  </div>
                  <div className="font-body text-sm font-medium text-ink">{card.v}</div>
                </div>
              ))}
            </div>

            <StatsBar />
          </section>

          {/* About — keyword-rich, crawlable copy */}
          <section id="about" className="mb-16 md:mb-24" aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9] mb-3"
              data-reveal
            >
              About CyderCoder
            </h2>
            <div className="reveal-item max-w-2xl space-y-4 text-ink-muted text-[15px] sm:text-base leading-relaxed" data-reveal data-delay="2">
              <p>
                I&apos;m a <strong className="text-ink">full-stack developer in Lagos, Nigeria</strong> who
                builds production software — not just demos. Clients hire me for{' '}
                <strong className="text-ink">React and Next.js</strong> product work,{' '}
                <strong className="text-ink">AI feature integration</strong>, interactive{' '}
                <strong className="text-ink">Three.js / WebGL</strong> frontends, and reliable{' '}
                <strong className="text-ink">fintech PWAs</strong> that hold up under real users.
              </p>
              <p>
                From WhatsApp commerce (SwiftLink Pro) to exam prep (BioByte Pro) and thrift savings (AjoSafe),
                the through-line is the same: useful products, clean architecture, and interfaces people actually
                enjoy. Remote-friendly, UTC+1, open for freelance and contract engagements.
              </p>
            </div>
          </section>

          {/* Ticker */}
          <div className="ticker reveal-item" data-reveal aria-hidden="true">
            <div className="ticker-track">
              {[...tickerWords, ...tickerWords].map((word, i) => (
                <span key={`${word}-${i}`} className="ticker-item">
                  {word}
                  <span className="ticker-dot" />
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <section id="skills" className="mb-16 md:mb-24" aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9] mb-3"
              data-reveal
            >
              Skills &amp; services
            </h2>
            <p className="reveal-item text-ink-muted mb-8 md:mb-10 max-w-md" data-reveal data-delay="2">
              Full-stack web development, AI product engineering, and high-fidelity UI — the stack I ship with every week.
            </p>
            <div className="ink-grid grid-cols-1 md:grid-cols-3">
              {skillCategories.map((cat, i) => (
                <article
                  key={cat.title}
                  className="card-stamp reveal-item bg-surface p-5 sm:p-6 flex flex-col"
                  data-reveal
                  data-delay={String(i + 1)}
                >
                  <h3 className="font-display font-bold text-[clamp(1.5rem,4vw,2.125rem)] uppercase leading-[0.95] mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-ink-muted text-[15px] mb-6 flex-1">{cat.desc}</p>
                  <ul className="space-y-2 border-t border-ink/15 pt-4">
                    {cat.skills.map((s) => (
                      <li key={s} className="flex items-start gap-3 font-mono text-[12px] uppercase tracking-wide">
                        <span className="text-orange mt-0.5 shrink-0" aria-hidden="true">
                          ▸
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* AI showcase — interactive motion + product thinking */}
          <AiShowcase />

          {/* Projects */}
          <section id="projects" className="mb-16 md:mb-24" aria-labelledby="projects-heading">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h2
                  id="projects-heading"
                  className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9]"
                  data-reveal
                >
                  Selected work
                </h2>
              </div>
              <p className="reveal-item font-body text-sm text-ink-muted max-w-xs md:text-right" data-reveal data-delay="2">
                {projectData.length} live projects by CyderCoder. Preview in-page or open the live site.
              </p>
            </div>

            <ul className="border-t-[3px] border-ink/30 list-none m-0 p-0">
              {projectData.map((proj, i) => {
                const slug = PROJECT_SLUGS[proj.id];
                const isHighlighted = slug && highlightedProjects.includes(slug);
                return (
                <li key={proj.id} className="border-0">
                  <article
                    data-project-id={slug}
                    className={`project-row reveal-item w-full text-left py-5 sm:py-6 px-1 sm:px-2 grid grid-cols-[auto_1fr] sm:grid-cols-[3.5rem_1fr_auto] gap-x-4 gap-y-2 items-start sm:items-center group ${
                      isHighlighted ? 'project-compass-match' : ''
                    }`}
                    data-reveal
                    data-delay={String(Math.min((i % 5) + 1, 5))}
                  >
                    <span className="font-mono text-[12px] text-blue proj-blue font-semibold pt-1 sm:pt-0">
                      {proj.id}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-[clamp(1.35rem,3.5vw,1.75rem)] uppercase leading-none">
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink no-underline hover:text-blue"
                          >
                            {proj.title}
                          </a>
                        </h3>
                        {proj.isPremium && (
                          <span className="font-mono text-[9px] uppercase tracking-wider bg-orange/20 text-orange-soft border border-orange/30 px-2 py-0.5 font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] sm:text-sm text-ink-muted proj-muted max-w-xl mb-2">{proj.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-blue proj-blue mr-1">
                          {proj.type}
                        </span>
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="proj-tag font-mono text-[9px] uppercase tracking-wider border border-ink/20 px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openDemo(i)}
                          className="font-mono text-[10px] uppercase tracking-wider border border-ink/30 px-3 py-1.5 hover:border-ink text-ink bg-transparent cursor-pointer"
                        >
                          Preview
                        </button>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] uppercase tracking-wider border border-orange/40 text-orange-soft px-3 py-1.5 no-underline hover:bg-orange/10"
                        >
                          Live site ↗
                        </a>
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] uppercase tracking-wider border border-blue/40 text-blue px-3 py-1.5 no-underline hover:bg-blue/10"
                          >
                            GitHub repo ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDemo(i)}
                      className="proj-arrow hidden sm:inline font-mono text-[11px] uppercase tracking-wider font-bold self-center bg-transparent border-0 cursor-pointer text-ink"
                    >
                      Try it →
                    </button>
                  </article>
                </li>
              );
              })}
            </ul>
          </section>

          {/* FAQ — visible content matching FAQPage schema */}
          <section id="faq" className="mb-16 md:mb-24" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="section-title reveal-item font-display font-black text-[clamp(2.5rem,8vw,3rem)] uppercase leading-[0.9] mb-3"
              data-reveal
            >
              FAQ
            </h2>
            <p className="reveal-item text-ink-muted mb-8 md:mb-10 max-w-md" data-reveal data-delay="2">
              Quick answers for clients searching for a full-stack developer in Lagos.
            </p>
            <div className="space-y-0 border-t-[3px] border-ink/30">
              {faqItems.map((item, i) => (
                <details
                  key={item.q}
                  className="reveal-item border-b border-ink/15 py-5 group"
                  data-reveal
                  data-delay={String(Math.min(i + 1, 5))}
                >
                  <summary className="font-display font-bold text-lg sm:text-xl uppercase leading-snug cursor-pointer list-none flex justify-between gap-4 items-start text-ink">
                    <span>{item.q}</span>
                    <span className="font-mono text-orange text-sm shrink-0 mt-1 group-open:rotate-45 transition-transform" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ink-muted text-[15px] leading-relaxed max-w-2xl">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mb-12" aria-labelledby="contact-heading">
            <div
              className="contact-block reveal-item px-5 sm:px-8 py-10 sm:py-14 -mx-4 sm:-mx-6 md:-mx-8 mb-0.5"
              data-reveal
            >
              <h2
                id="contact-heading"
                className="font-display font-black text-[clamp(2.5rem,10vw,4.5rem)] uppercase leading-[0.85] mb-6"
              >
                Hire a developer
                <br />
                in Lagos.
              </h2>
              <p className="font-body text-body-lg text-ink/70 max-w-md mb-8 font-medium">
                Freelance builds, AI features, fintech PWAs, or a focused collab — if it&apos;s useful and
                shippable, I&apos;m in. Remote-ready worldwide.
              </p>
              <button type="button" onClick={() => setIsModalOpen(true)} className="btn-stamp btn-stamp-paper">
                Send a message →
              </button>
            </div>

            <div className="ink-grid grid-cols-1 sm:grid-cols-3 -mx-4 sm:-mx-6 md:-mx-8">
              <a
                href="https://wa.me/2348085741430?text=Hey%20Michael%20%E2%80%94%20I%20saw%20your%20portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="card-stamp reveal-item bg-surface p-5 sm:p-6 text-left no-underline text-ink"
                data-reveal
                data-delay="1"
              >
                <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
                  WhatsApp
                </div>
                <div className="font-display font-bold text-2xl uppercase leading-none mb-2 text-ink">Chat ↗</div>
                <p className="font-mono text-[12px] text-ink-muted">+234 808 574 1430</p>
              </a>
              <a
                href="mailto:michaeldosunmu22@gmail.com?subject=Project%20inquiry%20%E2%80%94%20CyderCoder"
                className="card-stamp reveal-item bg-surface p-5 sm:p-6 no-underline text-ink"
                data-reveal
                data-delay="2"
              >
                <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
                  Email
                </div>
                <div className="font-display font-bold text-2xl uppercase leading-none mb-2">Write ↗</div>
                <p className="font-mono text-[12px] text-ink-muted break-all">michaeldosunmu22@gmail.com</p>
              </a>
              <a
                href="https://github.com/javex-12"
                target="_blank"
                rel="noopener noreferrer"
                className="card-stamp reveal-item bg-surface p-5 sm:p-6 no-underline text-ink"
                data-reveal
                data-delay="3"
              >
                <div className="card-k font-mono text-[11px] text-blue tracking-[0.08em] uppercase font-semibold mb-2">
                  GitHub
                </div>
                <div className="font-display font-bold text-2xl uppercase leading-none mb-2">Code ↗</div>
                <p className="font-mono text-[12px] text-ink-muted">github.com/javex-12</p>
              </a>
            </div>
          </section>
          </main>

          <footer
            className="reveal-item pt-8 border-t border-ink/20"
            data-reveal
            role="contentinfo"
            itemScope
            itemType="https://schema.org/WPFooter"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
              <div>
                <div className="brand-mark font-display font-black text-lg uppercase tracking-tight">
                  Cyder<span className="brand-coder">Coder</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mt-1">
                  © 2026 Dosumu Michael · Full-Stack Developer, Lagos Nigeria
                </p>
              </div>
              <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
                <a href="#about" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">About</a>
                <a href="#skills" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Skills</a>
                <a href="#ai" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Scope</a>
                <a href="#projects" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Work</a>
                <a href="#faq" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">FAQ</a>
                <a href="#contact" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Contact</a>
                <a href="https://github.com/javex-12" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">GitHub</a>
                <a href="mailto:michaeldosunmu22@gmail.com" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Email</a>
                <a href="/sitemap.xml" className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-blue no-underline">Sitemap</a>
              </nav>
            </div>
            <p className="font-mono text-[10px] text-ink-muted leading-relaxed max-w-2xl">
              CyderCoder is the portfolio of Dosumu Michael — full-stack developer &amp; creative engineer in Lagos,
              Nigeria. Specializing in React, Next.js, Three.js, WebGL, AI products, and fintech PWAs.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;
