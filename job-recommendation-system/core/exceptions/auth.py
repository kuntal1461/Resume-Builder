class UserNotFoundError(Exception):
    """Raised when no user exists for the given email."""
    pass

class InvalidCredentialsError(Exception):
    """Raised when the password is incorrect."""
    pass