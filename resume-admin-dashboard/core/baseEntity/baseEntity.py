from sqlalchemy.orm import declarative_base
from backend_common.orm.common import CommonEntityMixin

Base = declarative_base()

class CommonEntity(CommonEntityMixin):
    __abstract__ = True
    pass
