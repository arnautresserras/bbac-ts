import { useMemo } from "react";
import { BatterStats } from "../../interfaces/BatterStats";
import './DisplayLineupStats.css';

interface Props {
    lineupStats: BatterStats[];
    currentBatter: number;
}

const formatStat = (num: number): string => {
    const formatted = num.toFixed(3);
    return formatted.replace(/^0\./, '.');
};

const battingAvg = (b: BatterStats): number =>
    b.atBats !== 0 ? b.hits / b.atBats : 0;

const obp = (b: BatterStats): number => {
    const pa = b.atBats + b.walks + b.hitByPitch;
    return pa !== 0 ? (b.hits + b.walks + b.hitByPitch) / pa : 0;
};

const slg = (b: BatterStats): number =>
    b.atBats !== 0 ? (b.hits + b.homeRuns * 3) / b.atBats : 0;

const ops = (b: BatterStats): number =>
    b.atBats !== 0 ? slg(b) + obp(b) : 0;

const DisplayLineupStats = ({ lineupStats, currentBatter }: Props) => {

    const totalStats = lineupStats.reduce((totals, batter) => {
        totals.plateAppearance += batter.plateAppearance;
        totals.atBats += batter.atBats;
        totals.hits += batter.hits;
        totals.walks += batter.walks;
        totals.hitByPitch += batter.hitByPitch;
        totals.homeRuns += batter.homeRuns;
        return totals;
    }, { plateAppearance: 0, atBats: 0, hits: 0, walks: 0, hitByPitch: 0, homeRuns: 0 });

    const maxStats = useMemo(() => ({
        plateAppearance: Math.max(...lineupStats.map(b => b.plateAppearance)),
        atBats: Math.max(...lineupStats.map(b => b.atBats)),
        hits: Math.max(...lineupStats.map(b => b.hits)),
        walks: Math.max(...lineupStats.map(b => b.walks)),
        hitByPitch: Math.max(...lineupStats.map(b => b.hitByPitch)),
        homeRuns: Math.max(...lineupStats.map(b => b.homeRuns)),
        battingAverage: Math.max(...lineupStats.map(battingAvg)),
        onBasePercentage: Math.max(...lineupStats.map(obp)),
        sluggingPercentage: Math.max(...lineupStats.map(slg)),
        ops: Math.max(...lineupStats.map(ops)),
    }), [lineupStats]);

    const battersDerived = useMemo(() =>
        lineupStats.map(b => ({ avg: battingAvg(b), obp: obp(b), slg: slg(b), ops: ops(b) })),
    [lineupStats]);

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
            {lineupStats.map((batter, index) => {
                const derived = battersDerived[index];
                return (
                    <div className="table-row" key={batter.id}>
                        <div className={currentBatter === index ? 'leading-stat' : ''}>
                            {currentBatter === index ? '>' : ''}
                            {batter.id}
                            {currentBatter === index ? '<' : ''}
                        </div>
                        <div className={batter.plateAppearance === maxStats.plateAppearance ? 'leading-stat' : ''}>{batter.plateAppearance}</div>
                        <div className={batter.atBats === maxStats.atBats ? 'leading-stat' : ''}>{batter.atBats}</div>
                        <div className={batter.hits === maxStats.hits ? 'leading-stat' : ''}>{batter.hits}</div>
                        <div className={batter.walks === maxStats.walks ? 'leading-stat' : ''}>{batter.walks}</div>
                        <div className={batter.hitByPitch === maxStats.hitByPitch ? 'leading-stat' : ''}>{batter.hitByPitch}</div>
                        <div className={batter.homeRuns === maxStats.homeRuns ? 'leading-stat' : ''}>{batter.homeRuns}</div>
                        <div className={derived.avg > 0 && derived.avg === maxStats.battingAverage ? 'leading-stat' : ''}>
                            {formatStat(derived.avg)}
                        </div>
                        <div className={derived.obp > 0 && derived.obp === maxStats.onBasePercentage ? 'leading-stat' : ''}>
                            {formatStat(derived.obp)}
                        </div>
                        <div className={derived.slg > 0 && derived.slg === maxStats.sluggingPercentage ? 'leading-stat' : ''}>
                            {formatStat(derived.slg)}
                        </div>
                        <div className={derived.ops > 0 && derived.ops === maxStats.ops ? 'leading-stat' : ''}>
                            {formatStat(derived.ops)}
                        </div>
                    </div>
                );
            })}
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
    );
};

export default DisplayLineupStats;
