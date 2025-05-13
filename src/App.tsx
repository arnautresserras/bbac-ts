import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import DisplayHand from "./components/DisplayHand/DisplayHand";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import DeckInfo from "./components/DeckInfo/DeckInfo";
import Modal from "./components/Modal/Modal";
import { BatterStats } from "./interfaces/BatterStats";
import DisplayLineupStats from "./components/LineupStats/DisplayLineupStats";

function App() {
  //Welcome text
  const tips =
    "<ul><li><strong>AB</strong>: Every <strong>AB</strong> you draw <strong>6 cards</strong> from your deck. Both cards you play, and unused cards go to the discard pile. Once your deck is empty, your discard pile will be shuffled and become your deck again.</li><li><strong>Pitcher stamina</strong>: The pitcher's stamina determines how likely you are to get a hit when you <strong>Swing</strong>. <strong>Using cards decreases</strong> pitcher stamina, while <strong>unused cards or strikeouts increase it</strong>. If the pitcher's stamina <strong>reaches 0</strong>, a reliever will come in <strong>at 50% stamina</strong>.</li><li><strong>Strike</strong>: The pitcher throws a strike, increasing your strike count, at <strong>3</strong> strikes <strong>you get an OUT</strong>.</li><li><strong>Ball</strong>: The pitcher throws a ball, increasing the ball count, at <strong>4</strong> balls <strong>you get on base</strong>.</li><li><strong>Swing</strong>: You swing at the next pitch, depending on the pitcher's stamina, you will be more or less likely to <strong>get a base hit</strong> or a <strong>ground out</strong>.</li><li><strong>Wild pitch</strong>: The pitcher throws a bad ball, <strong>allowing runners to advance</strong> and increasing the ball count.</li><li><strong>Hit by pitch</strong>: The pitcher hits you with the next pitch, <strong>you get on base</strong>.</li><li><strong>Home run</strong>: You hit the ball out of here! <strong>Your batter and every one of your runners score</strong>.</li></ul>";

  //Modal State and key functions
  const [modalTitle, setModalTitle] = useState("Welcome to Baseball at Cards");
  const [modalText, setModalText] = useState(
    "<p>This is a card game where every hand you play is an at bat <strong>(AB)</strong> against a pitcher. Feel free to experiment with different actions in each AB and try to score as many runs as possible in <strong>3 innings</strong> (9 outs). Here are some gameplay tips:</p>" +
      tips
  );
  const [modalMode, setModalMode] = useState("large");
  const [modalVisible, setModalVisible] = useState(true);
  const [modalCloseText, setModalCloseText] = useState("Start");
  const [modalOnClose, setModalOnClose] = useState<(() => void) | undefined>(undefined);
  const [modalSecondaryActionText, setModalSecondaryActionText] = useState<string | undefined>();
  const [modalOnSecondaryAction, setModalOnSecondaryAction] = useState<(() => void) | undefined>(undefined);
  const [modalFirstTips, setModalFirstTips] = useState(true);
  const toggleModal = () => {
    if(modalFirstTips){
      setModalVisible(!modalVisible);
      dealHand();
      updateLineupStat(currentBatter, "plateAppearance", 1);
      setModalFirstTips(false);
      setModalCloseText("Close");
    }else{
      setModalVisible(!modalVisible);
      if (hand.length === 0) {
        dealHand();
        nextBatter();
      }
    }
  };

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
  const [baseDeck, setBaseDeck] = useState([
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Ball",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Strike",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Swing",
    "Hit by pitch",
    "Hit by pitch",
    "Wild pitch",
    "Wild pitch",
    "Home run",
    "Home run",
  ]);
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [discard, setDiscard] = useState<string[]>([]);

  //Stats variables
  const initialLineupStats: BatterStats[] = [
    {
      id: 1,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 2,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 3,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 4,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 5,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 6,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 7,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 8,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
    {
      id: 9,
      plateAppearance: 0,
      atBats: 0,
      hits: 0,
      walks: 0,
      hitByPitch: 0,
      homeRuns: 0,
    },
  ];
  const [lineupStats, setLineupStats] = useState<BatterStats[]>(initialLineupStats);
  const [currentBatter, setCurrentBatter] = useState(0);
  const [showStats, setShowStats] = useState(false);

  //First run setup
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      resetState();
      shuffleDeck(baseDeck);
      return;
    }
  });

  //Pitcher relief calculations
  useEffect(() => {
    if (pitcherStamina === 0) {
      newPitcher();
    }
  }, [pitcherStamina]);

  const shuffleDeck = (deck: string[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCurrentDeck([...deck]);
  };

  const dealHand = () => {
    setHand([...currentDeck.splice(0, 6)]);
    if (currentDeck.length < 6) {
      shuffleDeck(discard);
      setDiscard([]);
    }
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

  const updateLineupStat = (
    id: number,
    stat: keyof BatterStats,
    value: number
  ) => {
    setLineupStats((prevStats) =>
      prevStats.map((player, index) =>
        index === id ? { ...player, [stat]: player[stat] + value } : player
      )
    );
  };

  const resetStats = () => {
    setLineupStats(initialLineupStats);
  };

  const nextBatter = () => {
    setCurrentBatter((previousBatter) => {
      const newBatter = (previousBatter + 1) % 9;
      updateLineupStat(newBatter, "plateAppearance", 1);
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
    shuffleDeck(baseDeck);
    setDiscard([]);
    resetStats();
    setModalOnClose(undefined);
    setModalOnSecondaryAction(undefined);
    setModalSecondaryActionText(undefined);
    setShowStats(false);
    setGameEnded(false);
    dealHand();
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
      updateLineupStat(currentBatter, "walks", 1);
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
      updateLineupStat(currentBatter, "atBats", 1);
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
    updateLineupStat(currentBatter, "atBats", 1);
    if (random > odds) {
      updateLineupStat(currentBatter, "hits", 1);
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
    updateLineupStat(currentBatter, "hitByPitch", 1);
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
    updateLineupStat(currentBatter, "hits", 1);
    updateLineupStat(currentBatter, "homeRuns", 1);
    updateLineupStat(currentBatter, "atBats", 1);
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
