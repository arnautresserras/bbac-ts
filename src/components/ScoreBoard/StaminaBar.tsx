import React, { useEffect, useRef, useState } from 'react';

interface StaminaBarProps {
  stamina: number;
  maxStamina: number;
}

const StaminaBar: React.FC<StaminaBarProps> = ({stamina, maxStamina}) => {
  const [variation, setVariation] = useState("");
  const prevStaminaRef = useRef<number>();

  useEffect(() => {
    if(prevStaminaRef.current){
      if(prevStaminaRef.current < stamina) setVariation("increase");
      if(prevStaminaRef.current > stamina) setVariation("decrease");
    } 
    prevStaminaRef.current = stamina;
  }, [stamina]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVariation("");
    }, 1000);
    return () => clearTimeout(timer);
  }, [variation])

  return (
    <div className='staminaBug'>
        <p>Stamina:</p>
        <div className="staminaBackground">
            <div className={'staminaFill '+variation}
                style={{width: `${(stamina/maxStamina)*100}%`}}
            />
        </div>
    </div>
  );
};

export default StaminaBar;
