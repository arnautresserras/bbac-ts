// src/components/icons/HomeRunIcon.tsx
import React from 'react';

export const HomeRunIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    {/* Baseball */}
    <circle cx="52" cy="12" r="6" fill="white" stroke="currentColor" strokeWidth="2" />
    
    {/* Lightning bolt path for bat (wider top and pointy bottom) */}
    <path 
      d="M52 12 L40 22 L44 24 L30 38 L34 40 L20 54" 
      stroke="currentColor" 
      strokeWidth="6"  // Increased stroke width to make top even wider
      fill="none" 
      strokeLinecap="round"
    />
  </svg>
);
