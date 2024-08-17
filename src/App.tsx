import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import DisplayHand from './components/DisplayHand/DisplayHand';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import DeckInfo from './components/DeckInfo/DeckInfo';
import Modal from './components/Modal/Modal';

function App() {
  //Welcome text
  const tips = "<ul><li><strong>AB</strong>: Every <strong>AB</strong> you draw <strong>6 cards</strong> from your deck. Both cards you play, and unused cards go to the discard pile. Once your deck is empty, your discard pile will be shuffled and become your deck again.</li><li><strong>Pitcher stamina</strong>: The pitcher's stamina determines how likely you are to get a hit when you <strong>Swing</strong>. <strong>Using cards decreases</strong> pitcher stamina, while <strong>unused cards or strikeouts increase it</strong>. If the pitcher's stamina <strong>reaches 0</strong>, a reliever will come in <strong>at 50% stamina</strong>.</li><li><strong>Strike</strong>: The pitcher throws a strike, increasing your strike count, at <strong>3</strong> strikes <strong>you get an OUT</strong>.</li><li><strong>Ball</strong>: The pitcher throws a ball, increasing the ball count, at <strong>4</strong> balls <strong>you get on base</strong>.</li><li><strong>Swing</strong>: You swing at the next pitch, depending on the pitcher's stamina, you will be more or less likely to <strong>get a base hit</strong> or a <strong>ground out</strong>.</li><li><strong>Wild pitch</strong>: The pitcher throws a bad ball, <strong>allowing runners to advance</strong> and increasing the ball count.</li><li><strong>Hit by pitch</strong>: The pitcher hits you with the next pitch, <strong>you get on base</strong>.</li><li><strong>Home run</strong>: You hit the ball out of here! <strong>Your batter and every one of your runners score</strong>.</li></ul>";
  
  //Modal State
  const [modalTitle, setModalTitle] = useState("Welcome to Baseball at Cards");
  const [modalText, setModalText] = useState("<p>This is a card game where every hand you play is an at bat <strong>(AB)</strong> against a pitcher. Feel free to experiment with different actions in each AB and try to score as many runs as possible in <strong>3 innings</strong> (9 outs). Here are some gameplay tips:</p>"+tips);
  const [modalMode, setModalMode] = useState("large");
  const [modalVisible, setModalVisible] = useState(true);

  //Game variables
  const [maxPitcherStamina, setMaxPitcherStamina] = useState(25);
  const [swingPower, setSwingPower] = useState(4);
  const [score, setScore] = useState(0);
  const [pitcherStamina, setPitcherStamina] = useState(20);
  const [countBalls, setCountBalls] = useState(0);
  const [countStrikes, setCountStrikes] = useState(0);
  const [countOuts, setCountOuts] = useState(0);
  const [inning, setInning] = useState(1);
  const [bases, setBases] = useState([false,false,false]);

  //Card variables
  const [hand, setHand] = useState<string[]>([]);
  const [baseDeck, setBaseDeck] = useState([
    "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Hit by pitch", "Hit by pitch", "Wild pitch", "Wild pitch", "Home run", "Home run"
  ]);
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [discard, setDiscard] = useState<string[]>([]);

  //Stats variables
  const [h, setH] = useState(0);
  const [ab, setAB] = useState(0);
  const [bb, setBB] = useState(0);
  const [hbp, setHBP] = useState(0);
  const [hr, setHR] = useState(0);

  //Stats calculats
  const [avg, setAVG] = useState(0);
  const [obp, setOBP] = useState(0);
  const [slg, setSLG] = useState(0);
  const [ops, setOPS] = useState(0);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      resetState();
      shuffleDeck(baseDeck);
      return;
    }
  });

  useEffect(() => {
    processStats();
  }, [h, bb, hbp, hr, ab, obp, slg])

  useEffect(() => {
    if (pitcherStamina === 0) {
      newPitcher();
    }
  }, [pitcherStamina]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if(hand.length === 0) dealHand();
  };

  const shuffleDeck = (deck: string[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCurrentDeck([...deck]);
  }

  const dealHand = () => {
    setHand([...currentDeck.splice(0,6)]);
    if(currentDeck.length < 6){
      shuffleDeck(discard);
      setDiscard([]);
    }
  }

  const newPitcher = () => {
    setMaxPitcherStamina(15);
    setPitcherStamina(10);
    setModalTitle("New pitcher!");
    setModalText("")
    setModalMode("small");
    setModalVisible(true);
  }

  const modifyStamina = (ammount: number) => {
    if(ammount>0){
      pitcherStamina + ammount > maxPitcherStamina ? setPitcherStamina(maxPitcherStamina) : setPitcherStamina(pitcherStamina + ammount);
    }else{
      pitcherStamina + ammount < 0 ? setPitcherStamina(0) : setPitcherStamina(pitcherStamina + ammount);
    }
  };

  const clearBases = () => {
    setBases([false,false,false]);
  }

  const countRunners = (arr: boolean[]) => arr.reduce((a, v) => (v === true ? a + 1 : a), 0);

  const resetCount = () => {
    setCountBalls(0);
    setCountStrikes(0);
  }

  const resetStats = () => {
    setH(0);
    setAB(0);
    setBB(0);
    setHBP(0);
    setHR(0);
  }

  const processStats = () => {
    setAVG(ab !== 0 ? h/ab : 0);
    setOBP((ab + bb + hbp) !== 0 ? (h + bb + hbp)/(ab + bb + hbp) : 0);
    setSLG(ab !== 0 ? (h + hr * 3)/ab : 0);
    setOPS(obp + slg);
  }

  // Custom formatting function to remove leading zero
  const formatStat = (num: number): string => {
    const formatted = num.toFixed(3); // Set the desired decimal places (e.g., 3)
    return formatted.replace(/^0\./, '.'); // Remove leading zero if present
  };

  const resetState = () => {
    setScore(0);
    setInning(1);
    setPitcherStamina(20);
    setMaxPitcherStamina(25);
    resetCount();
    clearBases();
    setCountOuts(0);
    setHand([]);
    shuffleDeck(baseDeck)
    setDiscard([]);
    
    resetStats();
  }

  const advanceRunners = (newRunner: boolean) => {
    if(bases[0]){
      setScore(score+1);
    }
    let newBases = bases;
    newBases.shift();
    newBases.push(newRunner);
    setBases(newBases);
  }

  const ball = () => {
    if(countBalls < 3){
      setCountBalls(countBalls+1);
      modifyStamina(-1);
    }else{
      setModalTitle("Walk!");
      setModalText("")
      setModalMode("small");
      setModalVisible(true);
      setBB((prevBB) => prevBB + 1);
      endTurn();
      if(bases.includes(false)){
        if(bases[2]){
          if(bases[0]){
            let newBases = bases;
            newBases[1] = true;
            setBases(newBases);
          }else{
            advanceRunners(true);
          }
        }else{
          let newBases = bases;
          newBases[2] = true;
          setBases(newBases);
        }
      }else{
        advanceRunners(true);
      }
    }
  };

  const strike = () => {
    if(countStrikes < 2){
      setCountStrikes(countStrikes+1);
      modifyStamina(-1);
    }else{
      setModalTitle("Strikeout!");
      setModalText("")
      setModalMode("small");
      setModalVisible(true);
      setAB((prevAB) => prevAB + 1);
      endTurn();
      setCountOuts(countOuts+1);
      endInning();
      modifyStamina(10);
    }
  };

  const swing = () => {
    var odds = Math.max((pitcherStamina / maxPitcherStamina), 0.33);
    var random = Math.random();
    setModalText("")
    setModalMode("small");
    setAB((prevAB) => prevAB + 1);
    if(random > odds){
      setH((prevH) => prevH + 1);
      advanceRunners(true);
      setModalTitle("Base hit!");
      endTurn();
    }else{
      setModalTitle("Ground out!");
      endTurn();
      setCountOuts(countOuts+1)
      endInning();
    }
    setModalVisible(true);
  }

  const hitByPitch = () => {
    setModalTitle("Hit by pitch!");
    setModalText("")
    setModalMode("small");
    setModalVisible(true);
    setHBP((prevHBP) => prevHBP + 1);
    endTurn();
    if(bases.includes(false)){
      if(bases[2]){
        if(bases[0]){
          let newBases = bases;
          newBases[1] = true;
          setBases(newBases);
        }else{
          advanceRunners(true);
        }
      }else{
        let newBases = bases;
        newBases[2] = true;
        setBases(newBases);
      }
    }else{
      advanceRunners(true);
    }
  }

  const wildPitch = () => {
    modifyStamina(-1);
    if(countBalls < 3){
      ball();
      advanceRunners(false);
    }else{
      ball();
    }
  }

  const homeRun = () => {
    setModalTitle("HOME RUN!");
    setModalText("")
    setModalMode("small");
    setModalVisible(true);
    setH((prevH) => prevH + 1);
    setHR((prevHR) => prevHR + 1);
    setAB((prevAB) => prevAB + 1);
    setScore(score + countRunners(bases) + 1);
    clearBases();
    endTurn();
    modifyStamina(-4);
  }

  const endTurn = () => {
    let usableHand = hand.filter((item) => item.trim() !== "");
    discard.push.apply(discard, usableHand);
    modifyStamina(usableHand.length-1);
    resetCount();
    setHand([]);
    processStats();
  }

  const endInning = () => {
    if(countOuts !== 0 && (countOuts + 1) % 3 === 0){
      setCountOuts(0);
      if(inning === 3) {
        endGame();
        return;
      }
      setInning(inning+1);
      clearBases();
      modifyStamina(5);
    }
  }

  const endGame = () => {
    setModalTitle("Game over!");
    setModalText("You scored " + score + (score === 1 ? "run" : " runs."))
    setModalMode("small");
    setModalVisible(true);
    resetState();
  }

  const playCard = (card: string, index: number) => {
    let newHand = hand;
    let discardedCard = newHand.splice(index,1,"");
    discard.push(...discardedCard);
    setHand(newHand);
    switch (card){
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
  }

  return (
    <div className="App">
      <Modal title={modalTitle} content={modalText} mode={modalMode} isOpen={modalVisible} toggleModal={toggleModal}/>
      <div className="BbaC-body">
        <ScoreBoard score={score} pitcherStamina={pitcherStamina} maxPitcherStamina={maxPitcherStamina} balls={countBalls} strikes={countStrikes} outs={countOuts} inning={inning} bases={bases}></ScoreBoard>
        <DisplayHand playCard={playCard} hand={hand}></DisplayHand>
        <DeckInfo currentDeck={currentDeck.length} discard={discard.length} hand={hand.length}></DeckInfo>
      </div>
    </div>
  );
}

export default App;
