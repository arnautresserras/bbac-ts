import { BallIcon } from "./icons/BallIcon";
import { HitByPitchIcon } from "./icons/HitByPitchIcon";
import { HomeRunIcon } from "./icons/HomeRunIcon";
import { StrikeIcon } from "./icons/StrikeIcon";
import { SwingIcon } from "./icons/SwingIcon";
import { WildPitchIcon } from "./icons/WildPitchIcon";

// Mapping card names to components
const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
    "Ball": BallIcon,
    "Strike": StrikeIcon,
    "Swing": SwingIcon,
    "Hit by pitch": HitByPitchIcon,
    "Wild pitch": WildPitchIcon,
    "Home run": HomeRunIcon,
  };

interface Props{
    hand: string[];
    playCard: (card: string, index: number) => void;
}

const DisplayHand = (props:Props) => {
    return (
        <div className="hand">
            {props.hand.map((card, index) => {
                const IconComponent = iconMap[card]; // Get component dynamically
                return card.trim() !== "" ? (
                <button className="hand-card" key={index} onClick={() => props.playCard(card, index)}>
                    {IconComponent && (
                    <div className="hand-card-icon">
                        <IconComponent size={48} color="black" />
                    </div>
                    )}
                    <div className="hand-card-title">{card}</div>
                </button>
                ) : (
                <div className="empty-card" key={index}></div>
                );
            })}
        </div>
    )
}

export default DisplayHand;