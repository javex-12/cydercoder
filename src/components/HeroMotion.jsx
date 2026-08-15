import React from 'react';

const HeroMotion = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Warm ambient sunset glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-600/10 blur-[130px]" />
      <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] rounded-full bg-amber-500/10 blur-[150px]" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-rose-600/10 blur-[130px]" />
    </div>
  );
};

export default HeroMotion;
