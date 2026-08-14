import React from 'react';
import { Home, FolderGit2, Cpu, Sparkles, HelpCircle, Mail } from 'lucide-react';

const navItems = [
  { id: 'top', label: 'Home', href: '#top', icon: Home },
  { id: 'skills', label: 'Skills', href: '#skills', icon: Cpu },
  { id: 'ai', label: 'Scope', href: '#ai', icon: Sparkles },
  { id: 'projects', label: 'Work', href: '#projects', icon: FolderGit2 },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: HelpCircle },
  { id: 'contact', label: 'Contact', href: '#contact', icon: Mail },
];

export const AndroidDockNav = ({ activeSection }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[900] max-w-[92vw] w-auto">
      <nav 
        className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-[var(--android-dock-bg)] border border-[var(--android-border)] backdrop-blur-xl shadow-2xl transition-all"
        aria-label="Floating Gesture Dock"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 no-underline text-xs font-semibold ${
                isActive
                  ? 'bg-[var(--android-accent)] text-[var(--android-on-accent)] shadow-md scale-105'
                  : 'text-[var(--android-on-bg)] hover:bg-[var(--android-accent-muted)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className={`${isActive ? 'inline-block' : 'hidden md:inline-block'} tracking-wide`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
      {/* Android 16 Bottom Gesture Bar Handle */}
      <div className="w-28 h-1 bg-[var(--android-on-bg)] opacity-30 rounded-full mx-auto mt-2" />
    </div>
  );
};
