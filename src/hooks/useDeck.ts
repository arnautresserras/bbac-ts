import { useRef, useState } from "react";
import { CardName } from "../types/cardName";
import { shuffleDeck } from "../utils/shuffleDeck";

export function useDeck(handSize: number) {
  const [hand, setHand] = useState<(CardName | "")[]>([]);
  const [currentDeck, setCurrentDeck] = useState<CardName[]>([]);
  const [discard, _setDiscard] = useState<CardName[]>([]);
  const handRef = useRef<(CardName | "")[]>([]);
  const discardRef = useRef<CardName[]>([]);

  const setHandWithRef = (nextHand: (CardName | "")[]) => {
    handRef.current = nextHand;
    setHand(nextHand);
  };

  const setDiscard = (next: CardName[] | ((prev: CardName[]) => CardName[])) => {
    if (typeof next === "function") {
      const newVal = next(discardRef.current);
      discardRef.current = newVal;
      _setDiscard(newVal);
    } else {
      discardRef.current = next;
      _setDiscard(next);
    }
  };

  const dealHand = (discardToRefill?: CardName[]) => {
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
  const collectHand = (): { usableCount: number; fullDiscard: CardName[] } => {
    const usableHand = handRef.current.filter((item): item is CardName => item !== "");
    const fullDiscard = [...discardRef.current, ...usableHand];
    if (usableHand.length > 0) setDiscard(fullDiscard);
    setHandWithRef([]);
    return { usableCount: usableHand.length, fullDiscard };
  };

  const reset = (newDeck: CardName[]) => {
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
