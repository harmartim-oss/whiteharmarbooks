import React from 'react';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Elegant Minimalist Book Outline */}
    <path 
      d="M50 85V25C50 25 35 20 20 25V85C35 80 50 85 50 85Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    <path 
      d="M50 85V25C50 25 65 20 80 25V85C65 80 50 85 50 85Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    {/* Subtle Inner Detail */}
    <path 
      d="M30 35H40M30 45H40M30 55H40" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round"
      opacity="0.3"
    />
    <path 
      d="M60 35H70M60 45H70M60 55H70" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round"
      opacity="0.3"
    />
    {/* Center Spine Accent */}
    <circle cx="50" cy="25" r="1" fill="currentColor" />
    <circle cx="50" cy="85" r="1" fill="currentColor" />
  </svg>
);
