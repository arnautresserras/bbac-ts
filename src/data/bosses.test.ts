import { BOSS_1, BOSS_4, MIDDLE_BOSS_POOL } from "./bosses";

test("BOSS_1 is tier 1 with correct settings", () => {
  expect(BOSS_1.tier).toBe(1);
  expect(BOSS_1.maxInnings).toBe(3);
  expect(BOSS_1.targetRuns).toBe(2);
});

test("BOSS_4 is tier 3 with correct settings", () => {
  expect(BOSS_4.tier).toBe(3);
  expect(BOSS_4.maxInnings).toBe(5);
  expect(BOSS_4.targetRuns).toBe(4);
});

test("MIDDLE_BOSS_POOL has exactly 6 entries", () => {
  expect(MIDDLE_BOSS_POOL).toHaveLength(6);
});

test("all bosses have valid field types", () => {
  const allBosses = [BOSS_1, ...MIDDLE_BOSS_POOL, BOSS_4];
  allBosses.forEach(boss => {
    expect(typeof boss.id).toBe("string");
    expect(typeof boss.name).toBe("string");
    expect([1, 2, 3]).toContain(boss.tier);
    expect(typeof boss.initialStamina).toBe("number");
    expect(typeof boss.maxStamina).toBe("number");
    expect(typeof boss.maxInnings).toBe("number");
    expect(typeof boss.targetRuns).toBe("number");
  });
});
