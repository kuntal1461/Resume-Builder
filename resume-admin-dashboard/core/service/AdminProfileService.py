from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class AdminProfile:
    """Canonical representation of an admin profile within the core layer."""

    id: int
    email: str
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    is_admin: bool = True


class AdminProfileService(ABC):
    """Contract for resolving the current admin profile."""

    @abstractmethod
    def get_current_admin(self) -> AdminProfile:
        """Return the current admin profile, or raise if none exists."""
        raise NotImplementedError
