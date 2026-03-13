import { useCallback } from "react";
import { cardActions } from "../logic/cardActions";

interface UseCardProps {
  ball: () => void;
  strike: () => void;
  swing: () => void;
  hitByPitch: () => void;
  wildPitch: () => void;
  homeRun: () => void;
  hand: string[];
  setHand: (hand: string[]) => void;
  discardCard: (card: string) => void;
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
  const cardTypes: Record<string, () => void> = {
    "Ball": ball,
    "Strike": strike,
    "Swing": swing,
    "Hit by pitch": hitByPitch,
    "Wild pitch": wildPitch,
    "Home run": homeRun,
  };

  const playCard = useCallback((card: string, index: number) => {
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
