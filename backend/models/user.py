from typing import Any

from pydantic import Field
from pymongo.asynchronous.database import AsyncDatabase

from models.MongoModelBase import MongoModelBase
from models.TypedCollection import TypedCollection


class User(MongoModelBase):
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")


def get_user_collection(db: AsyncDatabase[dict[str, Any]]) -> TypedCollection[User]:
    return TypedCollection(db["user"], User)
