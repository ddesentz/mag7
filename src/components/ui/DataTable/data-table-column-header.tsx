import type { JSX } from "react";
import { type Column, type SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  titleIcon?: JSX.Element;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  titleIcon,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          className,
          "flex flex-row flex-nowrap gap-1 whitespace-nowrap"
        )}
      >
        {titleIcon}
        {title}
      </div>
    );
  }

  const handleSorting = () => {
    const currentSort: false | SortDirection = column.getIsSorted();
    if (currentSort !== false) {
      if (currentSort === "asc") {
        column.toggleSorting(true);
      } else {
        column.toggleSorting(false);
      }
    } else {
      column.toggleSorting(true);
    }
  };

  return (
    <div
      className={cn("flex cursor-pointer items-center space-x-2 ", className)}
      onClick={handleSorting}
    >
      <span className="flex flex-row flex-nowrap gap-1 whitespace-nowrap">
        {titleIcon}
        {title}
      </span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="size-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="size-4" />
      ) : (
        <ChevronsUpDown className="size-4" />
      )}
    </div>
  );
}
