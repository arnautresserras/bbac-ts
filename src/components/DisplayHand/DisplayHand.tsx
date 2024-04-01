interface Props{
    hand: string[];
    playCard: (card: string, index: number) => void;
}

const DisplayHand = (props:Props) => {
    return (
        <div className="hand">
            {props.hand.map((card, index) => (
                card.trim() !== "" ? (
                    <button className="hand-card" key={index} onClick={() => props.playCard(card, index)}>
                    {card}
                    </button>
                ) : (
                    <div className="empty-card" key={index}>
                    </div>
                )
            ))}
        </div>
    )
}

export default DisplayHand;