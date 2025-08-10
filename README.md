# MAG7

MAG7 is a full-stack application that displays the daily returns of the <b>MAG7 Stocks</b> <i>(MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA)</i> using data from [yfinance](https://ranaroussi.github.io/yfinance/).

## Installation

To run MAG7 locally you'll need to run both the React UI and the Python server in separate terminals. Dependencies were installed with
[pnpm](https://pnpm.io/installation) for the frontend and [pip](https://pip.pypa.io/en/stable/installation/) for the backend.

### Running Local Server

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

### Running Dev UI

```bash
cd mag7
pnpm install
pnpm run dev
```

[Vite Dev UI](http://localhost:3000/)

### Running Tests

```bash
cd mag7/server
pytest --cov=app --cov-report=term-missing
```
