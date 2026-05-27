import { PlayerArchetype } from "../../types/playerArchetype";
import "./RunStartScreen.css";

interface Props {
  roster: PlayerArchetype[];
  onBeginRun: () => void;
}

const RunStartScreen = ({ roster, onBeginRun }: Props) => (
  <div className="run-start-screen">
    <h1 className="run-start-title">Baseball at Cards</h1>
    <p className="run-start-subtitle">Survive 4 bosses. Build your lineup.</p>
    <div className="run-start-roster">
      {roster.map((player, i) => (
        <div className="roster-player" key={i}>
          <div className="roster-player-name">{player.name}</div>
          <div className="roster-player-cards">
            {player.cards.map((card, j) => (
              <span key={j} className="roster-card-tag">{card}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <button className="run-start-btn" onClick={onBeginRun}>Begin Run</button>
  </div>
);

export default RunStartScreen;
