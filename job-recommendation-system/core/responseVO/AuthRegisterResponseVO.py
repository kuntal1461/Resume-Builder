from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class AuthRegisterResponseVO:
    success: bool
    message: str
    user_id: int
    email: str
    username: str
    phone_number: Optional[str]
