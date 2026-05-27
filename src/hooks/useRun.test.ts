import { renderHook, act } from "@testing-library/react";
import { useRun } from "./useRun";
import { BOSS_1, BOSS_4, MIDDLE_BOSS_POOL } from "../data/bosses";
import { ZEN_MASTER } from "../data/playerArchetypes";
import { PlayerArchetype } from "../types/playerArchetype";

test("initial bossSequence has exactly 4 bosses", () => {
  const { result } = renderHook(() => useRun());
  expect(result.current.bossSequence).toHaveLength(4);
});

test("boss at index 0 is always BOSS_1", () => {
  const { result } = renderHook(() => useRun());
  expect(result.current.bossSequence[0]).toBe(BOSS_1);
});

test("boss at index 3 is always BOSS_4", () => {
  const { result } = renderHook(() => useRun());
  expect(result.current.bossSequence[3]).toBe(BOSS_4);
});

test("middle two bosses are distinct entries from the pool", () => {
  const { result } = renderHook(() => useRun());
  const mid1 = result.current.bossSequence[1];
  const mid2 = result.current.bossSequence[2];
  expect(MIDDLE_BOSS_POOL).toContain(mid1);
  expect(MIDDLE_BOSS_POOL).toContain(mid2);
  expect(mid1).not.toBe(mid2);
});

test("initRun resets to 4 bosses with BOSS_1 first and BOSS_4 last", () => {
  const { result } = renderHook(() => useRun());
  act(() => { result.current.initRun(); });
  expect(result.current.bossSequence).toHaveLength(4);
  expect(result.current.bossSequence[0]).toBe(BOSS_1);
  expect(result.current.bossSequence[3]).toBe(BOSS_4);
  const mid1 = result.current.bossSequence[1];
  const mid2 = result.current.bossSequence[2];
  expect(MIDDLE_BOSS_POOL).toContain(mid1);
  expect(MIDDLE_BOSS_POOL).toContain(mid2);
  expect(mid1).not.toBe(mid2);
});

test("initRun resets roster to 9 Average Joes", () => {
  const { result } = renderHook(() => useRun());
  act(() => { result.current.replacePlayer(0, ZEN_MASTER); });
  act(() => { result.current.initRun(); });
  expect(result.current.roster).toHaveLength(9);
  result.current.roster.forEach(p => expect(p.id).toBe("average_joe"));
});

test("initRun resets currentBossIndex to 0", () => {
  const { result } = renderHook(() => useRun());
  act(() => { result.current.advanceBoss(); });
  act(() => { result.current.initRun(); });
  expect(result.current.currentBossIndex).toBe(0);
});

test("advanceBoss increments currentBossIndex", () => {
  const { result } = renderHook(() => useRun());
  act(() => { result.current.advanceBoss(); });
  expect(result.current.currentBossIndex).toBe(1);
  expect(result.current.getCurrentBoss()).toBe(result.current.bossSequence[1]);
});

test("isRunComplete returns false while bosses remain", () => {
  const { result } = renderHook(() => useRun());
  expect(result.current.isRunComplete()).toBe(false);
});

test("isRunComplete returns true when all 4 bosses defeated", () => {
  const { result } = renderHook(() => useRun());
  act(() => {
    result.current.advanceBoss();
    result.current.advanceBoss();
    result.current.advanceBoss();
    result.current.advanceBoss();
  });
  expect(result.current.isRunComplete()).toBe(true);
});

test("replacePlayer updates roster slot and returns updated roster", () => {
  const { result } = renderHook(() => useRun());
  let newRoster: PlayerArchetype[] = [];
  act(() => { newRoster = result.current.replacePlayer(2, ZEN_MASTER); });
  expect(newRoster[2]).toBe(ZEN_MASTER);
  expect(result.current.roster[2]).toBe(ZEN_MASTER);
  expect(result.current.roster[0].id).toBe("average_joe");
});
