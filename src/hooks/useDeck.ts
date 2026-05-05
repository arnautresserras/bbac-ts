import { useRef, useState } from "react";
import { shuffleDeck } from "../utils/shuffleDeck";

export function useDeck(handSize: number) {
  const [hand, setHand] = useState<string[]>([]);
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [discard, _setDiscard] = useState<string[]>([]);
  const handRef = useRef<string[]>([]);
  const discardRef = useRef<string[]>([]);

  const setHandWithRef = (nextHand: string[]) => {
    handRef.current = nextHand;
    setHand(nextHand);
  };

  const setDiscard = (next: string[] | ((prev: string[]) => string[])) => {
    if (typeof next === "function") {
      const newVal = next(discardRef.current);
      discardRef.current = newVal;
      _setDiscard(newVal);
    } else {
      discardRef.current = next;
      _setDiscard(next);
    }
  };

  const dealHand = (discardToRefill?: string[]) => {
    setCurrentDeck(prevDeck => {
      let deckCopy = [...prevDeck];
      if (deckCopy.length < handSize && discardToRefill && discardToRefill.length > 0) {
        deckCopy = shuffleDeck([...deckCopy, ...discardToRefill]);
        setDiscard([]);
      }
      const newHand = deckCopy.splice(0, handSize);
      setHandWithRef(newHand);
      return deckCopy;
    });
  };

  // Moves the remaining hand into discard and returns the count of playable cards
  // and the combined discard pile, for the caller to use (stamina, re-deal).
  const collectHand = (): { usableCount: number; fullDiscard: string[] } => {
    const usableHand = handRef.current.filter(item => item.trim() !== "");
    const fullDiscard = [...discardRef.current, ...usableHand];
    if (usableHand.length > 0) setDiscard(fullDiscard);
    setHandWithRef([]);
    return { usableCount: usableHand.length, fullDiscard };
  };

  const reset = (newDeck: string[]) => {
    setCurrentDeck(newDeck);
    setHandWithRef([]);
    setDiscard([]);
  };

  return {
    hand, currentDeck, discard,
    setHandWithRef, setDiscard,
    dealHand, collectHand, reset,
  };
}
