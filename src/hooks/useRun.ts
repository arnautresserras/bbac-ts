import { useState } from "react";
import { Boss } from "../types/boss";
import { PlayerArchetype } from "../types/playerArchetype";
import { AVERAGE_JOE } from "../data/playerArchetypes";
import { BOSS_1, BOSS_4, MIDDLE_BOSS_POOL } from "../data/bosses";

function buildBossSequence(): Boss[] {
  const pool = [...MIDDLE_BOSS_POOL];
  const i1 = Math.floor(Math.random() * pool.length);
  const [mid1] = pool.splice(i1, 1);
  const i2 = Math.floor(Math.random() * pool.length);
  const mid2 = pool[i2];
  return [BOSS_1, mid1, mid2, BOSS_4];
}

export function useRun() {
  const [roster, setRoster] = useState<PlayerArchetype[]>(() => Array(9).fill(AVERAGE_JOE));
  const [bossSequence, setBossSequence] = useState<Boss[]>(buildBossSequence);
  const [currentBossIndex, setCurrentBossIndex] = useState(0);

  const initRun = () => {
    setRoster(Array(9).fill(AVERAGE_JOE));
    setBossSequence(buildBossSequence());
    setCurrentBossIndex(0);
  };

  const getCurrentBoss = (): Boss => bossSequence[currentBossIndex];

  const advanceBoss = () => setCurrentBossIndex(i => i + 1);

  const replacePlayer = (slot: number, newPlayer: PlayerArchetype): PlayerArchetype[] => {
    const updated = [...roster];
    updated[slot] = newPlayer;
    setRoster(updated);
    return updated;
  };

  const isRunComplete = (): boolean => currentBossIndex >= 4;

  return {
    roster,
    bossSequence,
    currentBossIndex,
    initRun,
    getCurrentBoss,
    advanceBoss,
    replacePlayer,
    isRunComplete,
  };
}
