import { Boss } from "../../types/boss";
import "./BossIntroScreen.css";

interface Props {
  boss: Boss;
  onPlayBall: () => void;
}

const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: "#cd7f32",
  2: "#a0a0a0",
  3: "#ffd700",
};

const BossIntroScreen = ({ boss, onPlayBall }: Props) => (
  <div className="boss-intro-screen">
    <div className="boss-intro-card">
      <span className="boss-intro-tier-badge" style={{ backgroundColor: TIER_COLORS[boss.tier] }}>
        Tier {boss.tier}
      </span>
      <h2 className="boss-intro-name">{boss.name}</h2>
      <div className="boss-intro-details">
        <p>
          Score <strong>{boss.targetRuns}</strong>{" "}
          {boss.targetRuns === 1 ? "run" : "runs"} in{" "}
          <strong>{boss.maxInnings}</strong> innings
        </p>
        <p>Pitcher stamina: <strong>{boss.initialStamina}</strong></p>
      </div>
      <button onClick={onPlayBall}>Play Ball!</button>
    </div>
  </div>
);

export default BossIntroScreen;
