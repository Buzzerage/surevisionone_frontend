type BetInfoLabels = {
  stake: string;
  liability: string;
  back: string;
  lay: string;
};

type BetInfoProps = {
  type: "Back" | "Lay";
  player?: string | null;
  team?: string;
  bookmaker?: string | null;
  odds?: number | null;
  stake?: number | null;
  liability?: number | null;
  labels: BetInfoLabels;
  formatCurrency: (value?: number | null) => string;
};

const formatNumber = (value?: number | null, fallback: string = "--") => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return value.toFixed(2);
};

const BetInfo = ({
  type,
  player,
  team,
  bookmaker,
  odds,
  stake,
  liability,
  labels,
  formatCurrency,
}: BetInfoProps) => {
  const isBack = type === "Back";
  const label = player || team || "";
  const typeLabel = isBack ? labels.back : labels.lay;

  return (
    <div className={`bet-card ${isBack ? "bet-back" : "bet-lay"} fade-in`}>
      <div className="bet-header">
        <div className="bet-title-row">
          <span className={`bet-icon ${isBack ? "bet-icon-back" : "bet-icon-lay"}`}>{isBack ? "↑" : "↓"}</span>
          <h4 className="bet-title">{label}</h4>
        </div>
        <div className="bet-meta">
          <span className="bet-odds">{formatNumber(odds)}</span>
          <span className={`type-tag ${isBack ? "type-back" : "type-lay"}`}>{typeLabel}</span>
        </div>
      </div>
      <div className="bet-footer">
        <span className="bookmaker-pill">{bookmaker ?? "-"}</span>
        <span className="muted">
          <span className="stake-value">{labels.stake}: </span>
          <span className="stake-value">{formatCurrency(stake)}</span>
        </span>
        {typeof liability === "number" && !Number.isNaN(liability) && (
          <span className="muted">
            <span className="liability-value">⚠</span> {labels.liability}:{" "}
            <span className="liability-value">{formatCurrency(liability)}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export type { BetInfoLabels };
export default BetInfo;