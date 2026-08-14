import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sliders, Moon, Sun, Sparkles, Shield, Smartphone, Globe, Code } from 'lucide-react';

export const AndroidStatusBar = ({ onOpenSettings, themeMode, toggleTheme }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-3 pb-1 flex items-center justify-between font-sans text-xs select-none relative z-50">
      {/* Time & Pill dynamic badge */}
      <div className="flex items-center gap-2.5">
        <span className="font-semibold tracking-tight text-base sm:text-lg text-[var(--android-on-bg)] font-mono">
          {time || '12:00'}
        </span>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--android-pill-bg)] border border-[var(--android-border)] backdrop-blur-md transition-all hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-[var(--android-on-bg)] tracking-wide">
            Android 16 Expressive
          </span>
        </div>
      </div>

      {/* Center Dynamic Island Pill for quick status */}
      <a 
        href="#contact"
        className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--android-accent)] text-[var(--android-on-accent)] font-semibold text-xs transition-transform hover:scale-105 shadow-md no-underline"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>Available for Hire</span>
      </a>

      {/* Right icons & quick setting toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 opacity-80">
          <Wifi className="w-4 h-4 text-[var(--android-on-bg)]" />
          <Battery className="w-4 h-4 text-[var(--android-on-bg)]" />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="p-1.5 rounded-full bg-[var(--android-card-bg)] border border-[var(--android-border)] text-[var(--android-on-bg)] hover:bg-[var(--android-accent-muted)] transition-colors cursor-pointer"
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open Quick Settings"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--android-card-bg)] border border-[var(--android-border)] text-[var(--android-on-bg)] hover:border-[var(--android-accent)] transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[var(--android-accent)]" />
          <span className="hidden md:inline text-[11px] font-medium">Quick Settings</span>
        </button>
      </div>
    </div>
  );
};

export const QuickSettingsSheet = ({ isOpen, onClose, themeMode, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div className="w-full max-w-lg bg-[var(--android-sheet-bg)] border border-[var(--android-border)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6 border-b border-[var(--android-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--android-accent)] text-[var(--android-on-accent)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--android-on-bg)]">Android 16 Expressive UI</h3>
              <p className="text-xs text-[var(--android-muted)]">CyderCoder Portfolio OS v16.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--android-card-bg)] border border-[var(--android-border)] text-[var(--android-on-bg)] flex items-center justify-center text-sm font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={toggleTheme}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-24 ${
              themeMode === 'dark'
                ? 'bg-[var(--android-accent)] text-[var(--android-on-accent)] border-transparent'
                : 'bg-[var(--android-card-bg)] text-[var(--android-on-bg)] border-[var(--android-border)]'
            }`}
          >
            <div className="flex justify-between items-center w-full">
              {themeMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Mode</span>
            </div>
            <div>
              <div className="font-semibold text-sm">{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
              <div className="text-[11px] opacity-75">Material You Theme</div>
            </div>
          </button>

          <a
            href="https://wa.me/2348085741430"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-[var(--android-border)] bg-[var(--android-card-bg)] text-[var(--android-on-bg)] text-left flex flex-col justify-between h-24 hover:border-[var(--android-accent)] transition-all no-underline"
          >
            <div className="flex justify-between items-center w-full">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Online</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Direct WhatsApp</div>
              <div className="text-[11px] text-[var(--android-muted)]">+234 808 574 1430</div>
            </div>
          </a>

          <a
            href="#skills"
            onClick={onClose}
            className="p-4 rounded-2xl border border-[var(--android-border)] bg-[var(--android-card-bg)] text-[var(--android-on-bg)] text-left flex flex-col justify-between h-24 hover:border-[var(--android-accent)] transition-all no-underline"
          >
            <div className="flex justify-between items-center w-full">
              <Code className="w-5 h-5 text-[var(--android-accent)]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--android-muted)]">Stack</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Tech Stack</div>
              <div className="text-[11px] text-[var(--android-muted)]">React, Next.js, AI</div>
            </div>
          </a>

          <div className="p-4 rounded-2xl border border-[var(--android-border)] bg-[var(--android-card-bg)] text-[var(--android-on-bg)] text-left flex flex-col justify-between h-24">
            <div className="flex justify-between items-center w-full">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Verified</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Location</div>
              <div className="text-[11px] text-[var(--android-muted)]">Lagos, Nigeria (UTC+1)</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--android-card-bg)] border border-[var(--android-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--android-accent)]" />
            <div>
              <div className="text-xs font-semibold text-[var(--android-on-bg)]">Minimal & Intuitive</div>
              <div className="text-[11px] text-[var(--android-muted)]">Gesture pill dock navigation active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
