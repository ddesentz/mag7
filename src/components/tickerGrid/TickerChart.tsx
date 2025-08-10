import { type FC } from "react";
import { CardContent } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { Area, AreaChart, YAxis } from "recharts";
import { TickerToolTip } from "./TickerToolTip";
import { NEG, POS } from "@/lib/utils";

interface TickerGridProps {
  ticker: any;
}

export const TickerChart: FC<TickerGridProps> = ({ ticker }) => {
  const trendUp = ticker.change.percent.toFixed(2) > 0;
  return (
    <CardContent>
      <ChartContainer
        config={{}}
        className="max-h-20 w-full rounded-md overflow-hidden"
      >
        <AreaChart
          id={`chart-${ticker.symbol}`}
          accessibilityLayer
          data={ticker.data}
          margin={{
            left: 0,
            right: 0,
          }}
          className="rounded-md"
        >
          <YAxis type="number" domain={["auto", "auto"]} hide={true} />
          <ChartTooltip
            content={<TickerToolTip id={ticker.symbol} type="chart" />}
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
          <Area
            dataKey="Close"
            type="linear"
            fill={`url(#${trendUp ? "POS" : "NEG"})`}
            stroke={`${trendUp ? POS : NEG}`}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  );
};
