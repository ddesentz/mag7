import { useState, type FC } from "react";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { Line, LineChart, ReferenceLine, YAxis } from "recharts";
import { TickerToolTip } from "../tickerGrid/TickerToolTip";
import { NEG, POS } from "@/lib/utils";

interface TrendSparkLineProps {
  symbol: string;
  trendUp: boolean;
  history: any[];
  average: number;
}

export const TrendSparkLine: FC<TrendSparkLineProps> = ({
  symbol,
  trendUp,
  history,
  average,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: any) => {
    if (e.chartX && e.chartY) {
      setTooltipPosition({ x: e.chartX, y: e.chartY });
    }
  };

  return (
    <ChartContainer
      config={{}}
      className="max-h-8 w-full rounded-md overflow-hidden min-w-40"
    >
      <LineChart
        id={`spark-${symbol}`}
        accessibilityLayer
        data={history}
        margin={{
          left: 0,
          right: 0,
        }}
        onMouseMove={handleMouse}
        className="rounded-md"
      >
        <YAxis type="number" domain={["auto", "auto"]} hide={true} />
        <ChartTooltip
          content={
            <TickerToolTip
              id={symbol}
              type="spark"
              position={{ x: tooltipPosition.x, y: tooltipPosition.y }}
            />
          }
        />
        <defs>
          <linearGradient id="POS" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={POS} stopOpacity={0.8} />
            <stop offset="95%" stopColor={POS + "AA"} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="NEG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={NEG} stopOpacity={0.8} />
            <stop offset="95%" stopColor={NEG + "AA"} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <ReferenceLine
          y={average}
          strokeDasharray="2 10"
          stroke="#ffffffaa"
        ></ReferenceLine>
        <Line
          dataKey="Close"
          type="linear"
          fill={`url(#${trendUp ? "POS" : "NEG"})`}
          stroke={`${trendUp ? POS : NEG}`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};
