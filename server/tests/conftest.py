import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from httpx import AsyncClient
from asgi_lifespan import LifespanManager
from app.main import app
import pytest

@pytest.fixture
async def app_instance():
    return app

@pytest.fixture
async def client(app_instance):
    async with LifespanManager(app_instance):
        async with AsyncClient(app=app_instance, base_url="http://testserver") as ac:
            yield ac
