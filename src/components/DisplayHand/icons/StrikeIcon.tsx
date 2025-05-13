export const StrikeIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
      <line x1="16" y1="16" x2="48" y2="48" stroke="currentColor" strokeWidth="6"/>
      <line x1="48" y1="16" x2="16" y2="48" stroke="currentColor" strokeWidth="6"/>
    </svg>
);