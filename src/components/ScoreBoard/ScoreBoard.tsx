import { IoMdArrowDropup } from "react-icons/io";
import BasesBug from "../BasesBug/BasesBug";

interface Props{
    balls: number;
    strikes: number;
    outs: number;
    inning: number;
    bases: boolean[];
    score: number;
    pitcherStamina: number;
}

const ScoreBoard = (props:Props) => {
    return (
        <div className="scoreBug">
            <div className="">
                <p>Score {props.score}</p>
                <p>Stamina: {props.pitcherStamina}</p>
            </div>
            <div className="countBug">
                <div className="innings"><IoMdArrowDropup />{props.inning}</div>
                <div className="innings">{props.balls} - {props.strikes}</div>
            </div>
            <div className="displayBug">
                <BasesBug bases={props.bases}></BasesBug>
                <div className="outsBug">
                    <div className={"out " + (props.outs > 0 ? "active" : "")}></div>
                    <div className={"out " + (props.outs > 1 ? "active" : "")}></div>
                </div>
            </div>
        </div>
        
    )
}

export default ScoreBoard;