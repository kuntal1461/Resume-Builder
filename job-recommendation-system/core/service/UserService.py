from typing import Protocol

from core.RequestVo.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.RequestVo.AuthRegisterRequestVO import AuthRegisterRequestVO
from core.responseVO.AuthEmailLoginResponseVO import AuthEmailLoginResponseVO
from core.responseVO.AuthRegisterResponseVO import AuthRegisterResponseVO


class UserService(Protocol):
    def authenticate_user_email(
        self, req: AuthEmailLoginRequestVO
    ) -> AuthEmailLoginResponseVO:
        ...

    def register_user(self, req: AuthRegisterRequestVO) -> AuthRegisterResponseVO:
        ...
