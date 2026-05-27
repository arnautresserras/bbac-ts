import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import DisplayHand from "./components/DisplayHand/DisplayHand";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import DeckInfo from "./components/DeckInfo/DeckInfo";
import Modal from "./components/Modal/Modal";
import { BatterStats } from "./interfaces/BatterStats";
import DisplayLineupStats from "./components/LineupStats/DisplayLineupStats";
import { welcomeText } from "./data/gameTips";
import { buildDeckFromRoster } from "./utils/buildDeck";
import { AVERAGE_JOE } from "./data/playerArchetypes";
import { initialLineupStats, resetStats, updateLineupStat } from "./logic/statsManager";
import { shuffleDeck } from "./utils/shuffleDeck";
import { useModal } from "./hooks/useModal";
import { useCard } from "./hooks/useCard";
import { CardName } from "./types/cardName";
import { ModalType } from "./types/modalType";
import { useGameCounts } from "./hooks/useGameCounts";
import { usePitcher } from "./hooks/usePitcher";
import { useBaseRunners } from "./hooks/useBaseRunners";
import { useDeck } from "./hooks/useDeck";
import { useRun } from "./hooks/useRun";
import { BOSS_1 } from "./data/bosses";

const HAND_SIZE = 6;
const MAX_OUTS_PER_INNING = 3;
const MAX_BALLS_BEFORE_WALK = 3;
const LINEUP_SIZE = 9;

function App() {
  const {
    modalProps, showModal, shouldHideHand,
    setModalContent, setPrimaryAction, clearPrimaryAction,
    setSecondaryAction, clearSecondaryAction,
  } = useModal();

  const run = useRun();
  const counts = useGameCounts(MAX_OUTS_PER_INNING);
  const pitcher = usePitcher(BOSS_1.initialStamina, BOSS_1.maxStamina);
  const baseRunners = useBaseRunners();
  const deck = useDeck(HAND_SIZE);

  const [lineupStats, setLineupStats] = useState<BatterStats[]>(initialLineupStats);
  const [currentBatter, setCurrentBatter] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [runResult, setRunResult] = useState<"playing" | "boss-win" | "boss-loss">("playing");
  const [modalFirstTips, setModalFirstTips] = useState(true);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      setModalContent("Welcome to Baseball at Cards", welcomeText, ModalType.Info);
      setPrimaryAction("Start", () => {
        deck.reset(shuffleDeck(buildDeckFromRoster(Array(9).fill(AVERAGE_JOE))));
        deck.dealHand();
        setLineupStats(prev => updateLineupStat(prev, currentBatter, "plateAppearance", 1));
        setModalFirstTips(false);
        clearPrimaryAction();
      });
      resetState();
      return;
    }
  });

  const newPitcherRef = useRef(() => {});
  newPitcherRef.current = () => {
    pitcher.swapPitcher();
    setModalContent("New pitcher!", "", ModalType.PitcherChange);
    setPrimaryAction("Close");
    showModal();
  };

  useEffect(() => {
    if (pitcher.pitcherStamina === 0) newPitcherRef.current();
  }, [pitcher.pitcherStamina]);

  const nextBatter = () => {
    setCurrentBatter(prev => {
      const next = (prev + 1) % LINEUP_SIZE;
      setLineupStats(stats => updateLineupStat(stats, next, "plateAppearance", 1));
      return next;
    });
  };

  const endTurn = () => {
    const { usableCount, fullDiscard } = deck.collectHand();
    pitcher.modifyStamina(usableCount - 1);
    counts.resetCount();
    deck.dealHand(fullDiscard);
    nextBatter();
  };

  const handleEndInning = () => {
    const result = counts.endInning(run.getCurrentBoss().maxInnings);
    if (result === "new-inning") {
      baseRunners.clearBases();
      pitcher.modifyStamina(5);
    } else if (result === "game-over") {
      endBossLoss();
    }
  };

  const endGameStats = () => {
    setShowStats(true);
    showModal();
  };

  const endBossLoss = () => {
    setRunResult("boss-loss");
    const runs = baseRunners.score;
    const target = run.getCurrentBoss().targetRuns;
    setModalContent("Game over!", `You scored ${runs} ${runs === 1 ? "run" : "runs"}. Target was ${target}.`, ModalType.GameEnd);
    setSecondaryAction("Show Stats", endGameStats);
    setPrimaryAction("New game", resetState);
  };

  const checkBossWinRef = useRef(() => {});
  checkBossWinRef.current = () => {
    if (runResult !== "playing") return;
    if (baseRunners.score >= run.getCurrentBoss().targetRuns) {
      setRunResult("boss-win");
      const boss = run.getCurrentBoss();
      const runs = baseRunners.score;
      setModalContent(`${boss.name} defeated!`, `You scored ${runs} ${runs === 1 ? "run" : "runs"} in ${boss.maxInnings} innings!`, ModalType.GameEnd);
      setSecondaryAction("Show Stats", endGameStats);
      setPrimaryAction("New game", resetState);
      showModal();
    }
  };

  useEffect(() => {
    checkBossWinRef.current();
  }, [baseRunners.score]);

  const resetState = () => {
    run.initRun();
    baseRunners.reset();
    counts.reset();
    pitcher.reset(BOSS_1.initialStamina, BOSS_1.maxStamina);
    const newDeck = shuffleDeck(buildDeckFromRoster(Array(9).fill(AVERAGE_JOE)));
    deck.reset(newDeck);
    deck.dealHand();
    setCurrentBatter(0);
    setLineupStats(resetStats());
    setShowStats(false);
    setRunResult("playing");
    clearSecondaryAction();
    setPrimaryAction("Close");
  };

  const ball = () => {
    if (counts.countBalls < MAX_BALLS_BEFORE_WALK) {
      counts.setCountBalls(counts.countBalls + 1);
      pitcher.modifyStamina(-1);
    } else {
      setModalContent("Walk!", "", ModalType.TurnEnd);
      showModal();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "walks", 1));
      endTurn();
      baseRunners.placeRunnerOnBase();
    }
  };

  const strike = () => {
    if (counts.countStrikes < 2) {
      counts.setCountStrikes(counts.countStrikes + 1);
      pitcher.modifyStamina(-1);
    } else {
      setModalContent("Strikeout!", "", ModalType.TurnEnd);
      showModal();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
      endTurn();
      counts.setCountOuts(counts.countOuts + 1);
      handleEndInning();
      pitcher.modifyStamina(10);
    }
  };

  const swing = () => {
    const odds = Math.max(pitcher.pitcherStamina / pitcher.maxPitcherStamina, 0.33);
    const random = Math.random();
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
    if (random > odds) {
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "hits", 1));
      baseRunners.advanceRunners(true);
      setModalContent("Base hit!", "", ModalType.TurnEnd);
      endTurn();
    } else {
      setModalContent("Ground out!", "", ModalType.TurnEnd);
      endTurn();
      counts.setCountOuts(counts.countOuts + 1);
      handleEndInning();
    }
    showModal();
  };

  const hitByPitch = () => {
    setModalContent("Hit by pitch!", "", ModalType.TurnEnd);
    showModal();
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "hitByPitch", 1));
    endTurn();
    baseRunners.placeRunnerOnBase();
  };

  const wildPitch = () => {
    pitcher.modifyStamina(-1);
    if (counts.countBalls < MAX_BALLS_BEFORE_WALK) {
      ball();
      baseRunners.advanceRunners(false);
    } else {
      setModalContent("Walk!", "", ModalType.TurnEnd);
      showModal();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "walks", 1));
      endTurn();
      baseRunners.advanceAndPlace();
    }
  };

  const homeRun = () => {
    setModalContent("HOME RUN!", "", ModalType.TurnEnd);
    showModal();
    setLineupStats(prev => {
      let updated = updateLineupStat(prev, currentBatter, "hits", 1);
      updated = updateLineupStat(updated, currentBatter, "homeRuns", 1);
      updated = updateLineupStat(updated, currentBatter, "atBats", 1);
      return updated;
    });
    baseRunners.addScore(baseRunners.countRunners(baseRunners.bases) + 1);
    baseRunners.clearBases();
    endTurn();
    pitcher.modifyStamina(-4);
  };

  const single = () => {
    setLineupStats(prev => {
      let updated = updateLineupStat(prev, currentBatter, "hits", 1);
      updated = updateLineupStat(updated, currentBatter, "atBats", 1);
      return updated;
    });
    baseRunners.advanceRunners(true);
    setModalContent("Single!", "", ModalType.TurnEnd);
    showModal();
    endTurn();
  };

  const out = () => {
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
    setModalContent("Out!", "", ModalType.TurnEnd);
    showModal();
    endTurn();
    counts.setCountOuts(counts.countOuts + 1);
    handleEndInning();
  };

  const foul = () => {
    const remaining = deck.handRef.current.filter(c => c !== "").length;
    if (remaining > 0) {
      if (counts.countStrikes < 2) {
        counts.setCountStrikes(counts.countStrikes + 1);
      }
      pitcher.modifyStamina(-1);
    } else {
      const { fullDiscard } = deck.collectHand();
      deck.dealHand(fullDiscard);
    }
  };

  const { playCard } = useCard({
    ball, strike, swing, hitByPitch, wildPitch, homeRun, single, out, foul,
    hand: deck.hand,
    setHand: deck.setHandWithRef,
    discardCard: (card: CardName) => deck.setDiscard(prev => [...prev, card]),
  });

  return (
    <div className="App">
      <Modal {...modalProps} />
      <div className="BbaC-body">
        <ScoreBoard
          score={baseRunners.score}
          pitcherStamina={pitcher.pitcherStamina}
          maxPitcherStamina={pitcher.maxPitcherStamina}
          balls={counts.countBalls}
          strikes={counts.countStrikes}
          outs={counts.countOuts}
          inning={counts.inning}
          bases={baseRunners.bases}
          bossName={run.getCurrentBoss().name}
          bossTier={run.getCurrentBoss().tier}
          maxInnings={run.getCurrentBoss().maxInnings}
          targetRuns={run.getCurrentBoss().targetRuns}
        />
        {!showStats ? (
          <>
            <div className={shouldHideHand(modalProps.mode) && modalProps.isOpen ? "hidden-hand" : ""}>
              <DisplayHand playCard={playCard} hand={deck.hand} />
            </div>
            <DeckInfo
              currentDeck={deck.currentDeck.length}
              discard={deck.discard.length}
              hand={deck.hand.length}
            />
          </>
        ) : null}
        {showStats && (
          <DisplayLineupStats lineupStats={lineupStats} currentBatter={currentBatter} />
        )}
        <button
          className="statsButton"
          onClick={() => { runResult !== "playing" ? resetState() : setShowStats(!showStats); }}
        >
          {runResult !== "playing" ? "Play again" : (showStats ? "Hide" : "Show") + " Stats"}
        </button>
      </div>
    </div>
  );
}

export default App;
