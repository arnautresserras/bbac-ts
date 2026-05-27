export const OutIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="white"/>
    <line x1="18" y1="18" x2="46" y2="46" stroke="currentColor" strokeWidth="4"/>
    <line x1="46" y1="18" x2="18" y2="46" stroke="currentColor" strokeWidth="4"/>
  </svg>
);
