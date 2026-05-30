import { PlayerArchetype } from "../types/playerArchetype";

export const AVERAGE_JOE: PlayerArchetype = {
  id: "average_joe",
  name: "Average Joe",
  cards: ["Ball", "Ball", "Strike", "Swing", "Swing", "Swing"],
};

export const POWER_SLUGGER: PlayerArchetype = {
  id: "strongman",
  name: "Strongman",
  cards: ["Ball", "Ball", "Strike", "Home run", "Out", "Swing"],
};

export const ZEN_MASTER: PlayerArchetype = {
  id: "zen_master",
  name: "Zen Master",
  cards: ["Ball", "Ball", "Ball", "Ball", "Strike", "Swing"],
};

export const INSTIGATOR: PlayerArchetype = {
  id: "jester",
  name: "Jester",
  cards: ["Ball", "Ball", "Strike", "Swing", "Hit by pitch", "Hit by pitch"],
};

export const RATTLER: PlayerArchetype = {
  id: "rattler",
  name: "Rattler",
  cards: ["Ball", "Ball", "Strike", "Swing", "Wild pitch", "Wild pitch"],
};

export const CONTACT_HITTER: PlayerArchetype = {
  id: "samurai",
  name: "Samurai",
  cards: ["Ball", "Ball", "Strike", "Single", "Single", "Swing"],
};

export const GRINDER: PlayerArchetype = {
  id: "grinder",
  name: "Grinder",
  cards: ["Ball", "Ball", "Foul", "Foul", "Swing", "Swing"],
};

export const ALL_ARCHETYPES: PlayerArchetype[] = [
  AVERAGE_JOE,
  POWER_SLUGGER,
  ZEN_MASTER,
  INSTIGATOR,
  RATTLER,
  CONTACT_HITTER,
  GRINDER,
];
