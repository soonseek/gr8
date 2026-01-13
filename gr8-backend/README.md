# gr8 Backend API

FastAPI + PostgreSQL backend for the gr8 decentralized trading platform.

## Features

- ✅ FastAPI 0.128+ with async/await support
- ✅ SQLAlchemy 2.0 Async with PostgreSQL
- ✅ Pydantic V2 for configuration and validation
- ✅ Alembic for database migrations
- ✅ Pytest with async test support
- ✅ Docker Compose for local development
- ✅ CORS middleware configured
- ✅ Type hints throughout (Python 3.11+)

## Quick Start

### Option 1: Local Development

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Option 2: Docker Compose

```bash
# Start PostgreSQL and FastAPI
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Testing

```bash
# Run all tests
pytest -v

# Run with coverage report
pytest -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_main.py -v
```

## Project Structure

```
gr8-backend/
├── app/
│   ├── api/              # API routers (future)
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration management
│   │   └── database.py   # Database session management
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   └── services/         # Business logic
├── alembic/              # Database migrations
├── tests/                # Test suite
│   ├── conftest.py       # Pytest fixtures
│   └── test_main.py      # API endpoint tests
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
├── Dockerfile            # Docker image definition
└── docker-compose.yml    # Docker services configuration
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string (async format required)
- `ENVIRONMENT`: development | staging | production
- `SECRET_KEY`: JWT secret key (change in production!)

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Development

### Code Quality

```bash
# Format code with Black
black .

# Sort imports with isort
isort .

# Type checking with mypy
mypy app/

# Linting with pylint
pylint app/
```

### API Endpoints

Current endpoints:
- `GET /` - Root endpoint (health check)
- `GET /health` - Health status check

More endpoints will be added as the project progresses.

## License

MIT
