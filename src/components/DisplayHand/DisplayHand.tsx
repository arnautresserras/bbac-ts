interface Props{
    hand: string[];
    playCard: (card: string, index: number) => void;
}

const DisplayHand = (props:Props) => {
    return (
        <div className="hand">
            {props.hand.map((card, index) => (
                <button className="hand-card" key={index} onClick={() => props.playCard(card, index)}>
                    {card}
                </button>
                ))}
        </div>
    )
}

export default DisplayHand;