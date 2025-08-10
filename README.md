<p align="center">
  <img src="https://i.imgur.com/H7T7h5W.png" width="200"/>
</p>

# MAG7

MAG7 is a full-stack application that displays the daily returns of the <b>MAG7 Stocks</b> <i>(MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA)</i> using data from [yfinance](https://ranaroussi.github.io/yfinance/).

## Installation

To run MAG7 locally you'll need to run both the React UI and the Python server in separate terminals. Dependencies were installed with
[pnpm](https://pnpm.io/installation) for the frontend and [pip](https://pip.pypa.io/en/stable/installation/) for the backend.

## Running Local Server

Create and activate a virtual environment

```bash
cd mag7/server
python -m venv .venv
# Activate (Windows PowerShell)
.venv\Scripts\Activate
# Activate (Mac/Linux)
source .venv/bin/activate
```

Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Run backend server

```bash
py -m uvicorn app.main:app --reload --port 8000
```

[API DOCS](http://127.0.0.1:8000/docs)

## Running Dev UI

```bash
cd mag7
pnpm install
pnpm run dev
```

[Vite Dev UI](http://localhost:3000/)

## Running Tests

```bash
cd mag7/server
pytest --cov=app --cov-report=term-missing
```

## Assumptions & Future Work

- If `yfinance` does not return data for the given time range, the grid simply does not show and the table is empty, as well as a toast pops up telling you that there is no data in this range. We could pad the start date a few days to account for holidays/weekends when the markets are closed, but this would lead to inconsistent UX when you have a lookback of "1d" but you see data from 3+ days ago.
- MAG7 symbols is hardcoded into the server. Ideally this list would come from some API to allow users to fetch data across all symbols.
- MAG7 logos are hardcoded into the codebase because `yfinance` seemingly stopped supporting `logo_url` from `Ticker.get_info()`
- The grid layout is not virtualized because we are only dealing with a small subset of symbols. In production this could cause performance issues if this app were to support all symbols, not just MAG7.
- Added a refetch without cache button (mainly for testing caching)
- Daily % returns is calcuated based on the first and last data point from the `yfinance` data. This makes it easy to understand what the trends are for a fixed time range.
- With more time I had planed to:
  - Add routing to allow users to click into a symbol for a more detailed view
  - Fetch more `yfinance` data and symbol info
  - Add support for more graph visualizations (Candle, Bar, TreeMap, Radar, etc)
  - Add more comparison tools for multiple symbols
  - Create Dockerized containers for the server and redis and Host this application in production
  - Add State Management (Preact/signals) to save symbol info across multiple components
