import React from 'react';

interface StaminaBarProps {
  stamina: number;
}

const StaminaBar: React.FC<StaminaBarProps> = ({ stamina }) => {
  return (
    <div className='staminaBug'>
        <p>Stamina:</p>
        <div style={{ width: '100%', backgroundColor: '#d5d5d5', borderRadius: '4px' }}>
            <div
                style={{
                height: '20px',
                width: `${(stamina/20)*100}%`,
                backgroundColor: '#111',
                borderRadius: '4px',
                }}
            />
        </div>
    </div>
  );
};

export default StaminaBar;
