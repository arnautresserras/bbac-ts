import { BatterStats } from "../interfaces/BatterStats";
import { ModalType } from "../types/modalType";
import { updateLineupStat } from "./statsManager";

interface CardActionContext {
  pitcherStamina: number;
  maxPitcherStamina: number;
  countBalls: number;
  countStrikes: number;
  countOuts: number;
  currentBatter: number;
  bases: boolean[];
  score: number;
  lineupStats: BatterStats[];
  setCountBalls: (v: number) => void;
  setCountStrikes: (v: number) => void;
  setCountOuts: (v: number) => void;
  setScore: (v: number) => void;
  setBases: (v: boolean[]) => void;
  setLineupStats: (updater: (prev: BatterStats[]) => BatterStats[]) => void;
  setModalContent: (title: string, text: string, type: ModalType) => void;
  showModal: () => void;
  endTurn: () => void;
  endInning: () => void;
  clearBases: () => void;
  modifyStamina: (n: number) => void;
}

export function cardActions(ctx: CardActionContext) {
  const {
    setCountBalls,
    setCountStrikes,
    setCountOuts,
    setScore,
    setBases,
    setLineupStats,
    setModalContent,
    showModal,
    endTurn,
    endInning,
    clearBases,
    modifyStamina,
  } = ctx;

  // Helper function to advance runners on bases
  const advanceRunners = (newRunner: boolean) => {
    if (ctx.bases[0]) {
      setScore(ctx.score + 1);
    }
    const newBases = [...ctx.bases];
    newBases.shift();
    newBases.push(newRunner);
    setBases(newBases);
  };

  // Define ball action first for reuse inside wildPitch
  const ball = () => {
    if (ctx.pitcherStamina > 0) modifyStamina(-1);

    if (ctx.pitcherStamina > 0 && ctx.countBalls < 3) {
      setCountBalls(ctx.countBalls + 1);
    } else {
      setModalContent("Walk!", "", ModalType.TurnEnd);
      setLineupStats(prev => updateLineupStat(prev, ctx.currentBatter, "walks", 1));
      endTurn();
      showModal();
    }
  };

  const strike = () => {
    if (ctx.countStrikes < 2) {
      setCountStrikes(ctx.countStrikes + 1);
      modifyStamina(-1);
    } else {
      setModalContent("Strikeout!", "", ModalType.TurnEnd);
      setLineupStats(prev => updateLineupStat(prev, ctx.currentBatter, "atBats", 1));
      endTurn();
      setCountOuts(ctx.countOuts + 1);
      endInning();
      modifyStamina(10);
      showModal();
    }
  };

  const swing = () => {
    const odds = Math.max(ctx.pitcherStamina / ctx.maxPitcherStamina, 0.33);
    const random = Math.random();
    setLineupStats(prev => updateLineupStat(prev, ctx.currentBatter, "atBats", 1));
    if (random > odds) {
      setLineupStats(prev => updateLineupStat(prev, ctx.currentBatter, "hits", 1));
      advanceRunners(true);
      setModalContent("Base hit!", "", ModalType.TurnEnd);
    } else {
      setModalContent("Ground out!", "", ModalType.TurnEnd);
      setCountOuts(ctx.countOuts + 1);
      endInning();
    }
    endTurn();
    showModal();
  };

  const hitByPitch = () => {
    setModalContent("Hit by pitch!", "", ModalType.TurnEnd);
    setLineupStats(prev => updateLineupStat(prev, ctx.currentBatter, "hitByPitch", 1));
    endTurn();
    showModal();
  };

  const wildPitch = () => {
    modifyStamina(-1);
    if (ctx.countBalls < 3) {
      advanceRunners(false);
    }
    ball();
  };

  const homeRun = () => {
    setModalContent("HOME RUN!", "", ModalType.TurnEnd);
    showModal();
    setLineupStats(prev => {
      let updated = updateLineupStat(prev, ctx.currentBatter, "hits", 1);
      updated = updateLineupStat(updated, ctx.currentBatter, "homeRuns", 1);
      updated = updateLineupStat(updated, ctx.currentBatter, "atBats", 1);
      return updated;
    });
    setScore(ctx.score + ctx.bases.filter(Boolean).length + 1);
    clearBases();
    endTurn();
    modifyStamina(-4);
  };

  return {
    ball,
    strike,
    swing,
    hitByPitch,
    wildPitch,
    homeRun,
    advanceRunners,
  };
}
