from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class UserProfileResponseVO:
    user_id: int
    email: Optional[str]
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
