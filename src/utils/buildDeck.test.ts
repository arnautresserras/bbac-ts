import { buildDeckFromRoster } from "./buildDeck";
import { AVERAGE_JOE, ZEN_MASTER } from "../data/playerArchetypes";

const nineAverageJoes = Array(9).fill(AVERAGE_JOE);

test("9 Average Joes produce exactly 54 cards", () => {
  expect(buildDeckFromRoster(nineAverageJoes)).toHaveLength(54);
});

test("9 Average Joes produce 18 Ball, 9 Strike, 27 Swing", () => {
  const deck = buildDeckFromRoster(nineAverageJoes);
  expect(deck.filter(c => c === "Ball")).toHaveLength(18);
  expect(deck.filter(c => c === "Strike")).toHaveLength(9);
  expect(deck.filter(c => c === "Swing")).toHaveLength(27);
});

test("replacing one Average Joe with Zen Master keeps 54 cards with correct composition", () => {
  const roster = [...Array(8).fill(AVERAGE_JOE), ZEN_MASTER];
  const deck = buildDeckFromRoster(roster);
  // 8 AJ: 16 Ball, 8 Strike, 24 Swing + Zen Master: 4 Ball, 1 Strike, 1 Swing
  expect(deck).toHaveLength(54);
  expect(deck.filter(c => c === "Ball")).toHaveLength(20);
  expect(deck.filter(c => c === "Strike")).toHaveLength(9);
  expect(deck.filter(c => c === "Swing")).toHaveLength(25);
});
