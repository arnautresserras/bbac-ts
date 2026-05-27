import { IoMdArrowDropup } from "react-icons/io";
import BasesBug from "../BasesBug/BasesBug";
import StaminaBar from "./StaminaBar";

interface Props {
    balls: number;
    strikes: number;
    outs: number;
    inning: number;
    bases: boolean[];
    score: number;
    pitcherStamina: number;
    maxPitcherStamina: number;
    bossName: string;
    bossTier: 1 | 2 | 3;
    maxInnings: number;
    targetRuns: number;
}

const TIER_COLORS: Record<1 | 2 | 3, string> = {
    1: "#cd7f32",
    2: "#a0a0a0",
    3: "#ffd700",
};

const ScoreBoard = (props: Props) => {
    const runProgress = Math.min(props.score / props.targetRuns, 1);

    return (
        <div className="scoreBug">
            <div className="scoreBug-header">
                <span className="boss-name">{props.bossName}</span>
                <span className="boss-tier-badge" style={{ backgroundColor: TIER_COLORS[props.bossTier] }}>
                    Tier {props.bossTier}
                </span>
            </div>
            <div className="scoreBug-body">
                <div className="score">
                    <p className="score-runs">{props.score} / {props.targetRuns}</p>
                    <div className="run-progress-bar">
                        <div className="run-progress-fill" style={{ width: `${runProgress * 100}%` }} />
                    </div>
                    <StaminaBar stamina={props.pitcherStamina} maxStamina={props.maxPitcherStamina} />
                </div>
                <div className="countBug">
                    <div className="innings"><IoMdArrowDropup />{props.inning} / {props.maxInnings}</div>
                    <div className="innings">{props.balls} - {props.strikes}</div>
                </div>
                <div className="displayBug">
                    <BasesBug bases={props.bases} />
                    <div className="outsBug">
                        <div className={"out " + (props.outs > 0 ? "active" : "")} />
                        <div className={"out " + (props.outs > 1 ? "active" : "")} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard;