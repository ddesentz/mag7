# MAG7

MAG7 is a full-stack application that displays the daily returns of the <b>MAG7 Stocks</b> <i>(MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA)</i> using data from [yfinance](https://ranaroussi.github.io/yfinance/).

## Installation

To run MAG7 locally you'll need to run both the React UI and the Python server in separate terminals. Dependencies were installed with
[pnpm](https://pnpm.io/installation) for the frontend and [pip](https://pip.pypa.io/en/stable/installation/) for the backend.

```bash
# --- Install Dependencies for Frontend --- #
cd <pathToWorkspace>/mag7
pnpm install

# --- Separate Terminal --- #

# --- Activate Virtual Environment for Backend --- #
cd <pathToWorkspace>/mag7/server
.venv\Scripts\activate
```

#### Running UI in Dev

```
cd <pathToWorkspace>/mag7
pnpm run dev
```

[Dev UI](http://localhost:3000/)

#### Running Local Server

```
cd <pathToWorkspace>/mag7/server
.venv\Scripts\activate
py -m uvicorn app.main:app --reload --port 8000
```
