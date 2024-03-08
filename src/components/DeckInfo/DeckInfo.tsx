import { GiCardDiscard, GiCardDraw, GiCardPick } from "react-icons/gi";

interface Props{
    currentDeck: number;
    discard: number;
    hand: number;
}

const BasesBug = (props:Props) => {
    return (
        <div className="deckInfo">
            <div className="deckInfo-detail">
                <GiCardDraw /> {props.currentDeck}
            </div>
            <div className="deckInfo-detail">
                <GiCardPick /> {props.hand}
            </div>
            <div className="deckInfo-detail">
                <GiCardDiscard /> {props.discard}
            </div>
        </div>
    )
}

export default BasesBug;

