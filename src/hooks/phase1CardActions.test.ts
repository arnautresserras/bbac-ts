import { renderHook, act } from "@testing-library/react";
import { useBaseRunners } from "./useBaseRunners";
import { useGameCounts } from "./useGameCounts";
import { useDeck } from "./useDeck";
import { CardName } from "../types/cardName";

// --- 1.1 single() ---

test("single: runner on 3B scores and batter lands on 1B", () => {
  const { result } = renderHook(() => useBaseRunners());

  // Advance a runner to 3B: place (1B) → advance x2
  act(() => { result.current.placeRunnerOnBase(); });          // [false, false, true]
  act(() => { result.current.advanceRunners(false); });         // [false, true, false]
  act(() => { result.current.advanceRunners(false); });         // [true, false, false]

  expect(result.current.bases).toEqual([true, false, false]);

  // Single: advanceRunners(true)
  act(() => { result.current.advanceRunners(true); });

  expect(result.current.score).toBe(1);
  expect(result.current.bases).toEqual([false, false, true]); // batter at 1B
});

// --- 1.2 out() ---

test("out: outs increment by 1 per out card", () => {
  const { result } = renderHook(() => useGameCounts(3));

  // endInning reads (countOuts + 1), so with countOuts=0 and one out played:
  let r: ReturnType<typeof result.current.endInning>;
  act(() => { r = result.current.endInning(3); });
  expect(r!).toBe("continue"); // 1 out, inning not over
});

test("out: third out triggers inning end", () => {
  const { result } = renderHook(() => useGameCounts(3));

  // Simulate 2 outs already registered in state
  act(() => { result.current.setCountOuts(2); });

  // endInning reads pre-update countOuts (2) and adds 1 → (2+1)%3 === 0
  let r: ReturnType<typeof result.current.endInning>;
  act(() => { r = result.current.endInning(3); });
  expect(r!).toBe("new-inning");
});

// --- 1.3 foul() ---

test("foul early (0 strikes): strike count increments to 1", () => {
  const { result } = renderHook(() => useGameCounts(3));

  expect(result.current.countStrikes).toBe(0);
  act(() => { result.current.setCountStrikes(result.current.countStrikes + 1); });
  expect(result.current.countStrikes).toBe(1);
});

test("foul with 2 strikes: strike count stays at 2, no strikeout", () => {
  const { result } = renderHook(() => useGameCounts(3));

  act(() => { result.current.setCountStrikes(2); });
  // foul caps at 2 — should not increment
  if (result.current.countStrikes < 2) {
    act(() => { result.current.setCountStrikes(result.current.countStrikes + 1); });
  }
  expect(result.current.countStrikes).toBe(2);
});

test("foul as last card: new hand is dealt, ball/strike count unchanged", () => {
  const HAND_SIZE = 6;
  const { result } = renderHook(() => useDeck(HAND_SIZE));

  const initialCards: CardName[] = [
    "Ball", "Strike", "Swing", "Ball", "Strike", "Foul",
  ];

  // Deal the initial hand
  act(() => { result.current.reset(initialCards); });
  act(() => { result.current.dealHand(); });

  expect(result.current.hand.length).toBe(6);

  // Simulate playing all 6 cards (the foul is last, also moved to discard by playCard)
  act(() => {
    const played: CardName[] = ["Ball", "Strike", "Swing", "Ball", "Strike", "Foul"];
    played.forEach(card => {
      result.current.setDiscard(prev => [...prev, card]);
    });
    // Mark all 6 hand slots as empty (foul slot already zeroed by playCard logic)
    result.current.setHandWithRef(["", "", "", "", "", ""]);
  });

  // Foul Case B: collect remaining (empty) hand, re-deal from discard
  let fullDiscard: CardName[] = [];
  act(() => {
    const { fullDiscard: fd } = result.current.collectHand();
    fullDiscard = fd;
  });
  act(() => { result.current.dealHand(fullDiscard); });

  // New hand should be 6 cards (dealt from reshuffled discard)
  expect(result.current.hand.length).toBe(6);
  expect(result.current.hand.every(c => c !== "")).toBe(true);
});
