import { generateRecruits } from "./generateRecruits";
import { AVERAGE_JOE } from "../data/playerArchetypes";

test("generateRecruits returns exactly 3 recruits", () => {
  expect(generateRecruits()).toHaveLength(3);
});

test("generateRecruits never includes Average Joe", () => {
  for (let i = 0; i < 100; i++) {
    const recruits = generateRecruits();
    recruits.forEach(r => {
      expect(r.id).not.toBe(AVERAGE_JOE.id);
    });
  }
});
