import { CardName } from "./cardName";

export interface PlayerArchetype {
  id: string;
  name: string;
  cards: CardName[]; // invariant: exactly 6 cards
}
