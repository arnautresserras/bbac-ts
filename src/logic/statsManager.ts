import { BatterStats } from "../interfaces/BatterStats";

export const initialLineupStats: BatterStats[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  plateAppearance: 0,
  atBats: 0,
  hits: 0,
  walks: 0,
  hitByPitch: 0,
  homeRuns: 0,
}));

export const resetStats = (): BatterStats[] => {
  return initialLineupStats.map(player => ({ ...player }));
};

export const updateLineupStat = (
  stats: BatterStats[],
  id: number,
  stat: keyof BatterStats,
  value: number
): BatterStats[] => {
  return stats.map((player, index) =>
    index === id ? { ...player, [stat]: player[stat] + value } : player
  );
};
