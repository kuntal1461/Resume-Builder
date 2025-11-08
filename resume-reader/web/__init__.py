from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]
REPO_ROOT_STR = str(REPO_ROOT)

if REPO_ROOT_STR not in sys.path:
    sys.path.append(REPO_ROOT_STR)

from .app import create_app

__all__ = ["create_app"]
