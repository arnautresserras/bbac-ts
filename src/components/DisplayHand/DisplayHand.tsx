import { BallIcon } from "./icons/BallIcon";
import { FoulIcon } from "./icons/FoulIcon";
import { HitByPitchIcon } from "./icons/HitByPitchIcon";
import { HomeRunIcon } from "./icons/HomeRunIcon";
import { OutIcon } from "./icons/OutIcon";
import { SingleIcon } from "./icons/SingleIcon";
import { StrikeIcon } from "./icons/StrikeIcon";
import { SwingIcon } from "./icons/SwingIcon";
import { WildPitchIcon } from "./icons/WildPitchIcon";
import { CardName } from "../../types/cardName";

const iconMap: Record<CardName, React.FC<{ size?: number; color?: string }>> = {
    "Ball": BallIcon,
    "Strike": StrikeIcon,
    "Swing": SwingIcon,
    "Hit by pitch": HitByPitchIcon,
    "Wild pitch": WildPitchIcon,
    "Home run": HomeRunIcon,
    "Single": SingleIcon,
    "Out": OutIcon,
    "Foul": FoulIcon,
  };

interface Props{
    hand: (CardName | "")[];
    playCard: (card: CardName, index: number) => void;
}

const DisplayHand = (props:Props) => {
    return (
        <div className="hand">
            {props.hand.map((card, index) => {
                if (card === "") {
                    return <div className="empty-card" key={index}></div>;
                }
                const IconComponent = iconMap[card];
                return (
                <button className="hand-card" key={index} onClick={() => props.playCard(card, index)}>
                    {IconComponent && (
                    <div className="hand-card-icon">
                        <IconComponent size={48} color="black" />
                    </div>
                    )}
                    <div className="hand-card-title">{card}</div>
                </button>
                );
            })}
        </div>
    )
}

export default DisplayHand;
