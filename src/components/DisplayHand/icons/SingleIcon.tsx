export const SingleIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <polygon points="32,8 56,32 32,56 8,32" stroke="currentColor" strokeWidth="4" fill="white"/>
    <text x="32" y="37" textAnchor="middle" fontSize="16" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">1B</text>
  </svg>
);
