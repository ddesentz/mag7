import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi_cache.decorator import cache
from starlette.concurrency import run_in_threadpool

MAG7 = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]

def _choose_interval(start: str, end: str) -> str:
    startTime = datetime.strptime(start, "%Y-%m-%d")
    endTime = datetime.strptime(end,   "%Y-%m-%d")
    days = (endTime - startTime).days
    if days <= 1:  return "15m"
    if days <= 5:  return "90m"
    if days <= 365:return "1d"
    return "1wk"

async def getSymbolInfo(symbol: str):
    ticker = yf.Ticker(symbol)
    info = ticker.get_info()
    return {
        "symbol": info.get("symbol"),
        "name": info.get("longName"),
        "website": info.get("website"),
    }

async def getAllStocks(start: str, end: str) -> List[Dict[str, Any]]:
    interval = _choose_interval(start, end)
    inclusive_end = datetime.strptime(end, "%Y-%m-%d") + timedelta(days=1)

    def _download():
        return yf.download(
            MAG7,
            start=start,
            end=inclusive_end,
            interval=interval,
            group_by="ticker",
            auto_adjust=False,
            threads=True,
        )
    data = await run_in_threadpool(_download)
        
    multi = isinstance(data.columns, pd.MultiIndex)
    results = []
    for ticker in MAG7:
        df = data[ticker] if multi else data
        if df.empty:
            results.append({"data": [], "change": {"percent": None, "delta": None}, "symbol": ticker})
            continue

        latest_close = float(df["Close"].iloc[-1])
        prev_close = float(df["Close"].iloc[0])
          
        results.append({"data": df.reset_index().to_dict(orient="records"),
                        "change": {"percent": ((latest_close - prev_close) / prev_close) * 100,
                                    "delta": latest_close - prev_close},
                        "symbol": ticker})

    return results