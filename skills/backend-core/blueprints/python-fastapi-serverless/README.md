# Python FastAPI Serverless Blueprint

Serverless-optimized API demonstrating MVP/prototype ADBM patterns with Cloud Database.

---

## Architecture Overview

```
app/
├── main.py                    # FastAPI application
├── routers/
│    └── users.py               # Route handlers
├── services/
│    └── user_service.py        # Business logic
├── models/
│    └── user.py                # Pydantic models
├── database.py                # Database client
└── middleware/
    ├── error_handler.py       # Exception handling
    └── logging.py             # Request logging
```

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your Database credentials

# Start development server
uvicorn app.main:app --reload

# API available at: http://localhost:8000
# Swagger docs at: http://localhost:8000/docs
```

---

## Features

✅**FastAPI**: Modern, fast Python framework  
✅**Cloud Database**: Instant backend (Auth + Persistence)  
✅**Pydantic**: Type-safe data validation  
✅**Auto-Docs**: Interactive OpenAPI documentation  
✅**Serverless Ready**: AWS Lambda / Vercel compatible

---

## Deploy to AWS Lambda

```bash
# Using Mangum adapter
pip install mangum

# Package for Lambda
zip -r function.zip app/

# Upload to AWS Lambda with API Gateway
```

---

📖 **Full Implementation**: Refer to source files in this directory and [quickstart.md](../../references/quickstart.md) for complete FastAPI example
