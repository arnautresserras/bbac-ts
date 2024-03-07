import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import DisplayHand from './components/DisplayHand/DisplayHand';
import CountBug from './components/CountBug/CountBug';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';

function App() {

  const [modalText, setModalText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [maxPitcherStamina, setMaxPitcherStamina] = useState(25);
  const [swingPower, setSwingPower] = useState(4);
  const [score, setScore] = useState(0);
  const [pitcherStamina, setPitcherStamina] = useState(20);
  const [countBalls, setCountBalls] = useState(0);
  const [countStrikes, setCountStrikes] = useState(0);
  const [countOuts, setCountOuts] = useState(0);
  const [inning, setInning] = useState(1);
  const [bases, setBases] = useState([false,false,false]);
  const [hand, setHand] = useState<string[]>([]);
  const [baseDeck, setBaseDeck] = useState([
    "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Ball", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Strike", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Swing", "Hit by pitch", "Hit by pitch", "Wild pitch", "Wild pitch", "Home run", "Home run"
  ]);
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [discard, setDiscard] = useState<string[]>([]);

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
  }

  const dealHand = () => {
    console.log("Dealing hand");
    setHand([...currentDeck.splice(0,6)]);
    if(currentDeck.length < 6){
      shuffleDeck(discard);
      setDiscard([]);
    }
  }

  const newPitcher = () => {
    setMaxPitcherStamina(15);
    setPitcherStamina(10);
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
      setModalText("Walk!");
      setModalVisible(true);
      endTurn();
      if(bases[2]){
        advanceRunners(true);
      }else{
        let newBases = bases;
        newBases[2] = true;
        setBases(newBases);
      }
    }
  };

  const strike = () => {
    if(countStrikes < 2){
      setCountStrikes(countStrikes+1);
      modifyStamina(-1);
    }else{
      setModalText("Strikeout!");
      setModalVisible(true);
      endTurn();
      setCountOuts(countOuts+1);
      endInning();
      modifyStamina(10);
    }
  };

  const swing = () => {
    var odds = Math.max((pitcherStamina / maxPitcherStamina), 0.33);
    var random = Math.random();
    if(random > odds){
      advanceRunners(true);
      setModalText("Base hit!");
      setModalVisible(true);
      endTurn();
    }else{
      setModalText("Groundout!");
      setModalVisible(true);
      endTurn();
      setCountOuts(countOuts+1)
      endInning();
    }
  }

  const hitByPitch = () => {
    setModalText("Hit by pitch!");
    setModalVisible(true);
    endTurn();
    if(bases[2]){
      advanceRunners(true);
    }else{
      let newBases = bases;
      newBases[2] = true;
      setBases(newBases);
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
    setModalText("HOME RUN!");
    setModalVisible(true);
    setScore(score + countRunners(bases) + 1);
    clearBases();
    endTurn();
    modifyStamina(-4);
  }

  const endTurn = () => {
    discard.push.apply(discard, hand);
    modifyStamina(hand.length-1);
    resetCount();
    setHand([]);
  }

  const endInning = () => {
    if(countOuts !== 0 && (countOuts + 1) % 3 === 0){
      setCountOuts(0);
      setInning(inning+1);
      clearBases();
      modifyStamina(5);
    }
  }

  const playCard = (card: string, index: number) => {
    let newHand = hand;
    let discardedCard = newHand.splice(index,1);
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
      <header className="App-header">
        <button onClick={()=> dealHand()}>Deal hand</button>
        <div>
          {/*<AdminControls modalVisible={modalVisible} setModalVisible={setModalVisible} ></AdminControls>*/}
          <div >
            <ScoreBoard score={score} pitcherStamina={pitcherStamina}></ScoreBoard>
            <CountBug balls={countBalls} strikes={countStrikes} outs={countOuts} inning={inning} bases={bases}></CountBug>
          </div>
          <div>
            <p>Cards in deck: {currentDeck.length}</p>
            <p>Cards in discard: {discard.length}</p>
            <p>Cards in hand: {hand.length}</p>
            <p>Total cards: {currentDeck.length + discard.length + hand.length}</p>
          </div>
          <DisplayHand playCard={playCard} hand={hand}></DisplayHand>
        </div>
      </header>
    </div>
  );
}

export default App;
