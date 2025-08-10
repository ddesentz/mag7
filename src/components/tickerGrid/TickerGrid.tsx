import type { FC } from "react";
import { TickerCard } from "./TickerCard";

interface TickerGridProps {
  tickers: any[];
}

export const TickerGrid: FC<TickerGridProps> = ({ tickers }) => {
  return (
    <div className="grid grid-cols-1 gap-8 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @6xl/main:grid-cols-4">
      {tickers.map((ticker) => (
        <TickerCard key={ticker.symbol} ticker={ticker} />
      ))}
    </div>
  );
};
