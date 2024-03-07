import BasesBug from "../BasesBug/BasesBug";

interface Props{
    score: number;
    pitcherStamina: number;
}

const ScoreBoard = (props:Props) => {
    return (
        <div>
            <p>score: {props.score}</p>
            <p>pitcherStamina: {props.pitcherStamina}</p>
        </div>
    )
}

export default ScoreBoard;