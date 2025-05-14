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

function App() {
  //Modal State and key functions
  const [modalTitle, setModalTitle] = useState("Welcome to Baseball at Cards");
  const [modalText, setModalText] = useState(welcomeText);
  const [modalMode, setModalMode] = useState("large");
  const [modalVisible, setModalVisible] = useState(true);
  const [modalCloseText, setModalCloseText] = useState("Start");
  const [modalOnClose, setModalOnClose] = useState<(() => void) | undefined>(undefined);
  const [modalSecondaryActionText, setModalSecondaryActionText] = useState<string | undefined>();
  const [modalOnSecondaryAction, setModalOnSecondaryAction] = useState<(() => void) | undefined>(undefined);
  const [modalFirstTips, setModalFirstTips] = useState(true);

  //Game variables
  const [maxPitcherStamina, setMaxPitcherStamina] = useState(25);
  //const [swingPower, setSwingPower] = useState(4);
  const [score, setScore] = useState(0);
  const [pitcherStamina, setPitcherStamina] = useState(20);
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

  //Stats variables
  const [lineupStats, setLineupStats] = useState<BatterStats[]>(initialLineupStats);
  const [currentBatter, setCurrentBatter] = useState(0);
  const [showStats, setShowStats] = useState(false);

  //First run setup
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      resetState();
      return;
    }
  });
  const toggleModal = () => {
    if(modalFirstTips){
      setModalVisible(!modalVisible);
      dealHand(shuffleDeck(getStarterDeck()));
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "plateAppearance", 1));
      setModalFirstTips(false);
      setModalCloseText("Close");
    }else{
      setModalVisible(!modalVisible);
      if (hand.length === 0) {
        dealHand(currentDeck);
        nextBatter();
      }
    }
  };

  //Pitcher relief calculations
  useEffect(() => {
    if (pitcherStamina === 0) {
      newPitcher();
    }
  }, [pitcherStamina]);

  const dealHand = (deck: string[]) => {
    let deckCopy = [...deck];
    if (deckCopy.length < 6) {
      const rebuiltDeck = shuffleDeck([...discard]);
      deckCopy = [...rebuiltDeck];
      setDiscard([]);
    }
    const newHand = deckCopy.splice(0, 6);
    setCurrentDeck(deckCopy);
    setHand(newHand);
  };

  const newPitcher = () => {
    setMaxPitcherStamina(15);
    setPitcherStamina(10);
    setModalTitle("New pitcher!");
    setModalText("");
    setModalMode("small");
    setModalVisible(true);
  };

  const modifyStamina = (ammount: number) => {
    if (ammount > 0) {
      pitcherStamina + ammount > maxPitcherStamina
        ? setPitcherStamina(maxPitcherStamina)
        : setPitcherStamina(pitcherStamina + ammount);
    } else {
      pitcherStamina + ammount < 0
        ? setPitcherStamina(0)
        : setPitcherStamina(pitcherStamina + ammount);
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
      const newBatter = (previousBatter + 1) % 9;
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
    setHand([]);
    shuffleDeck(getStarterDeck());
    setDiscard([]);
    setLineupStats(resetStats());
    setModalOnClose(undefined);
    setModalOnSecondaryAction(undefined);
    setModalSecondaryActionText(undefined);
    setShowStats(false);
    setGameEnded(false);
    dealHand(getStarterDeck());
  };

  const endGameStats = () => {
    setShowStats(true);
    setModalVisible(false);
  }

  const advanceRunners = (newRunner: boolean) => {
    if (bases[0]) {
      setScore(score + 1);
    }
    let newBases = bases;
    newBases.shift();
    newBases.push(newRunner);
    setBases(newBases);
  };

  const ball = () => {
    if (countBalls < 3) {
      setCountBalls(countBalls + 1);
      modifyStamina(-1);
    } else {
      setModalTitle("Walk!");
      setModalText("");
      setModalMode("small");
      setModalVisible(true);
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "walks", 1));
      endTurn();
      if (bases.includes(false)) {
        if (bases[2]) {
          if (bases[0]) {
            let newBases = bases;
            newBases[1] = true;
            setBases(newBases);
          } else {
            advanceRunners(true);
          }
        } else {
          let newBases = bases;
          newBases[2] = true;
          setBases(newBases);
        }
      } else {
        advanceRunners(true);
      }
    }
  };

  const strike = () => {
    if (countStrikes < 2) {
      setCountStrikes(countStrikes + 1);
      modifyStamina(-1);
    } else {
      setModalTitle("Strikeout!");
      setModalText("");
      setModalMode("small");
      setModalVisible(true);
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
      endTurn();
      setCountOuts(countOuts + 1);
      endInning();
      modifyStamina(10);
    }
  };

  const swing = () => {
    var odds = Math.max(pitcherStamina / maxPitcherStamina, 0.33);
    var random = Math.random();
    setModalText("");
    setModalMode("small");
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
    if (random > odds) {
      setLineupStats(prev => updateLineupStat(prev, currentBatter, "hits", 1));
      advanceRunners(true);
      setModalTitle("Base hit!");
      endTurn();
    } else {
      setModalTitle("Ground out!");
      endTurn();
      setCountOuts(countOuts + 1);
      endInning();
    }
    setModalVisible(true);
  };

  const hitByPitch = () => {
    setModalTitle("Hit by pitch!");
    setModalText("");
    setModalMode("small");
    setModalVisible(true);
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "hitByPitch", 1));
    endTurn();
    if (bases.includes(false)) {
      if (bases[2]) {
        if (bases[0]) {
          let newBases = bases;
          newBases[1] = true;
          setBases(newBases);
        } else {
          advanceRunners(true);
        }
      } else {
        let newBases = bases;
        newBases[2] = true;
        setBases(newBases);
      }
    } else {
      advanceRunners(true);
    }
  };

  const wildPitch = () => {
    modifyStamina(-1);
    if (countBalls < 3) {
      ball();
      advanceRunners(false);
    } else {
      ball();
    }
  };

  const homeRun = () => {
    setModalTitle("HOME RUN!");
    setModalText("");
    setModalMode("small");
    setModalVisible(true);
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "hits", 1));
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "homeRuns", 1));
    setLineupStats(prev => updateLineupStat(prev, currentBatter, "atBats", 1));
    setScore(score + countRunners(bases) + 1);
    clearBases();
    endTurn();
    modifyStamina(-4);
  };

  const endTurn = () => {
    let usableHand = hand.filter((item) => item.trim() !== "");
    discard.push.apply(discard, usableHand);
    modifyStamina(usableHand.length - 1);
    resetCount();
    setHand([]);
  };

  const endInning = () => {
    if (countOuts !== 0 && (countOuts + 1) % 3 === 0) {
      if (inning === 3) {
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
    setModalTitle("Game over!");
    setModalText("You scored " + score + (score === 1 ? " run" : " runs."));
    setModalSecondaryActionText("Show Stats");
    setModalOnSecondaryAction(() => endGameStats);
    setModalMode("small");
    setModalVisible(true);
    setModalOnClose(() => resetState);
  };

  const playCard = (card: string, index: number) => {
    let newHand = hand;
    let discardedCard = newHand.splice(index, 1, "");
    discard.push(...discardedCard);
    setHand(newHand);
    switch (card) {
      case "Ball":
        ball();
        break;
      case "Strike":
        strike();
        break;
      case "Swing":
        swing();
        break;
      case "Hit by pitch":
        hitByPitch();
        break;
      case "Wild pitch":
        wildPitch();
        break;
      case "Home run":
        homeRun();
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <Modal
        title={modalTitle}
        content={modalText}
        mode={modalMode}
        isOpen={modalVisible}
        toggleModal={toggleModal}
        primaryActionText={modalCloseText}
        onClose={modalOnClose}
        secondaryActionText={modalSecondaryActionText}
        onSecondaryAction={modalOnSecondaryAction}
      />
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
            <DisplayHand playCard={playCard} hand={hand}></DisplayHand>
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
