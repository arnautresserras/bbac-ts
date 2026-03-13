import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import DisplayHand from "./components/DisplayHand/DisplayHand";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import DeckInfo from "./components/DeckInfo/DeckInfo";
import Modal from "./components/Modal/Modal";
import { BatterStats } from "./interfaces/BatterStats";
import DisplayLineupStats from "./components/LineupStats/DisplayLineupStats";
import { welcomeText } from "./data/gameTips";
import { getStarterDeck } from "./data/starterDeck";
import { initialLineupStats, resetStats, updateLineupStat } from "./logic/statsManager";
import { shuffleDeck } from "./utils/shuffleDeck";
import { useModal } from "./hooks/useModal";
import { useCard } from "./hooks/useCard";
import { ModalType } from "./types/modalType";

function App() {
  //Modal State and key functions
  const [modalFirstTips, setModalFirstTips] = useState(true);
  const {
    modalProps,
    showModal,
    shouldHideHand,
    setModalContent,
    setPrimaryAction,
    clearPrimaryAction,
    setSecondaryAction,
    clearSecondaryAction
  } = useModal();

  //Numeric constants
  const HAND_SIZE = 6;
  const MAX_OUTS_PER_INNING = 3; 
  const MAX_BALLS_BEFORE_WALK = 3;
  const MAX_INNINGS = 3;
  const LINEUP_SIZE = 9; 
  const INITIAL_PITCHER_STAMINA = 20; 
  const MAX_PITCHER_STAMINA = 25;
  const FIRST_BASE = 0;
  const SECOND_BASE = 1;
  const THIRD_BASE = 2;

  //Game variables
  const [maxPitcherStamina, setMaxPitcherStamina] = useState(MAX_PITCHER_STAMINA);
  const [score, setScore] = useState(0);
  const [pitcherStamina, setPitcherStamina] = useState(INITIAL_PITCHER_STAMINA);
  const [countBalls, setCountBalls] = useState(0);
  const [countStrikes, setCountStrikes] = useState(0);
  const [countOuts, setCountOuts] = useState(0);
  const [inning, setInning] = useState(1);
  const [bases, setBases] = useState([false, false, false]);
  const [gameEnded, setGameEnded] = useState(false);

  //Card variables
  const [hand, setHand] = useState<string[]>([]);
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [discard, setDiscard] = useState<string[]>([]);
  const handRef = useRef<string[]>([]);
  const setHandWithRef = (nextHand: string[]) => {
    handRef.current = nextHand;
    setHand(nextHand);
  };

  //Stats variables
  const [lineupStats, setLineupStats] = useState<BatterStats[]>(initialLineupStats);
  const [currentBatter, setCurrentBatter] = useState(0);
  const [showStats, setShowStats] = useState(false);

  //First run setup
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      setModalContent("Welcome to Baseball at Cards", welcomeText, ModalType.Info);
      setPrimaryAction("Start", () => {
        setCurrentDeck(shuffleDeck(getStarterDeck()));
        dealHand();
        setLineupStats(prev => updateLineupStat(prev, currentBatter, "plateAppearance", 1));
        setModalFirstTips(false);
        clearPrimaryAction();
      });
      resetState();
      return;
    }
  });

  //Pitcher relief calculations
  useEffect(() => {
    if (pitcherStamina === 0) {
      newPitcher();
    }
  }, [pitcherStamina]);

  const refillDeck = (fullDiscard: string[]) => {
    setCurrentDeck(prevDeck => {
      if (prevDeck.length >= HAND_SIZE) return prevDeck;
      const newDeck = shuffleDeck([...prevDeck, ...fullDiscard]);
      setDiscard([]);
      return newDeck;
    });
  };

  const dealHand = () => {
    setCurrentDeck(prevDeck => {
      const deckCopy = [...prevDeck];

      const newHand = deckCopy.splice(0, HAND_SIZE);
      setHandWithRef(newHand);
      
      return deckCopy;
    });
  };

  const newPitcher = () => {
    setMaxPitcherStamina(15);
    setPitcherStamina(10);
    setModalContent("New pitcher!", "", ModalType.PitcherChange);
    setPrimaryAction("Close");
    showModal();
  };

  const modifyStamina = (amount: number) => {
    if (amount > 0) {
      pitcherStamina + amount > maxPitcherStamina
        ? setPitcherStamina(maxPitcherStamina)
        : setPitcherStamina(pitcherStamina + amount);
    } else {
      pitcherStamina + amount < 0
        ? setPitcherStamina(0)
        : setPitcherStamina(pitcherStamina + amount);
    }
  };

  const clearBases = () => {
    setBases([false, false, false]);
  };

  const countRunners = (arr: boolean[]) =>
    arr.reduce((a, v) => (v === true ? a + 1 : a), 0);

  const resetCount = () => {
    setCountBalls(0);
    setCountStrikes(0);
  };

  const nextBatter = () => {
    setCurrentBatter((previousBatter) => {
      const newBatter = (previousBatter + 1) % LINEUP_SIZE;
      setLineupStats(prev => updateLineupStat(prev, newBatter, "plateAppearance", 1));
      return newBatter;
    });
  };

  const resetState = () => {
    setScore(0);
    setInning(1);
    setPitcherStamina(20);
    setMaxPitcherStamina(25);
    resetCount();
    clearBases();
    setCountOuts(0);
    setCurrentBatter(0);
    setHandWithRef([]);
    setDiscard([]);
    setLineupStats(resetStats());
    setShowStats(false);
    setGameEnded(false);
    clearSecondaryAction();
    setPrimaryAction("Close");
    const newDeck = shuffleDeck(getStarterDeck());
    setCurrentDeck(newDeck);
    dealHand();
  };

  const endGameStats = () => {
    setShowStats(true);
    showModal();
  }

  const advanceRunners = (newRunner: boolean) => {
    if (bases[0]) {
      setScore(score + 1);
    }
    const newBases = [...bases];
    newBases.shift();
    newBases.push(newRunner);
    setBases(newBases);
  };

  const placeRunnerOnBase = () => { 
    //Bases are full
    if (!bases.includes(false)) { 
      advanceRunners(true); 
      return; 
    }

    if (bases[THIRD_BASE]) {
      if (bases[FIRST_BASE]) {
        const newBases = [...bases];
        newBases[SECOND_BASE] = true;
        setBases(newBases);
      } else {
        advanceRunners(true);
      }
    } else {
      const newBases = [...bases];
      newBases[THIRD_BASE] = true;
      setBases(newBases);
    }
  }

  const ball = () => {
    if (countBalls < MAX_BALLS_BEFORE_WALK) {
      setCountBalls(countBalls + 1);
      modifyStamina(-1);
    } else {
      setModalContent("Walk!", "", ModalType.TurnEnd);
      showModal();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "walks", 1));
      endTurn();
      placeRunnerOnBase();
    }
  };

  const strike = () => {
    if (countStrikes < 2) {
      setCountStrikes(countStrikes + 1);
      modifyStamina(-1);
    } else {
      setModalContent("Strikeout!", "", ModalType.TurnEnd);
      showModal();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
      endTurn();
      setCountOuts(countOuts + 1);
      endInning();
      modifyStamina(10);
    }
  };

  const swing = () => {
    let odds = Math.max(pitcherStamina / maxPitcherStamina, 0.33);
    let random = Math.random();
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
    if (random > odds) {
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "hits", 1));
      advanceRunners(true);
      setModalContent("Base hit!", "", ModalType.TurnEnd);
      endTurn();
    } else {
      setModalContent("Ground out!", "", ModalType.TurnEnd);
      endTurn();
      setCountOuts(countOuts + 1);
      endInning();
    }
    
    showModal();
  };

  const hitByPitch = () => {
    setModalContent("Hit by pitch!", "", ModalType.TurnEnd);
    showModal();
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "hitByPitch", 1));
    endTurn();
    placeRunnerOnBase();
  };

  const wildPitch = () => {
    modifyStamina(-1);
    if (countBalls < MAX_BALLS_BEFORE_WALK) {
      ball();
      advanceRunners(false);
    } else {
      ball();
    }
  };

  const homeRun = () => {
    setModalContent("HOME RUN!", "", ModalType.TurnEnd);
    showModal();
    setLineupStats(prev => { 
      let updated = updateLineupStat(prev, currentBatter, "hits", 1);
      updated = updateLineupStat(updated, currentBatter, "homeRuns", 1);
      updated = updateLineupStat(updated, currentBatter, "atBats", 1);
    return updated; });
    setScore(score + countRunners(bases) + 1);
    clearBases();
    endTurn();
    modifyStamina(-4);
  };

  const endTurn = () => {
    const usableHand = handRef.current.filter((item) => item.trim() !== "");
    if (usableHand.length > 0) {
      setDiscard((prev) => [...prev, ...usableHand]);
    }
    modifyStamina(usableHand.length - 1);
    resetCount();
    setHandWithRef([]);
    //refillDeck([...discardCopy, ...usableHand]);
    dealHand();
    nextBatter();
  };

  const endInning = () => {
    if (countOuts !== 0 && (countOuts + 1) % MAX_OUTS_PER_INNING === 0) {
      if (inning === MAX_INNINGS) {
        endGame();
        return;
      }
      setCountOuts(0);
      setInning(inning + 1);
      clearBases();
      modifyStamina(5);
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setModalContent("Game over!", "You scored " + score + (score === 1 ? " run" : " runs."), ModalType.TurnEnd);
    setSecondaryAction("Show Stats", endGameStats);
    setPrimaryAction("New game", resetState);
  };

  const { playCard } = useCard({
    ball,
    strike,
    swing,
    hitByPitch,
    wildPitch,
    homeRun,
    hand,
    setHand: setHandWithRef,
    discardCard: (card: string) => setDiscard((prev) => [...prev, card])
  });

  return (
    <div className="App">
      <Modal {...modalProps} />
      <div className="BbaC-body">
        <ScoreBoard
          score={score}
          pitcherStamina={pitcherStamina}
          maxPitcherStamina={maxPitcherStamina}
          balls={countBalls}
          strikes={countStrikes}
          outs={countOuts}
          inning={inning}
          bases={bases}
        ></ScoreBoard>
        {!showStats ? (
          <>
            <div className={shouldHideHand(modalProps.mode) && modalProps.isOpen ? "hidden-hand" : ""}>
              <DisplayHand playCard={playCard} hand={hand}></DisplayHand>
            </div>
            <DeckInfo
              currentDeck={currentDeck.length}
              discard={discard.length}
              hand={hand.length}
            ></DeckInfo>
          </>
        ) : null}
        {showStats && (
          <DisplayLineupStats
            lineupStats={lineupStats}
            currentBatter={currentBatter}
          ></DisplayLineupStats>
        )}
        <button
          className="statsButton"
          onClick={() => {
            gameEnded ? resetState() : setShowStats(!showStats)
          }}
        >
          {gameEnded ? "Play again" : (showStats ? "Hide" : "Show") + " Stats"}
        </button>
      </div>
    </div>
  );
}

export default App;
