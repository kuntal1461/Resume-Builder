from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class AuthEmailLoginResponseVO:
    success: bool
    message: str
    user_id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    is_admin: bool = False
