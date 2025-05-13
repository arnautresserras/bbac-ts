// src/components/icons/HitByPitchIcon.tsx
import React from "react";

export const HitByPitchIcon = ({size = 64,color = "currentColor",}: {size?: number;color?: string;}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    {/* Head */}
    <circle cx="32" cy="20" r="6" fill="currentColor" />

    {/* Tilted body to imply reaction */}
    <rect x="26" y="28" width="8" height="24" transform="rotate(-10 26 28)" fill="currentColor"/>

    {/* Ball hitting the body */}
    <circle cx="38" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>

    {/* Extended trail following the ball */}
    <line x1="52" y1="18" x2="43" y2="27" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
    <line x1="48" y1="22" x2="39" y2="31" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);
