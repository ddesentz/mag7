import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/DataTable/data-table-column-header";
import { cn } from "@/lib/utils";
import { TrendSparkLine } from "../trend/TrendSparkLine";

export const mag7Columns: ColumnDef<any>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const symbol = row.original.symbol;
      return (
        <p className="text-foreground text-md truncate font-semibold flex flex-row items-center gap-4 min-w-30">
          <img
            src={`/static/${symbol}.png`}
            alt="Hero"
            className="size-8 drop-shadow-xs drop-shadow-foreground/30 p-1"
          />
          {symbol}
        </p>
      );
    },
    size: 200,
  },
  {
    id: "price",
    accessorFn: (row) => {
      return row.data.at(-1).Close;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price ($)" />
    ),
    cell: ({ row }) => {
      const price = row.original.data.at(-1);
      return (
        <p className="text-foreground text-md truncate font-bold">
          {price ? `$${price.Close.toFixed(2)}` : "--"}
        </p>
      );
    },
    size: 100,
  },
  {
    id: "today",
    accessorFn: (row) => {
      return row.change.percent;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Today (%)" />
    ),
    cell: ({ row }) => {
      const delta = row.original.change.delta
        ? row.original.change.delta.toFixed(2)
        : "--";
      const today = row.original.change.percent
        ? row.original.change.percent.toFixed(2)
        : "--";

      return (
        <span
          className={cn(
            "text-foreground text-md truncate flex flex-row items-center gap-2",
            today > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          <p>{delta > 0 ? `+${delta}` : delta}</p>
          <p>({today}%)</p>
        </span>
      );
    },
    size: 150,
  },
  {
    accessorKey: "trend",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trend" />
    ),
    cell: ({ row }) => {
      const delta = row.original.change.delta
        ? row.original.change.delta.toFixed(2)
        : null;

      if (!delta) return;
      const closes = row.original.data.map((point: any) => point.Close);
      const average =
        closes.reduce((sum: number, item: any) => sum + item, 0) /
        closes.length;
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-muted-foreground text-xs h-full">
            {average.toFixed(2)}
          </p>
          <TrendSparkLine
            symbol={row.original.symbol}
            trendUp={delta > 0}
            history={row.original.data}
            average={average}
          />
          <div className="flex flex-col gap-1 h-full">
            <p className="text-muted-foreground text-xs">
              {Math.max(...closes).toFixed(2)}
            </p>
            <p className="text-muted-foreground text-xs">
              {Math.min(...closes).toFixed(2)}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: false,
    size: 800,
  },
];
