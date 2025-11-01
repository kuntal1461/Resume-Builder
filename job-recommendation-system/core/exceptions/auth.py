class UserNotFoundError(Exception):
    """Raised when no user exists for the given email."""
    pass

class InvalidCredentialsError(Exception):
    """Raised when the password is incorrect."""
    pass

class UserAlreadyExistsError(Exception):
    """Raised when attempting to register with an existing identifier."""
    pass
