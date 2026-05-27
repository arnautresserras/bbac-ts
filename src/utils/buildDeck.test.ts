import { buildDeckFromRoster } from "./buildDeck";
import { AVERAGE_JOE } from "../data/playerArchetypes";

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
