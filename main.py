from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config.database import db  # Ensure db is a valid database connection object

# Example for MongoDB using pymongo:
# from pymongo import MongoClient
# client = MongoClient("mongodb://localhost:27017/")
# db = client["your_database_name"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. For production, specify your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

class LoginRequest(BaseModel):
    users_collection = db["users"]  # Ensure "users" collection exists in your database
    password: str

@app.post("/api/login")
def login(request: LoginRequest):
    users_collection = db["users"]
    user = users_collection.find_one({
        "username": request.username,
        "password": request.password
    })
    if user:
        return {"message": "Login successful", "role": user.get("role")}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")
