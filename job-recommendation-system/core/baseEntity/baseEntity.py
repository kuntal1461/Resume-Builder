from sqlalchemy.orm import declarative_base
from backend_common.orm.common import BaseEntityMixin

BaseEntity = declarative_base(cls=BaseEntityMixin)
