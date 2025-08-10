import { compactNumber, formatDateString, formatTimeString } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const TOOLTIP_HEIGHT = 250;
const TOOLTIP_WIDTH = 400;
const TOOLTIP_OFFSET_Y = 10;
const TOOLTIP_OFFSET_X = 40;
const SPARK_HEIGHT = 50;

interface TickerTooltipProps extends TooltipProps<ValueType, NameType> {
  id: string;
  type: string;
}

export const TickerToolTip: FC<TickerTooltipProps> = ({
  active,
  payload,
  position,
  id,
  type,
}) => {
  const [chartBounds, setChartBounds] = useState<DOMRect | null>(null);

  const setBounds = () => {
    const chartEl = document.getElementById(`${type}-${id}`);
    if (chartEl) {
      setChartBounds(chartEl.getBoundingClientRect());
    }
  };

  useEffect(() => {
    setBounds();
    window.addEventListener("resize", setBounds);
    return () => {
      window.removeEventListener("resize", setBounds);
    };
  }, []);

  if (active && payload && payload.length && chartBounds) {
    const data = payload[0].payload;
    const top =
      position &&
      window.innerHeight - TOOLTIP_HEIGHT <
        chartBounds.bottom + TOOLTIP_OFFSET_Y
        ? chartBounds.bottom - (TOOLTIP_HEIGHT + SPARK_HEIGHT)
        : chartBounds.bottom + TOOLTIP_OFFSET_Y;
    const left = position?.x
      ? Math.min(
          chartBounds.left + position.x,
          window.innerWidth - (TOOLTIP_WIDTH + TOOLTIP_OFFSET_X)
        )
      : chartBounds.left;
    const width = type === "spark" ? TOOLTIP_WIDTH : chartBounds.width;

    return (
      <div className="fixed z-20 w-full flex" style={{ top, left, width }}>
        <div className="rounded-md w-full bg-primary/90 py-2 px-4 shadow-2xl">
          <div className="text-background font-bold text-lg border-b mb-2 flex flex-row gap-2 items-center">
            {data.Date ? (
              <>
                <Calendar className="size-4" />
                {formatDateString(data.Date)}
              </>
            ) : (
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row gap-1 items-center">
                  <Calendar className="size-4" />
                  {formatDateString(data.Datetime)}
                </div>

                <div className="flex flex-row gap-1 items-center">
                  <Clock className="size-4" />
                  {formatTimeString(data.Datetime)}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-primary box-content flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl border shadow-sm">
              <p className="text-background w-1/2 truncate rounded-l-md px-4 py-2 text-center text-xs font-bold">
                Open
              </p>
              <p className="from-card/90 to-background bg-gradient-to-r w-1/2 transform truncate rounded-l-xl px-4 py-2 text-center text-xs font-bold">
                {data.Open.toFixed(2)}
              </p>
            </div>
            <div className="bg-primary box-content flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl border shadow-sm">
              <p className="text-background w-1/2 truncate rounded-l-md px-4 py-2 text-center text-xs font-bold">
                High
              </p>
              <p className="from-card/90 to-background bg-gradient-to-r w-1/2 transform truncate rounded-l-xl px-4 py-2 text-center text-xs font-bold">
                {data.High.toFixed(2)}
              </p>
            </div>
            <div className="bg-primary box-content flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl border shadow-sm">
              <p className="text-background w-1/2 truncate rounded-l-md px-4 py-2 text-center text-xs font-bold">
                Low
              </p>
              <p className="from-card/90 to-background bg-gradient-to-r w-1/2 transform truncate rounded-l-xl px-4 py-2 text-center text-xs font-bold">
                {data.Low.toFixed(2)}
              </p>
            </div>
            <div className="bg-primary box-content flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl border shadow-sm">
              <p className="text-background w-1/2 truncate rounded-l-md px-4 py-2 text-center text-xs font-bold">
                Close
              </p>
              <p className="from-card/90 to-background bg-gradient-to-r w-1/2 transform truncate rounded-l-xl px-4 py-2 text-center text-xs font-bold">
                {data.Close.toFixed(2)}
              </p>
            </div>
            <div className="bg-primary box-content flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl border shadow-sm">
              <p className="text-background w-1/2 truncate rounded-l-md px-4 py-2 text-center text-xs font-bold">
                Volume
              </p>
              <p className="from-card/90 to-background bg-gradient-to-r w-1/2 transform truncate rounded-l-xl px-4 py-2 text-center text-xs font-bold">
                {compactNumber(data.Volume)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
