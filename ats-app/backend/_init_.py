"""
`backend` is a Python package. Imports can now refer to `backend.db`, `backend.routes`, etc.
"""

# Expose submodules for easier imports (optional)
from .db import getdb
from .routes import flights_api, tickets_api, auth_api  # adjust as needed

__all__ = ["getdb", "flights_api", "tickets_api", "auth_api"]
