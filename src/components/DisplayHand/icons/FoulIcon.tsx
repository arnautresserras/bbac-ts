export const FoulIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <line x1="16" y1="8" x2="16" y2="56" stroke="currentColor" strokeWidth="4"/>
    <polygon points="16,8 48,20 16,32" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
  </svg>
);
