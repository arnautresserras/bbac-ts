export const BallIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="white"/>
    <path d="M20 20 C24 28, 24 36, 20 44" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M44 20 C40 28, 40 36, 44 44" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);