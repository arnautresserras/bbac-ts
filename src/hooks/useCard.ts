import { useCallback, useMemo } from "react";
import { CardName } from "../types/cardName";

interface UseCardProps {
  ball: () => void;
  strike: () => void;
  swing: () => void;
  hitByPitch: () => void;
  wildPitch: () => void;
  homeRun: () => void;
  hand: (CardName | "")[];
  setHand: (hand: (CardName | "")[]) => void;
  discardCard: (card: CardName) => void;
}

export function useCard({
  ball,
  strike,
  swing,
  hitByPitch,
  wildPitch,
  homeRun,
  hand,
  setHand,
  discardCard
}: UseCardProps) {
  const cardTypes = useMemo<Partial<Record<CardName, () => void>>>(() => ({
    "Ball": ball,
    "Strike": strike,
    "Swing": swing,
    "Hit by pitch": hitByPitch,
    "Wild pitch": wildPitch,
    "Home run": homeRun,
  }), [ball, strike, swing, hitByPitch, wildPitch, homeRun]);

  const playCard = useCallback((card: CardName, index: number) => {
    const newHand = [...hand];
    newHand[index] = "";
    setHand(newHand);
    discardCard(card);

    const action = cardTypes[card];
    if (action) {
      action();
    } else {
      console.log(`No effect defined for card: ${card}`);
    }
  }, [hand, setHand, discardCard, cardTypes]);

  return {
    playCard,
  };
}
