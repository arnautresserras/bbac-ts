import { ALL_ARCHETYPES } from "../data/playerArchetypes";
import { PlayerArchetype } from "../types/playerArchetype";

const RECRUIT_POOL = ALL_ARCHETYPES.filter(a => a.id !== "average_joe");

export function generateRecruits(): PlayerArchetype[] {
  return Array.from(
    { length: 3 },
    () => RECRUIT_POOL[Math.floor(Math.random() * RECRUIT_POOL.length)]
  );
}
