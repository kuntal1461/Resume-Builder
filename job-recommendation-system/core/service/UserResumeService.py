from typing import Optional, Protocol

from core.RequestVo.SaveResumeDraftRequestVO import SaveResumeDraftRequestVO
from core.responseVO.SaveResumeDraftResponseVO import SaveResumeDraftResponseVO
from core.responseVO.UserResumeDraftResponseVO import UserResumeDraftResponseVO


class UserResumeService(Protocol):
    def save_resume_draft(self, req: SaveResumeDraftRequestVO) -> SaveResumeDraftResponseVO:
        ...

    def get_resume_draft(self, user_id: int, template_id: int) -> Optional[UserResumeDraftResponseVO]:
        ...
