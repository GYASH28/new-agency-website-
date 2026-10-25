"""Local static preview with Vercel-style clean URL rewrites. Python 3 stdlib only."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent.parent
ROUTES = {"/work": "work.html", "/services": "services.html", "/plans": "plans.html", "/studio": "studio.html", "/contact": "contact.html"}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        original = self.path
        path = original.split("?", 1)[0].rstrip("/") or "/"
        if path in ROUTES:
            query = "?" + original.split("?", 1)[1] if "?" in original else ""
            self.path = "/" + ROUTES[path] + query
        super().do_GET()

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    print(f"BRAYRO AI preview → http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
