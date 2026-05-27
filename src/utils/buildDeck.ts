import { PlayerArchetype } from "../types/playerArchetype";
import { CardName } from "../types/cardName";

export function buildDeckFromRoster(roster: PlayerArchetype[]): CardName[] {
  return roster.flatMap(player => player.cards);
}
