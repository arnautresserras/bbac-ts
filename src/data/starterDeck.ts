const starterDeck: string[] = [
  "Ball", "Ball", "Ball", "Ball", "Ball", "Ball",
  "Ball", "Ball", "Ball", "Ball", "Ball", "Ball",
  "Ball", "Ball", "Ball", "Ball", "Ball", "Ball",
  "Ball",
  "Strike", "Strike", "Strike", "Strike", "Strike",
  "Strike", "Strike", "Strike", "Strike", "Strike",
  "Strike", "Strike", "Strike", "Strike",
  "Swing", "Swing", "Swing", "Swing", "Swing", "Swing",
  "Swing", "Swing", "Swing", "Swing", "Swing", "Swing",
  "Swing", "Swing", "Swing",
  "Hit by pitch", "Hit by pitch",
  "Wild pitch", "Wild pitch",
  "Home run", "Home run"
];

export const getStarterDeck = (): string[] => [...starterDeck];
