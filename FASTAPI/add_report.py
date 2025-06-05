from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from db import reports_collection  
from uuid import uuid4  # Import for generating unique report IDs

router = APIRouter()

# Models
class IncidentDetailsModel(BaseModel):
    date: datetime
    location: dict
    description: str
    violation_types: List[str]

class IncidentReportModel(BaseModel):
    reporter_type: str
    anonymous: bool
    contact_info: Optional[dict]
    incident_details: IncidentDetailsModel
    evidence: Optional[List[dict]] = []
    status: str = "new"
    assigned_to: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Endpoint to add a new report
@router.post("/report/")
async def add_report(report: IncidentReportModel):  # Changed endpoint to /report
    try:
        report_id = f"IR-{datetime.utcnow().year}-{str(uuid4())[:8].upper()}"  # Generate unique report ID
        report_data = jsonable_encoder(report)
        report_data["report_id"] = report_id  # Add report_id to the data
        result = reports_collection.insert_one(report_data)  # Use the imported reports_collection
        return {"message": "Report added successfully", "report_id": report_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add report: {str(e)}")

# Endpoint to retrieve all reports
@router.get("/reports/")
async def get_reports():
    try:
        reports = list(reports_collection.find({}, {"_id": 0}))  # Exclude the MongoDB _id field
        return reports
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve reports: {str(e)}")
