import pytest

@pytest.mark.asyncio
async def test_mag7_basic_ok(client, monkeypatch):
    from app import yfinance as yfmod

    calls = {"count": 0}
    async def fake_get_all(start: str, end: str):
        calls["count"] += 1
        return [
            {
                "data": [{"Date": "2025-08-08", "Close": 1.23}],
                "change": {"percent": 0.0, "delta": 0.0},
                "info": {"symbol": "MSFT", "name": "Microsoft", "website": "https://microsoft.com"},
                "interval": "1h",
            }
        ]
    monkeypatch.setattr(yfmod, "getAllStocks", fake_get_all, raising=True)

    # Act: first call (cache miss)
    r1 = await client.get("/api/mag7", params={"start": "2025-08-08", "end": "2025-08-09"})
    assert r1.status_code == 200
    data1 = r1.json()
    assert isinstance(data1, list) and data1[0]["info"]["symbol"] == "MSFT"

    # Act: second call (same params → should hit cache)
    r2 = await client.get("/api/mag7", params={"start": "2025-08-08", "end": "2025-08-09"})
    assert r2.status_code == 200
    assert calls["count"] == 1

@pytest.mark.asyncio
async def test_mag7_force_refresh_bypasses_cache(client, monkeypatch):
    from app import yfinance as yfmod

    calls = {"count": 0}
    async def fake_get_all(start: str, end: str):
        calls["count"] += 1
        return [{"data": [], "change": {"percent": None, "delta": None}, "info": {"symbol": "AAPL"}}]
    monkeypatch.setattr(yfmod, "getAllStocks", fake_get_all, raising=True)

    # First call populates cache
    r1 = await client.get("/api/mag7", params={"start": "2025-08-01", "end": "2025-08-07"})
    assert r1.status_code == 200
    assert calls["count"] == 1

    # Second call with forceRefresh should recompute
    r2 = await client.get("/api/mag7", params={"start": "2025-08-01", "end": "2025-08-07", "forceRefresh": "true"})
    assert r2.status_code == 200
    assert calls["count"] == 2