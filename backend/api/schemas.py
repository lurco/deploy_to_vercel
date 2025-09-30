"""Request/response API schemas and helpers for FastAPI endpoints.

This module keeps transport-layer models separate from domain models.
It leverages the domain `User` model and the Mongo `MongoMixinWithId` to
shape request and response payloads exposed by the API.
"""

from typing import Annotated

from bson import ObjectId
from fastapi import HTTPException, Path
from pydantic import BaseModel, Field

from models.MongoModelBase import MongoMixinWithId
from models.user import User


class UserCreate(BaseModel):
    """Schema for creating a user.

    Uses camelCase aliases to match Mongo document fields.

    Example:
        >>> UserCreate(firstName="Ada", lastName="Lovelace")  # doctest: +ELLIPSIS
        UserCreate(first_name='Ada', last_name='Lovelace')
    """

    first_name: str = Field(min_length=1, alias="firstName", description="User's given name")
    last_name: str = Field(min_length=1, alias="lastName", description="User's family name")

    def __repr__(self) -> str:
        return f"UserCreate(first_name={self.first_name!r}, last_name={self.last_name!r})"

    class Config:
        populate_by_name = True


class UserRead(User, MongoMixinWithId):
    """Schema returned by the API when a user document is read.

    Inherits from the domain model and includes the MongoDB-generated id.
    """

    def __repr__(self) -> str:
        return (
            f"UserRead(id={self.id!r}, first_name={self.first_name!r}, "
            f"last_name={self.last_name!r})"
        )


UserId = Annotated[str, Path(description="Hex string ObjectId", examples=["652f1f7a3e0a2b001234abcd"])]


def parse_object_id(id_str: str) -> ObjectId:
    """Parse a hex string into a Mongo ObjectId or raise HTTP 422.

    Args:
        id_str: The hex string representation of an ObjectId.
    Returns:
        ObjectId: Parsed identifier.
    Raises:
        HTTPException: If the id is not a valid ObjectId string.
    """
    try:
        return ObjectId(id_str)
    except Exception as exc:
        raise HTTPException(
            status_code=422, detail=f"Invalid ObjectId: {id_str}"
        ) from exc
