from fastapi import APIRouter, Response, status

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout_admin(response: Response):
    """Placeholder logout endpoint to keep client flows stable."""

    # Clear common cookie names defensively. These will be present once
    # authentication issues signed cookies/tokens for admins.
    for cookie_name in ("session", "refresh_token", "access_token"):
        response.delete_cookie(cookie_name)

    return {
        "success": True,
        "message": "Logged out",
    }
