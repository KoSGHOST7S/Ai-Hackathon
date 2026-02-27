import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser, DBSession
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    TokenResponse,
)
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: DBSession):
    """Register a new user account."""
    service = UserService(db)

    if await service.get_by_email(payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    if await service.get_by_username(payload.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    user = await service.create(payload)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: DBSession):
    """Authenticate and receive access + refresh tokens."""
    service = UserService(db)
    user = await service.authenticate(payload.email, payload.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive",
        )

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh_token(payload: RefreshRequest, db: DBSession):
    """Exchange a refresh token for a new access token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )

    token_data = decode_token(payload.refresh_token)
    if not token_data or token_data.get("type") != "refresh":
        raise credentials_exception

    try:
        user_id = uuid.UUID(token_data["sub"])
    except (KeyError, ValueError):
        raise credentials_exception

    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user or not user.is_active:
        raise credentials_exception

    return AccessTokenResponse(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserRead)
async def get_me(current_user: CurrentUser):
    """Return the currently authenticated user."""
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: CurrentUser):
    """Logout endpoint (client should discard tokens)."""
    return MessageResponse(message="Successfully logged out")
