from starlette.middleware.base import BaseHTTPMiddleware

class StaticCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.startswith("/static/"):
            # hashed filenames can use longer caching; adjust as you prefer
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response