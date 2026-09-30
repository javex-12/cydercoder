import React from 'react';

const HeroText = () => {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 font-mono text-[11px] text-orange tracking-[0.15em] uppercase font-semibold">
        <span className="w-1.5 h-1.5 bg-orange" />
        <span>DOSUMU MICHAEL // CYDERCODER</span>
      </div>
      <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[6.25rem] tracking-tight leading-[0.88] text-ink uppercase">
        FULL-STACK ENGINEER.
        <span className="block text-orange mt-1">BUILT FOR REAL CONSTRAINTS.</span>
      </h1>
    </div>
  );
};

export default HeroText;
