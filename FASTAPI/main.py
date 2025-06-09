from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection, reports_collection  # Modified: added reports_collection
from data_analysis import router as analytics_router
from cases import router as cases_router
from organization_routes import router as org_router
from incident_reporting import router as incident_reporting_router
from addEvidence import router as evidence_router  # Import the note_management router
import os
from uuid import uuid4
from fastapi.staticfiles import StaticFiles
# from victims import router as victims_router
from victims import router as victims_router
from risk_assessments import router as risk_assessments_router
# from database_query import router as database_query_router

from database_query import router as database_query_router
from get_new_reports import router as new_reports_router
from allcases import router as allcases_router


app = FastAPI()

# Include routers
app.include_router(analytics_router)
app.include_router(cases_router)
app.include_router(org_router)
app.include_router(incident_reporting_router, prefix="/reports")
app.include_router(evidence_router, prefix="/reports")  # Evidence endpoint provided here
app.include_router(new_reports_router)  
app.include_router(victims_router)
app.include_router(risk_assessments_router)
app.include_router(allcases_router)

app.include_router(database_query_router)


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
        # Ensure the response is returned immediately on failure
        return {"detail": "Invalid credentials"}, 401

    role = user.get("role")
    if role not in ["admin", "organization", "analyst"]:
        return {"detail": f"Unknown role: {role}"}, 403

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

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files so uploaded files are accessible via /static/uploads/...
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    # Return a full URL for the frontend to use
    url = f"http://localhost:8000/static/uploads/{filename}"
    return {"url": url}