import { ALL_ARCHETYPES } from "./playerArchetypes";

test("every archetype has exactly 6 cards", () => {
  ALL_ARCHETYPES.forEach(archetype => {
    expect(archetype.cards).toHaveLength(6);
  });
});

test("all 7 archetypes are present", () => {
  expect(ALL_ARCHETYPES).toHaveLength(7);
});
