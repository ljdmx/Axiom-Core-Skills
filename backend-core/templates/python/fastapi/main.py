// TEMPLATE_META:START
/*
@template-id: python-fastapi-app
@version: 1.0.0
@description: FastAPI Main Application with CORS and Middleware
@dependencies: fastapi, uvicorn
@customization-points: APP_TITLE, VERSION
@language: python
@framework: FastAPI
*/
// TEMPLATE_META:END

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth

app = FastAPI(
    title="{{APP_TITLE}}",
    version="{{VERSION}}",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
