import React from 'react';

// Pure technical watermark — no floating particles, no ambient blur soup
const HeroMotion = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.03]" aria-hidden="true">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: 'linear-gradient(to right, #F2EFE8 1px, transparent 1px), linear-gradient(to bottom, #F2EFE8 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};

export default HeroMotion;
