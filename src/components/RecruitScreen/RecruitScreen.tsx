import { useState } from "react";
import { PlayerArchetype } from "../../types/playerArchetype";
import { AVERAGE_JOE } from "../../data/playerArchetypes";
import "./RecruitScreen.css";

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  strongman: "High risk, high reward. Home runs or outs.",
  zen_master: "Patient. Draws walks, rarely swings.",
  jester: "Forces hit-by-pitches. Applies pressure.",
  rattler: "Wild pitches advance runners. Unsettles pitchers.",
  samurai: "Reliable singles. Gets on base consistently.",
  grinder: "Fouls extend at-bats. Wears down pitchers.",
};

interface Props {
  recruits: PlayerArchetype[];
  roster: PlayerArchetype[];
  onConfirm: (slot: number, recruit: PlayerArchetype) => void;
}

const RecruitScreen = ({ recruits, roster, onConfirm }: Props) => {
  const [selectedRecruit, setSelectedRecruit] = useState<PlayerArchetype | null>(null);

  if (!selectedRecruit) {
    return (
      <div className="recruit-screen">
        <h2 className="recruit-title">Recruit a Player</h2>
        <p className="recruit-subtitle">Choose one player to add to your lineup</p>
        <div className="recruit-options">
          {recruits.map((recruit, i) => (
            <button
              key={i}
              className="recruit-card"
              onClick={() => setSelectedRecruit(recruit)}
            >
              <div className="recruit-card-name">{recruit.name}</div>
              <div className="recruit-card-desc">
                {ARCHETYPE_DESCRIPTIONS[recruit.id] ?? ""}
              </div>
              <div className="recruit-card-tags">
                {recruit.cards.map((card, j) => (
                  <span key={j} className="recruit-card-tag">{card}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recruit-screen">
      <h2 className="recruit-title">Place {selectedRecruit.name}</h2>
      <p className="recruit-subtitle">Select an Average Joe slot to replace</p>
      <div className="recruit-roster">
        {roster.map((player, i) => {
          const isReplaceable = player.id === AVERAGE_JOE.id;
          return (
            <button
              key={i}
              className={`recruit-slot${isReplaceable ? " recruit-slot--replaceable" : " recruit-slot--locked"}`}
              onClick={() => { if (isReplaceable) onConfirm(i, selectedRecruit); }}
              disabled={!isReplaceable}
            >
              <div className="recruit-slot-name">{player.name}</div>
              <div className="recruit-slot-cards">
                {player.cards.map((card, j) => (
                  <span key={j} className="roster-card-tag">{card}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <button className="recruit-back-btn" onClick={() => setSelectedRecruit(null)}>
        ← Back
      </button>
    </div>
  );
};

export default RecruitScreen;
