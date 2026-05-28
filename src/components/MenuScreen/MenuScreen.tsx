import "./MenuScreen.css";

interface Props {
  onStartRun: () => void;
  onSampleGame: () => void;
  onHelp: () => void;
}

const MenuScreen = ({ onStartRun, onSampleGame, onHelp }: Props) => (
  <div className="menu-screen">
    <h1 className="menu-title">Baseball at Cards</h1>
    <p className="menu-subtitle">Survive 4 bosses. Build your lineup.</p>
    <div className="menu-actions">
      <button className="menu-btn menu-btn--primary" onClick={onStartRun}>Start Survival Run</button>
      <button className="menu-btn menu-btn--secondary" onClick={onSampleGame}>Sample Game</button>
      <button className="menu-btn menu-btn--tertiary" onClick={onHelp}>Help</button>
    </div>
  </div>
);

export default MenuScreen;
