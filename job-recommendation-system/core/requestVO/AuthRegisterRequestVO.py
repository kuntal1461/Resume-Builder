from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class AuthRegisterRequestVO:
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    dob: Optional[datetime] = None
    is_admin: bool = False
