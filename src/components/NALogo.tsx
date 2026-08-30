import React from 'react';

export const NALogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Círculo externo */}
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="5" />
    {/* Quadrado interior em 45 graus */}
    <rect 
      x="27" 
      y="27" 
      width="46" 
      height="46" 
      stroke="currentColor" 
      strokeWidth="5" 
      transform="rotate(45 50 50)" 
    />
  </svg>
);
