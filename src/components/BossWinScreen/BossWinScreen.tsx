import { Boss } from "../../types/boss";
import "./BossWinScreen.css";

interface Props {
  boss: Boss;
  onContinue: () => void;
}

const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: "#cd7f32",
  2: "#a0a0a0",
  3: "#ffd700",
};

const BossWinScreen = ({ boss, onContinue }: Props) => (
  <div className="boss-win-screen">
    <div className="boss-win-card">
      <span className="boss-tier-badge" style={{ backgroundColor: TIER_COLORS[boss.tier] }}>
        Tier {boss.tier}
      </span>
      <h2>{boss.name} defeated!</h2>
      <p>Well done. The next challenge awaits.</p>
      <button onClick={onContinue}>Continue</button>
    </div>
  </div>
);

export default BossWinScreen;
