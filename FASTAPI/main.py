from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection
from data_analysis import router as analytics_router
from cases import router as cases_router

app = FastAPI()
app.include_router(analytics_router)
app.include_router(cases_router)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

#CORS for frontend setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#login endpoint
@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username, "password": password})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = user.get("role")
    if role not in ["admin", "organization", "analyst"]:
        raise HTTPException(status_code=403, detail=f"Unknown role: {role}")

    return {
        "message": "Login successful",
        "role": role,
        "username": username
    }
