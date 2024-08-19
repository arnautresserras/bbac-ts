import { BatterStats } from "../../interfaces/BatterStats";
import './DisplayLineupStats.css';

interface Props{
    lineupStats: BatterStats[];
    currentBatter: number;
}

// Custom formatting function to remove leading zero
const formatStat = (num: number): string => {
    const formatted = num.toFixed(3); // Set the desired decimal places (e.g., 3)
    return formatted.replace(/^0\./, '.'); // Remove leading zero if present
};

const DisplayLineupStats = (props:Props) => {

    const totalStats = props.lineupStats.reduce((totals, batter) => {
        totals.plateAppearance += batter.plateAppearance;
        totals.atBats += batter.atBats;
        totals.hits += batter.hits;
        totals.walks += batter.walks;
        totals.hitByPitch += batter.hitByPitch;
        totals.homeRuns += batter.homeRuns;
        return totals;
    }, {
        plateAppearance: 0,
        atBats: 0,
        hits: 0,
        walks: 0,
        hitByPitch: 0,
        homeRuns: 0
    });

    const maxStats = {
        plateAppearance: Math.max(...props.lineupStats.map(batter => batter.plateAppearance)),
        atBats: Math.max(...props.lineupStats.map(batter => batter.atBats)),
        hits: Math.max(...props.lineupStats.map(batter => batter.hits)),
        walks: Math.max(...props.lineupStats.map(batter => batter.walks)),
        hitByPitch: Math.max(...props.lineupStats.map(batter => batter.hitByPitch)),
        homeRuns: Math.max(...props.lineupStats.map(batter => batter.homeRuns)),
        battingAverage: Math.max(...props.lineupStats.map(batter => batter.atBats !== 0 ? batter.hits / batter.atBats : 0)),
        onBasePercentage: Math.max(...props.lineupStats.map(batter => (batter.atBats + batter.walks + batter.hitByPitch) !== 0 ? (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch) : 0)),
        sluggingPercentage: Math.max(...props.lineupStats.map(batter => batter.atBats !== 0 ? (batter.hits + batter.homeRuns * 3) / batter.atBats : 0)),
        ops: Math.max(...props.lineupStats.map(batter => batter.atBats !== 0 ? (batter.hits + batter.homeRuns * 3) / batter.atBats + (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch) : 0))
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <div>#</div>
                <div>PA</div>
                <div>AB</div>
                <div>H</div>
                <div>BB</div>
                <div>HBP</div>
                <div>HR</div>
                <div>AVG</div>
                <div>OBP</div>
                <div>SLG</div>
                <div>OPS</div>
            </div>
            {props.lineupStats.map((batter, index) => (
                <div className="table-row" key={batter.id}>
                    <div className={props.currentBatter === index ? 'leading-stat' : ''}>
                        {props.currentBatter === index ? '>' : ''}
                        {batter.id}
                        {props.currentBatter === index ? '<' : ''}
                    </div>
                    <div className={batter.plateAppearance === maxStats.plateAppearance ? 'leading-stat' : ''}>{batter.plateAppearance}</div>
                    <div className={batter.atBats === maxStats.atBats ? 'leading-stat' : ''}>{batter.atBats}</div>
                    <div className={batter.hits === maxStats.hits ? 'leading-stat' : ''}>{batter.hits}</div>
                    <div className={batter.walks === maxStats.walks ? 'leading-stat' : ''}>{batter.walks}</div>
                    <div className={batter.hitByPitch === maxStats.hitByPitch ? 'leading-stat' : ''}>{batter.hitByPitch}</div>
                    <div className={batter.homeRuns === maxStats.homeRuns ? 'leading-stat' : ''}>{batter.homeRuns}</div>
                    <div className={batter.atBats !== 0 && batter.hits / batter.atBats === maxStats.battingAverage ? 'leading-stat' : ''}>
                        {formatStat(batter.atBats !== 0 ? batter.hits / batter.atBats : 0)}
                    </div>
                    <div className={(batter.atBats + batter.walks + batter.hitByPitch) !== 0 && (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch) === maxStats.onBasePercentage ? 'leading-stat' : ''}>
                        {formatStat((batter.atBats + batter.walks + batter.hitByPitch) !== 0 ?
                            (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch) : 0)
                        }
                    </div>
                    <div className={batter.atBats !== 0 && (batter.hits + batter.homeRuns * 3) / batter.atBats === maxStats.sluggingPercentage ? 'leading-stat' : ''}>
                        {formatStat(batter.atBats !== 0 ? (batter.hits + batter.homeRuns * 3) / batter.atBats : 0)}
                    </div>
                    <div className={batter.atBats !== 0 && (batter.hits + batter.homeRuns * 3) / batter.atBats + (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch) === maxStats.ops ? 'leading-stat' : ''}>
                        {formatStat(batter.atBats !== 0 ? 
                            (batter.hits + batter.homeRuns * 3) / batter.atBats + (batter.hits + batter.walks + batter.hitByPitch) / (batter.atBats + batter.walks + batter.hitByPitch)
                            : 0)
                        }
                    </div>
                </div>
            ))}
            <div className="table-row">
                <div>Total</div>
                <div>{totalStats.plateAppearance}</div>
                <div>{totalStats.atBats}</div>
                <div>{totalStats.hits}</div>
                <div>{totalStats.walks}</div>
                <div>{totalStats.hitByPitch}</div>
                <div>{totalStats.homeRuns}</div>
                <div>{formatStat(totalStats.atBats !== 0 ? totalStats.hits / totalStats.atBats : 0)}</div>
                <div>
                    {formatStat((totalStats.atBats + totalStats.walks + totalStats.hitByPitch) !== 0 ?
                        (totalStats.hits + totalStats.walks + totalStats.hitByPitch) / (totalStats.atBats + totalStats.walks + totalStats.hitByPitch) : 0)
                    }
                </div>
                <div>{formatStat(totalStats.atBats !== 0 ? (totalStats.hits + totalStats.homeRuns * 3) / totalStats.atBats : 0)}</div>
                <div>
                    {formatStat(totalStats.atBats !== 0 ? 
                        (totalStats.hits + totalStats.homeRuns * 3) / totalStats.atBats + (totalStats.hits + totalStats.walks + totalStats.hitByPitch) / (totalStats.atBats + totalStats.walks + totalStats.hitByPitch)
                        : 0)
                    }
                </div>
            </div>
        </div>
    )
}

export default DisplayLineupStats;