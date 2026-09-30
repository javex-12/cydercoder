import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar = ({ onOpenContact, activeSection, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#projects', isRoute: false },
    { label: 'Process', href: '#process', isRoute: false },
    { label: 'Capabilities', href: '#skills', isRoute: false },
    { label: 'AI Lab', href: '/ai', isRoute: true },
    { label: 'About', href: '#about', isRoute: false },
    { label: 'FAQ', href: '#faq', isRoute: false },
  ];

  const handleLinkClick = (e, link) => {
    if (link.isRoute) {
      e.preventDefault();
      onNavigate?.('/ai');
    } else {
      if (window.location.pathname !== '/') {
        e.preventDefault();
        onNavigate?.('/');
        setTimeout(() => {
          const el = document.querySelector(link.href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${
        scrolled ? 'shadow-lg py-3' : 'py-4'
      }`}
      style={{
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate?.('/')}
          className="flex items-center gap-3 group no-underline bg-transparent border-0 cursor-pointer text-left p-0"
        >
          <img
            src="/logo.svg"
            alt="CyderCoder Logo"
            className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight group-hover:text-orange-400 transition-colors leading-none" style={{ color: 'var(--theme-text)' }}>
              CYDER<span className="text-orange-500">CODER</span>
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>
              Dosumu Michael · Full-Stack
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border backdrop-blur-md" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wide uppercase transition-all no-underline ${
                activeSection === link.href.replace('#', '') || (link.isRoute && activeSection === 'ai')
                  ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30 shadow-sm'
                  : 'hover:bg-orange-500/10'
              }`}
              style={{
                color: activeSection === link.href.replace('#', '') || (link.isRoute && activeSection === 'ai') ? undefined : 'var(--theme-text-muted)',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Availability Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase tracking-wider">
              Open for hire
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer shadow-md shadow-orange-950/30"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-x-0 top-[65px] backdrop-blur-2xl border-b p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top duration-200"
          style={{
            backgroundColor: 'var(--theme-nav-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--theme-border)' }}>
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>Navigation</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 uppercase">Available</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, link);
                }}
                className="px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wide no-underline flex items-center justify-between"
                style={{ color: 'var(--theme-text)' }}
              >
                <span>{link.label}</span>
                <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>→</span>
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
