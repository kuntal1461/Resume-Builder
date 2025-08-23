from dataclasses import dataclass

@dataclass(frozen=True)
class AuthEmailLoginRequestVO:
    email: str
    password: str