from typing import Protocol
from core.requestVO import AuthEmailLoginRequestVO
from core.responseVO import AuthEmailLoginResponseVO

def authenticate_user_email(self, req: AuthEmailLoginRequestVO) -> AuthEmailLoginResponseVO:
        ...
