# FastAPI + PostgreSQL Starter

A production-ready FastAPI application with PostgreSQL, async SQLAlchemy, JWT authentication, and Alembic migrations.

## Stack

- **FastAPI** — async web framework
- **PostgreSQL** — database (via asyncpg driver)
- **SQLAlchemy 2** — async ORM
- **Alembic** — database migrations
- **JWT** — stateless auth (access + refresh tokens)
- **bcrypt** — password hashing

## Project Structure

```
app/
├── api/
│   ├── deps.py          # FastAPI dependencies (auth guards)
│   ├── router.py        # Top-level API router
│   └── routes/
│       ├── auth.py      # Register, login, refresh, logout
│       └── users.py     # User CRUD endpoints
├── core/
│   ├── config.py        # Settings from .env
│   └── security.py      # JWT + password utils
├── db/
│   └── base.py          # Engine, session, Base ORM class
├── models/
│   └── user.py          # User SQLAlchemy model
├── schemas/
│   ├── auth.py          # Auth request/response schemas
│   └── user.py          # User Pydantic schemas
├── services/
│   └── user_service.py  # Business logic layer
└── main.py              # FastAPI app + lifespan
alembic/                 # Migration scripts
```

## Quickstart

### 1. Install dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a strong SECRET_KEY
```

### 3. Create the database

```sql
CREATE DATABASE appdb;
```

### 4. Run migrations

```bash
# Generate your first migration
alembic revision --autogenerate -m "initial"

# Apply migrations
alembic upgrade head
```

### 5. Start the server

```bash
uvicorn app.main:app --reload
```

Visit **http://localhost:8000/docs** for the interactive Swagger UI.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | — | Create new account |
| POST | `/api/v1/auth/login` | — | Login, returns tokens |
| POST | `/api/v1/auth/refresh` | — | Refresh access token |
| GET | `/api/v1/auth/me` | ✓ | Current user info |
| POST | `/api/v1/auth/logout` | ✓ | Logout (client clears tokens) |
| GET | `/api/v1/users/me` | ✓ | Get own profile |
| PATCH | `/api/v1/users/me` | ✓ | Update own profile |
| DELETE | `/api/v1/users/me` | ✓ | Delete own account |
| GET | `/api/v1/users/{id}` | ✓ | Get public profile by ID |
| GET | `/api/v1/users/` | superuser | List all users |
| DELETE | `/api/v1/users/{id}` | superuser | Delete user by ID |
| GET | `/health` | — | Health check |

## Generating a SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
