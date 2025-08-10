import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CircleAlert, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState, type FC } from "react";
import { cn } from "@/lib/utils";
import { TickerChart } from "./TickerChart";
import { toast } from "sonner";

interface SymbolInfo {
  symbol: string;
  name: string;
  website: string;
}

interface TickerCardProps {
  ticker: any;
}

export const TickerCard: FC<TickerCardProps> = ({ ticker }) => {
  const validData = ticker.data.length > 0;
  const currentData = ticker.data.at(-1);
  const delta = ticker.change.delta ? ticker.change.delta.toFixed(2) : "";
  const percentage = ticker.change.percent
    ? ticker.change.percent.toFixed(2)
    : "";
  const [info, setInfo] = useState<SymbolInfo | null>(null);

  useEffect(() => {
    if (!ticker.symbol) return;

    async function fetchSymbolInfo() {
      try {
        const res = await fetch(`/api/info?symbol=${ticker.symbol}`);
        const data = await res.json();
        if (!data.symbol && !data.name && !data.symbol) {
          toast(
            () => (
              <div className="flex w-full flex-row items-center gap-2">
                <CircleAlert className="size-4 text-red-500" />
                <p className="text-md">Error</p>
              </div>
            ),
            {
              description: `Failed to fetch ${ticker.symbol} info.`,
              duration: 6000,
            }
          );
          setInfo(null);
        } else {
          setInfo(data);
        }
      } catch (err) {
        console.error(err);
        toast(
          () => (
            <div className="flex w-full flex-row items-center gap-2">
              <CircleAlert className="size-4 text-red-500" />
              <p className="text-md">Failed to fetch {ticker.symbol} info</p>
            </div>
          ),
          {
            description: JSON.stringify(err),
            duration: 6000,
          }
        );
        setInfo(null);
      }
    }

    fetchSymbolInfo();
  }, [ticker.symbol]);

  return (
    <div className="box-border relative">
      <Card className="group @container/card hover:shadow-2xl hover:shadow-muted-foreground/10 cursor-pointer from-card to-card bg-gradient-to-t relative border border-muted-foreground/30">
        <img
          src={`/static/${ticker.symbol}.png`}
          alt="Hero"
          className="size-20 pt-2 pr-2 absolute right-0 drop-shadow-xs drop-shadow-foreground opacity-50 group-hover:opacity-100"
        />
        <CardHeader>
          <CardDescription className="flex flex-col">
            <p className="font-bold"> {ticker.symbol}</p>
            <p>{info ? info.name : null}</p>
          </CardDescription>
          {validData ? (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex flex-col gap-1">
              ${currentData.Close.toFixed(2)}
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 w-fit",
                  percentage > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {percentage > 0 ? <TrendingUp /> : <TrendingDown />}
                {percentage > 0 && "+"}
                {`${delta} (${percentage}%)`}
              </Badge>
            </CardTitle>
          ) : (
            <div className="pt-2">
              <p className="text-destructive/50 italic">
                No data found in time range
              </p>
            </div>
          )}
        </CardHeader>
        {validData && <TickerChart ticker={ticker} />}
      </Card>
    </div>
  );
};
