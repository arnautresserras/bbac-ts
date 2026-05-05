import { useState } from "react";

export type InningResult = "continue" | "new-inning" | "game-over";

export function useGameCounts(maxOutsPerInning: number, maxInnings: number) {
  const [countBalls, setCountBalls] = useState(0);
  const [countStrikes, setCountStrikes] = useState(0);
  const [countOuts, setCountOuts] = useState(0);
  const [inning, setInning] = useState(1);

  const resetCount = () => {
    setCountBalls(0);
    setCountStrikes(0);
  };

  // Called after setCountOuts(countOuts + 1) — reads the pre-update value intentionally,
  // so (countOuts + 1) reflects the out that was just registered.
  const endInning = (): InningResult => {
    if ((countOuts + 1) % maxOutsPerInning === 0) {
      if (inning === maxInnings) return "game-over";
      setCountOuts(0);
      setInning(i => i + 1);
      return "new-inning";
    }
    return "continue";
  };

  const reset = () => {
    setCountBalls(0);
    setCountStrikes(0);
    setCountOuts(0);
    setInning(1);
  };

  return {
    countBalls, countStrikes, countOuts, inning,
    setCountBalls, setCountStrikes, setCountOuts,
    resetCount, endInning, reset,
  };
}
