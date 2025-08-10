import React, { type JSX } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableVirtuoso, type TableVirtuosoHandle } from "react-virtuoso";
import { rankItem } from "@tanstack/match-sorter-utils";
import { DataTableToolbar } from "./data-table-toolbar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../table";
import { Mag7Loading } from "../Mag7Loading";

interface DataTableProps<TData, TValue> {
  id: string;
  tableRef?: React.MutableRefObject<TableVirtuosoHandle | null>;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  defaultComponent?: JSX.Element | undefined;
  toolbar?: JSX.Element | undefined;
  selectionAction?: (rowData: any) => void;
  subComponentRenderer?: (props: { row: Row<TData> }) => React.ReactElement;
  initialSort?: SortingState;
  searchProps?: { searchAccessor: string; searchValue: string };
  focusRowId?: string;
  className?: string;
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  ...props
}: DataTableProps<TData, TValue>) {
  return <VirtualTable {...props} />;
}

function VirtualTable<TData, TValue>({
  ...props
}: DataTableProps<TData, TValue>) {
  const {
    tableRef,
    columns,
    data,
    loading,
    defaultComponent,
    toolbar,
    searchProps,
    selectionAction,
    subComponentRenderer,
    initialSort,
    focusRowId,
  } = props;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>(initialSort || []);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableColumnResizing: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const { rows } = table.getRowModel();

  React.useEffect(() => {
    if (table && searchProps) {
      table
        .getColumn(searchProps.searchAccessor)
        ?.setFilterValue(searchProps.searchValue);
    }
  }, [table, searchProps]);

  return (
    <div
      ref={containerRef}
      className="flex max-h-full w-full flex-col space-y-2 h-full"
    >
      {toolbar || <DataTableToolbar table={table} />}
      <div
        className={`bg-card !m-0 flex h-full w-full flex-1 overflow-hidden rounded-md border border-muted-foreground/30 shadow-lg`}
      >
        <TableVirtuoso
          ref={tableRef}
          className={cn(
            !table.getRowModel().rows.length ? "[&>div>div]:h-full" : "",
            "w-full rounded-md"
          )}
          totalCount={rows.length}
          data={rows}
          components={{
            Table: React.forwardRef(
              (props, ref: React.ForwardedRef<HTMLTableElement>) => {
                return (
                  <Table
                    ref={ref}
                    {...props}
                    className="h-full border-separate"
                  />
                );
              }
            ) as any,
            TableBody: React.forwardRef(
              (props, ref: React.ForwardedRef<HTMLTableSectionElement>) => {
                if (table.getRowModel().rows.length) {
                  return <TableBody ref={ref} {...props} />;
                }
                return (
                  <TableBody>
                    <TableRow className="hover:bg-card">
                      <TableCell
                        colSpan={columns.length}
                        className="h-full text-center"
                      >
                        {loading ? (
                          <Mag7Loading className="flex h-[200px] w-full items-center" />
                        ) : (
                          defaultComponent || "No results."
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              }
            ),
            TableRow: React.forwardRef(
              (props: any, ref: React.ForwardedRef<HTMLTableRowElement>) => {
                const row = props.item;
                return (
                  <>
                    <TableRow
                      ref={ref}
                      {...props}
                      onClick={(e) => {
                        if (!selectionAction) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                        row.toggleSelected();
                        if (selectionAction) {
                          selectionAction(row.original);
                        }
                      }}
                      className={cn(
                        selectionAction && "cursor-pointer",
                        focusRowId &&
                          row.original.id === focusRowId &&
                          "bg-accent outline-accent-foreground rounded-md outline -outline-offset-2"
                      )}
                    />
                    {subComponentRenderer &&
                      row.getIsExpanded() &&
                      subComponentRenderer({ row })}
                  </>
                );
              }
            ) as any,
          }}
          itemContent={(_, row) => (
            <>
              {row.getVisibleCells().map((cell) => {
                const isActionCell = cell.column.id.startsWith("cyto_");
                return (
                  <TableCell
                    key={cell.id}
                    className="border-border border-b"
                    onClick={(e) => {
                      if (isActionCell) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </>
          )}
          fixedHeaderContent={() =>
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`bg-card border-border sticky top-0 border-b`}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))
          }
        />
      </div>
    </div>
  );
}
