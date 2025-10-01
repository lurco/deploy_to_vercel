"""FastAPI application entrypoint.

This module exposes a FastAPI app with typed routes and rich OpenAPI metadata.
It also demonstrates how to work with the project's typed MongoDB collections.

Run with: uvicorn main:app --reload
"""

import logging
from typing import Any, Annotated

from fastapi import FastAPI, HTTPException, Query, status, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db import get_database
from models.user import User, get_user_collection
from api.schemas import UserCreate, UserRead, UserId, parse_object_id
from pymongo.asynchronous.database import AsyncDatabase

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance.

    Returns:
        FastAPI: The configured FastAPI app.
    """
    app = FastAPI(
        title="HackYeah 2025 Backend API",
        version="0.1.0",
        description=(
            "Backend API serving user resources backed by MongoDB with typed collections.\n\n"
            "Features:\n"
            "- Strict Pydantic models with aliases for Mongo compatibility\n"
            "- Fully typed endpoints with response models\n"
            "- OpenAPI examples and detailed response schemas"
        ),
        contact={
            "name": "HackYeah Team",
            "url": "https://example.com",
        },
    )

    logger.info(f'Enable CORS for URL: {settings.WEB_URL}')

    # Enable CORS for all origins, methods, and headers
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.WEB_URL],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get(
        "/health",
        summary="Service health check",
        response_description="Health details including DB connectivity",
        responses={
            200: {
                "description": "Service is healthy and reachable",
                "content": {
                    "application/json": {
                        "example": {
                            "status": "ok",
                            "db": {"ok": 1.0},
                            "app": "ready",
                        }
                    }
                },
            },
            503: {
                "description": "Service unhealthy or DB not reachable",
                "content": {
                    "application/json": {
                        "example": {
                            "status": "degraded",
                            "reason": "database unreachable",
                        }
                    }
                },
            },
        },
        tags=["meta"],
    )
    async def health(db: Annotated[AsyncDatabase, Depends(get_database)]) -> JSONResponse:
        """Return service health information.

        Tries to ping the MongoDB server. If ping fails, returns HTTP 503.

        Examples:
            >>> # In a running server, call GET /health
            >>> # Response JSON: {"status": "ok", "db": {"ok": 1.0}, "app": "ready"}
        """
        try:
            ping: dict[str, Any] = await db.command({"ping": 1})
            return JSONResponse({"status": "ok", "db": ping, "app": "ready"})
        except Exception as exc:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "degraded", "reason": str(exc)},
            )

    @app.post(
        "/users",
        summary="Create a new user",
        response_model=UserRead,
        status_code=status.HTTP_201_CREATED,
        response_description="The created user document",
        responses={
            201: {
                "description": "User created",
                "content": {
                    "application/json": {
                        "examples": {
                            "created": {
                                "summary": "Successful creation",
                                "value": {
                                    "_id": "652f1f7a3e0a2b001234abcd",
                                    "firstName": "Ada",
                                    "lastName": "Lovelace",
                                },
                            }
                        }
                    }
                },
            }
        },
        tags=["users"],
    )
    async def create_user(payload: UserCreate, db: Annotated[AsyncDatabase, Depends(get_database)]) -> UserRead:
        """Create a user document.

        Example request body:
            {
              "firstName": "Ada",
              "lastName": "Lovelace"
            }
        """
        # Validate against the domain model (reusing the existing model with aliases)
        domain = User.model_validate(payload.model_dump(by_alias=True))
        created = await get_user_collection(db).insert_one(domain)
        return UserRead.model_validate(created.model_dump(by_alias=True))

    @app.get(
        "/users",
        summary="List users",
        response_model=list[UserRead],
        response_description="A list of user documents",
        tags=["users"],
    )
    async def list_users(
        skip: Annotated[int, Query(ge=0, description="Number of items to skip")] = 0,
        limit: Annotated[
            int | None,
            Query(ge=1, le=100, description="Max number of items to return"),
        ] = None,
        q: Annotated[
            str | None, Query(description="Regex to filter first_name")
        ] = None,
        db: AsyncDatabase = Depends(get_database),
    ) -> list[UserRead]:
        """List users with optional pagination and filter by first name regex."""
        filt: dict[str, Any] | None = None
        if q:
            filt = {"first_name": {"$regex": q}}
        users = get_user_collection(db)
        docs = await users.find(filter_=filt, skip=skip, limit=limit)
        return [UserRead.model_validate(d.model_dump(by_alias=True)) for d in docs]

    @app.get(
        "/users/{user_id}",
        summary="Get user by id",
        response_model=UserRead,
        responses={
            200: {"description": "User found"},
            404: {
                "description": "User not found",
                "content": {
                    "application/json": {"example": {"detail": "User not found"}}
                },
            },
        },
        tags=["users"],
    )
    async def get_user(user_id: UserId, db: Annotated[AsyncDatabase, Depends(get_database)]) -> UserRead:
        """Fetch a single user by Mongo ObjectId."""
        oid = parse_object_id(user_id)
        users = get_user_collection(db)
        doc = await users.find_one({"_id": oid})
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return UserRead.model_validate(doc.model_dump(by_alias=True))

    return app


app = create_app()
