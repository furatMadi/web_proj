from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection, reports_collection  # Modified: added reports_collection
from data_analysis import router as analytics_router
from cases import router as cases_router
from organization_routes import router as org_router
from incident_reporting import router as incident_reporting_router
from addEvidence import router as evidence_router  # Import the note_management router

app = FastAPI()

# Include routers
app.include_router(analytics_router)
app.include_router(cases_router)
app.include_router(org_router)
app.include_router(incident_reporting_router, prefix="/reports")
app.include_router(evidence_router, prefix="/reports")  # Evidence endpoint provided here

# CORS for frontend setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Login endpoint
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

# New endpoint for adding a report
@app.post("/report/")
async def add_report(request: Request):
    data = await request.json()
    result = reports_collection.insert_one(data)  # Insert the report into the database
    return {"message": "Report added successfully", "report_id": str(result.inserted_id)}
