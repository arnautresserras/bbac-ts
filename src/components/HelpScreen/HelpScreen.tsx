import { useState } from "react";
import { CardName } from "../../types/cardName";
import { CARD_DESCRIPTIONS } from "../../data/cardDescriptions";
import { BallIcon } from "../DisplayHand/icons/BallIcon";
import { StrikeIcon } from "../DisplayHand/icons/StrikeIcon";
import { SwingIcon } from "../DisplayHand/icons/SwingIcon";
import { FoulIcon } from "../DisplayHand/icons/FoulIcon";
import { SingleIcon } from "../DisplayHand/icons/SingleIcon";
import { HomeRunIcon } from "../DisplayHand/icons/HomeRunIcon";
import { OutIcon } from "../DisplayHand/icons/OutIcon";
import { HitByPitchIcon } from "../DisplayHand/icons/HitByPitchIcon";
import { WildPitchIcon } from "../DisplayHand/icons/WildPitchIcon";
import "./HelpScreen.css";

const CARD_ICONS: Record<CardName, React.FC<{ size?: number; color?: string }>> = {
  "Ball": BallIcon,
  "Strike": StrikeIcon,
  "Swing": SwingIcon,
  "Foul": FoulIcon,
  "Single": SingleIcon,
  "Home run": HomeRunIcon,
  "Out": OutIcon,
  "Hit by pitch": HitByPitchIcon,
  "Wild pitch": WildPitchIcon,
};

const CARD_ORDER: CardName[] = [
  "Ball", "Strike", "Swing",
  "Single", "Home run", "Out",
  "Foul", "Hit by pitch", "Wild pitch",
];

interface Props {
  onBack: () => void;
}

const HelpScreen = ({ onBack }: Props) => {
  const [expandedCard, setExpandedCard] = useState<CardName | null>(null);

  const handleTileClick = (card: CardName) => {
    setExpandedCard(prev => (prev === card ? null : card));
  };

  return (
    <div className="help-screen">
      <h2 className="help-title">How to Play</h2>
      <p className="help-subtitle">Tap a card to learn more</p>
      <div className="help-grid">
        {CARD_ORDER.map((card) => {
          const Icon = CARD_ICONS[card];
          const desc = CARD_DESCRIPTIONS[card];
          const isExpanded = expandedCard === card;
          return (
            <button
              key={card}
              className={`help-tile${isExpanded ? " help-tile--expanded" : ""}`}
              onClick={() => handleTileClick(card)}
            >
              <div className="help-tile-icon">
                <Icon size={36} />
              </div>
              <div className="help-tile__text">
                <div className="help-tile-name">{card}</div>
                <div className="help-tile-short">{desc.short}</div>
                {isExpanded && (
                  <div className="help-tile-detail">{desc.detail}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <button className="help-back-btn" onClick={onBack}>
        ← Back to Menu
      </button>
    </div>
  );
};

export default HelpScreen;
