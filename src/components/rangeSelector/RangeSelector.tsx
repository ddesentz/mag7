import { useEffect, useState, type FC } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn, convertDateString, getDateString } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

const ToggleOptions = ["1d", "5d", "1m", "6m", "1y", "5y"];

interface RangeSelectorProps {
  toggleItem: string;
  setToggleItem: React.Dispatch<React.SetStateAction<string>>;
  setStart: React.Dispatch<React.SetStateAction<string>>;
  setEnd: React.Dispatch<React.SetStateAction<string>>;
}

export const RangeSelector: FC<RangeSelectorProps> = ({
  toggleItem,
  setToggleItem,
  setStart,
  setEnd,
}) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleSizeChange = (value: string) => {
    if (value) {
      setToggleItem(value);
      switch (value) {
        case "1d":
          setStart(getDateString(1));
          setDate(undefined);
          break;
        case "5d":
          setStart(getDateString(5));
          setDate(undefined);
          break;
        case "1m":
          setStart(getDateString(31));
          setDate(undefined);
          break;
        case "6m":
          setStart(getDateString(186));
          setDate(undefined);
          break;
        case "1y":
          setStart(getDateString(365));
          setDate(undefined);
          break;
        case "5y":
          setStart(getDateString(1825));
          setDate(undefined);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (date && date.from && date.to && date.from !== date.to) {
      setStart(convertDateString(new Date(date.from)));
      setEnd(convertDateString(new Date(date.to)));
    }
  }, [date]);

  return (
    <ToggleGroup
      type="single"
      value={toggleItem}
      onValueChange={(value) => handleSizeChange(value)}
      className="box-border min-h-10 w-fit max-w-full flex-nowrap overflow-auto justify-start rounded-md border border-card p-1"
    >
      {ToggleOptions.map((option, idx) => (
        <ToggleGroupItem key={idx} value={option} className="!w-8">
          {option.toUpperCase()}
        </ToggleGroupItem>
      ))}
      <ToggleGroupItem
        value={"custom"}
        className={toggleItem !== "custom" ? "!w-16" : "!w-fit p-0"}
      >
        {toggleItem !== "custom" ? (
          <p className="flex flex-1 items-center justify-center">Custom</p>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                >
                  <span
                    className={cn("truncate", !date && "text-muted-foreground")}
                  >
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </span>
                  <CalendarIcon
                    size={16}
                    className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <Calendar mode="range" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
