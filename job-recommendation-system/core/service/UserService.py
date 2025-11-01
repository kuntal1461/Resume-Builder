from typing import Protocol

from core.requestVO.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.requestVO.AuthRegisterRequestVO import AuthRegisterRequestVO
from core.responseVO.AuthEmailLoginResponseVO import AuthEmailLoginResponseVO
from core.responseVO.AuthRegisterResponseVO import AuthRegisterResponseVO


class UserService(Protocol):
    def authenticate_user_email(
        self, req: AuthEmailLoginRequestVO
    ) -> AuthEmailLoginResponseVO:
        ...

    def register_user(self, req: AuthRegisterRequestVO) -> AuthRegisterResponseVO:
        ...
