from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from db import reports_collection  # Ensure this is defined in db.py
import os
from uuid import uuid4

router = APIRouter()

# Models
class LocationModel(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str]

class IncidentDetailsModel(BaseModel):
    date: datetime
    location: LocationModel
    description: str
    violation_types: List[str]

class IncidentReportModel(BaseModel):
    reporter_type: str
    anonymous: bool
    contact_info: Optional[dict]
    incident_details: IncidentDetailsModel
    evidence: Optional[List[str]] = []
    status: str = "new"
    assigned_to: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Utility function to validate ObjectId
def validate_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

# Endpoint to submit a human rights violation report
@router.post("/submit")
async def submit_report(
    reporter_type: str = Form(...),
    anonymous: bool = Form(...),
    contact_info: Optional[str] = Form(None),
    date: datetime = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: Optional[str] = Form(None),
    description: str = Form(...),
    violation_types: List[str] = Form(...),
    files: Optional[List[UploadFile]] = File(None)
):
    # Handle geolocation tagging
    location = {
        "latitude": latitude,
        "longitude": longitude,
        "address": address
    }

    # Handle media uploads
    evidence_paths = []
    if files:
        upload_dir = "uploads/evidence"
        os.makedirs(upload_dir, exist_ok=True)
        for file in files:
            file_extension = file.filename.split(".")[-1]
            unique_filename = f"{uuid4()}.{file_extension}"
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())
            evidence_paths.append(file_path)

    # Create the incident report
    incident_details = {
        "date": date,
        "location": location,
        "description": description,
        "violation_types": violation_types
    }

    report = {
        "reporter_type": reporter_type,
        "anonymous": anonymous,
        "contact_info": None if anonymous else contact_info,
        "incident_details": incident_details,
        "evidence": evidence_paths,
        "status": "new",
        "assigned_to": None,
        "created_at": datetime.utcnow()
    }

    # Insert the report into the database
    result = reports_collection.insert_one(report)
    return {"message": "Report submitted successfully", "report_id": str(result.inserted_id)}

# Endpoint to retrieve uploaded evidence
@router.get("/evidence/{filename}")
async def get_evidence(filename: str):
    file_path = os.path.join("uploads/evidence", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return JSONResponse(content={"file_path": file_path})
