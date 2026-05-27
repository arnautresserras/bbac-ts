import { renderHook, act } from "@testing-library/react";
import { useGameCounts, InningResult } from "./useGameCounts";

// Use maxOutsPerInning=1 so each endInning call (countOuts starts at 0) triggers an inning boundary.
// This tests the maxInnings parameter without needing to simulate many outs.

test('endInning(3) returns "game-over" on the 3rd inning', () => {
  const { result } = renderHook(() => useGameCounts(1));
  let r: InningResult;

  act(() => { r = result.current.endInning(3); });
  expect(r!).toBe("new-inning"); // inning 1 → 2

  act(() => { r = result.current.endInning(3); });
  expect(r!).toBe("new-inning"); // inning 2 → 3

  act(() => { r = result.current.endInning(3); });
  expect(r!).toBe("game-over"); // inning 3 is max
});

test('endInning(5) returns "game-over" on the 5th inning', () => {
  const { result } = renderHook(() => useGameCounts(1));
  let r: InningResult;

  for (let i = 0; i < 4; i++) {
    act(() => { r = result.current.endInning(5); });
    expect(r!).toBe("new-inning");
  }

  act(() => { r = result.current.endInning(5); });
  expect(r!).toBe("game-over"); // inning 5 is max
});
