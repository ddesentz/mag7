import "./App.css";
import { useEffect, useState } from "react";
import Header from "./components/header/header";
import { TickerGrid } from "./components/tickerGrid/TickerGrid";
import { getDateString } from "./lib/utils";
import { RangeSelector } from "./components/rangeSelector/RangeSelector";
import { Button } from "./components/ui/button";
import { CircleAlert, RotateCw } from "lucide-react";
import { Mag7Loading } from "./components/ui/Mag7Loading";
import { DataTable } from "./components/ui/DataTable/data-table";
import { mag7Columns } from "./components/tables/tableColumns";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [tickers, setTickers] = useState<any[]>([]);
  const [toggleItem, setToggleItem] = useState<string>("1d");
  const [end, setEnd] = useState<string>(getDateString(0));
  const [start, setStart] = useState<string>(getDateString(1));
  const [isLoading, setIsLoading] = useState(false);

  async function fetchItems(signal: AbortSignal): Promise<any[]> {
    setIsLoading(true);
    const res = await fetch(`/api/mag7?start=${start}&end=${end}`, { signal });
    return res.json();
  }

  async function fetchItemsNoCache() {
    const controller = new AbortController();
    const { signal } = controller;

    setIsLoading(true);
    const res = await fetch(
      `/api/mag7?start=${start}&end=${end}&cacheTimestamp=${new Date().toISOString()}`,
      { signal }
    );
    res
      .json()
      .then((data) => {
        if (Array.isArray(data)) {
          setTickers(data);
        } else {
          toast(
            () => (
              <div className="flex w-full flex-row items-center gap-2">
                <CircleAlert className="size-4 text-red-500" />
                <p className="text-md">Failed to fetch data</p>
              </div>
            ),
            {
              description: data.detail,
              duration: 6000,
            }
          );
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });

    return controller;
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchItems(signal)
      .then((data: any) => {
        if (Array.isArray(data)) {
          setTickers(data);
        } else {
          toast(
            () => (
              <div className="flex w-full flex-row items-center gap-2">
                <CircleAlert className="size-4 text-red-500" />
                <p className="text-md">Failed to fetch data</p>
              </div>
            ),
            {
              description: data.detail,
              duration: 6000,
            }
          );
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [start, end]);

  return (
    <>
      <Header />
      <main className="pt-4 mx-8 flex-1 flex">
        <div className="@container/main flex-1 flex-col gap-2 flex min-h-0 mb-4">
          <div className="flex flex-row items-center justify-between w-full gap-4">
            <div className="flex flex-row gap-2 items-center">
              <RangeSelector
                toggleItem={toggleItem}
                setToggleItem={setToggleItem}
                setStart={setStart}
                setEnd={setEnd}
              />
              {isLoading && tickers.length !== 0 && (
                <Mag7Loading className="flex flex-1 size-6 opacity-30" />
              )}
            </div>

            <Button
              variant={"outline"}
              className="cursor-pointer size-10"
              onClick={fetchItemsNoCache}
            >
              <RotateCw />
            </Button>
          </div>
          {tickers.length !== 0 && (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
              <TickerGrid tickers={tickers} />
            </div>
          )}
          <div className="@container h-full w-full flex-grow min-h-120">
            <DataTable
              id="Mag7Table"
              data={tickers}
              columns={mag7Columns as any[]}
              loading={isLoading}
              defaultComponent={undefined}
              toolbar={<></>}
            />
          </div>
        </div>
        <Toaster />
      </main>
    </>
  );
}

export default App;
