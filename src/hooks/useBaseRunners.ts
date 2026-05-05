import { useState } from "react";

const FIRST_BASE = 0;
const SECOND_BASE = 1;
const THIRD_BASE = 2;

export function useBaseRunners() {
  const [bases, setBases] = useState([false, false, false]);
  const [score, setScore] = useState(0);

  const clearBases = () => setBases([false, false, false]);

  const countRunners = (arr: boolean[]) =>
    arr.reduce((a, v) => (v ? a + 1 : a), 0);

  const addScore = (amount: number) => setScore(s => s + amount);

  const advanceRunners = (newRunner: boolean) => {
    if (bases[FIRST_BASE]) setScore(s => s + 1);
    setBases(prev => {
      const next = [...prev];
      next.shift();
      next.push(newRunner);
      return next;
    });
  };

  const placeRunnerOnBase = () => {
    if (!bases.includes(false)) {
      advanceRunners(true);
      return;
    }
    if (bases[THIRD_BASE]) {
      if (bases[FIRST_BASE]) {
        setBases(prev => { const next = [...prev]; next[SECOND_BASE] = true; return next; });
      } else {
        advanceRunners(true);
      }
    } else {
      setBases(prev => { const next = [...prev]; next[THIRD_BASE] = true; return next; });
    }
  };

  const advanceAndPlace = () => {
    if (bases[FIRST_BASE]) setScore(s => s + 1);
    setBases(prev => {
      const next = [...prev];
      next.shift();
      next.push(false);
      next[THIRD_BASE] = true;
      return next;
    });
  };

  const reset = () => {
    setBases([false, false, false]);
    setScore(0);
  };

  return {
    bases, score,
    clearBases, countRunners, addScore,
    advanceRunners, placeRunnerOnBase, advanceAndPlace,
    reset,
  };
}
