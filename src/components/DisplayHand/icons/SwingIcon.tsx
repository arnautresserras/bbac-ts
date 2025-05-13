export const SwingIcon = ({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
      {/* Ball */}
      <circle cx="52" cy="12" r="6" fill="white" stroke="currentColor" strokeWidth="2" />
  
      {/* Mirrored Bat (swinging from bottom-left to top-right) */}
      <path d="M50 50 L28 34 L32 30 L52 48 Z" fill="black" stroke="currentColor" strokeWidth="1.5"
      />
      {/* Swing arc */}
      <path d="M20 60 C10 40, 30 20, 50 10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" fill="none"
      />
    </svg>
  );