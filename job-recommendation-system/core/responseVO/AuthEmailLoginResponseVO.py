from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class AuthEmailLoginResponseVO:
    success: bool
    message: str
    user_id: int
    email: str
    username: Optional[str] = None
    is_admin: bool = False
