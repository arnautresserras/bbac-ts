import { useState } from "react";

export function usePitcher(initialStamina: number, initialMaxStamina: number) {
  const [pitcherStamina, setPitcherStamina] = useState(initialStamina);
  const [maxPitcherStamina, setMaxPitcherStamina] = useState(initialMaxStamina);

  const modifyStamina = (amount: number) => {
    setPitcherStamina(prev => Math.min(Math.max(prev + amount, 0), maxPitcherStamina));
  };

  const swapPitcher = () => {
    setMaxPitcherStamina(15);
    setPitcherStamina(10);
  };

  const reset = (stamina: number, maxStamina: number) => {
    setPitcherStamina(stamina);
    setMaxPitcherStamina(maxStamina);
  };

  return { pitcherStamina, maxPitcherStamina, modifyStamina, swapPitcher, reset };
}
