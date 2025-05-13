export const WildPitchIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
      <path d="M10 50 Q20 20, 30 40 T50 20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="4 3"/>
      <circle cx="50" cy="20" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
    </svg>
);