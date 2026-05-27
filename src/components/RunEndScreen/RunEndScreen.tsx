import "./RunEndScreen.css";

interface Props {
  won: boolean;
  bossName?: string;
  bossTier?: 1 | 2 | 3;
  onPlayAgain: () => void;
}

const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: "#cd7f32",
  2: "#a0a0a0",
  3: "#ffd700",
};

const RunEndScreen = ({ won, bossName, bossTier, onPlayAgain }: Props) => (
  <div className="run-end-screen">
    <div className="run-end-card">
      {won ? (
        <>
          <h1>You did it!</h1>
          <p>You defeated all 4 bosses!</p>
        </>
      ) : (
        <>
          <h1>Run over</h1>
          {bossName && bossTier && (
            <p>
              Defeated by{" "}
              <strong style={{ color: TIER_COLORS[bossTier] }}>{bossName}</strong>
              {" "}(Tier {bossTier})
            </p>
          )}
        </>
      )}
      <button onClick={onPlayAgain}>{won ? "Play Again" : "Try Again"}</button>
    </div>
  </div>
);

export default RunEndScreen;
