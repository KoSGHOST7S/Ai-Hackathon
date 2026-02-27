import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DBSession, SuperUser
from app.schemas.auth import MessageResponse
from app.schemas.user import UserPublic, UserRead, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserRead])
async def list_users(db: DBSession, _: SuperUser, skip: int = 0, limit: int = 20):
    """List all users. Superuser only."""
    service = UserService(db)
    return await service.get_all(skip=skip, limit=limit)


@router.get("/me", response_model=UserRead)
async def get_my_profile(current_user: CurrentUser):
    """Get the authenticated user's full profile."""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_my_profile(payload: UserUpdate, db: DBSession, current_user: CurrentUser):
    """Update the authenticated user's profile."""
    service = UserService(db)

    if payload.email and payload.email != current_user.email:
        existing = await service.get_by_email(payload.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use",
            )

    return await service.update(current_user, payload)


@router.delete("/me", response_model=MessageResponse)
async def delete_my_account(db: DBSession, current_user: CurrentUser):
    """Delete the authenticated user's account."""
    service = UserService(db)
    await service.delete(current_user)
    return MessageResponse(message="Account deleted successfully")


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(user_id: uuid.UUID, db: DBSession, _: CurrentUser):
    """Get a user's public profile by ID."""
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: uuid.UUID, db: DBSession, _: SuperUser):
    """Delete a user by ID. Superuser only."""
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await service.delete(user)
    return MessageResponse(message="User deleted successfully")
