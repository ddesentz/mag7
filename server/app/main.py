import orjson

from fastapi import FastAPI, APIRouter, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi_cache.decorator import cache
from fastapi_cache import FastAPICache, Coder
from fastapi_cache.backends.redis import RedisBackend
from fastapi.encoders import jsonable_encoder
from redis import asyncio as aioredis
from pathlib import Path
from typing import Any
from contextlib import asynccontextmanager

from .yfinance import getAllStocks, getSymbolInfo
from .utils import StaticCacheMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    redis = aioredis.from_url("redis://127.0.0.1:6379", decode_responses=False)
    FastAPICache.init(RedisBackend(redis), prefix="mag7_cache")
    yield
    # Shutdown
    await redis.close()

app = FastAPI(title="MAG7", lifespan=lifespan)
app.add_middleware(StaticCacheMiddleware)

class ORJsonCoder(Coder):
    @classmethod
    def encode(cls, value: Any) -> bytes:
        return orjson.dumps(value, default=jsonable_encoder)
    @classmethod
    def decode(cls, value: bytes) -> Any:
        return orjson.loads(value)

api = APIRouter(prefix="/api")

SCHEMA_VERSION = "v1"

def mag7_key_builder(func, namespace, request, response, args, kwargs):
    start = kwargs.get("start")
    end = kwargs.get("end")
    cache_timestamp = kwargs.get("cacheTimestamp", "")
    if cache_timestamp:
        return f"{namespace}:{SCHEMA_VERSION}:mag7:{start}:{end}:nocache:{cache_timestamp}"
    
    return f"{namespace}:{SCHEMA_VERSION}:mag7:{start}:{end}"

@api.get("/mag7")
@cache(expire=86400, key_builder=mag7_key_builder)
async def list_stocks(
    start: str = Query(..., description="Start date in YYYY-MM-DD"),
    end: str = Query(..., description="End date in YYYY-MM-DD"),
    cacheTimestamp: str = Query("", description="Bypass cache with current timestamp")
):
    if end < start:
        raise HTTPException(status_code=400, detail="end must be on/after start")
    try:
        data = await getAllStocks(start=start, end=end)
        if not data or all(len(item.get("data", [])) == 0 for item in data):
            raise HTTPException(status_code=400, detail="No data for given date range")
        return data
    except HTTPException:
        raise 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


def info_key_builder(func, namespace, request, response, args, kwargs):
    symbol = kwargs.get("symbol")
    return f"{namespace}:info:{symbol}"

@api.get("/info")
@cache(expire=86400, key_builder=info_key_builder)
async def get_symbol_info(
    symbol: str = Query(..., description="Company Symbol"),
):
    try:
        return await getSymbolInfo(symbol=symbol)
    except HTTPException:
        raise 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

app.include_router(api)

# --- Static / UI ---
ROOT = Path(__file__).resolve().parents[2]
UI_DIST = ROOT / "dist" 
STATIC_DIR = ROOT / "static" 

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/", StaticFiles(directory=UI_DIST, html=True), name="ui")