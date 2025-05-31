from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from db import reports_collection  # Ensure this is defined in db.py
from addEvidence import router as note_router

router = APIRouter()
router.include_router(note_router)

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

# Endpoints

@router.get("/")
async def list_reports(
    assigned_to: Optional[str] = None,
    status: Optional[str] = None,
    country: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    query = {}
    if assigned_to:
        query["assigned_to"] = assigned_to  # Filter by assigned_to
    if status:
        query["status"] = status
    if country:
        query["incident_details.location.country"] = country
    if start_date or end_date:
        query["incident_details.date"] = {}
        if start_date:
            query["incident_details.date"]["$gte"] = datetime.fromisoformat(start_date)
        if end_date:
            query["incident_details.date"]["$lte"] = datetime.fromisoformat(end_date)

    reports = list(reports_collection.find(query))
    for r in reports:
        r["_id"] = str(r["_id"])  # Convert ObjectId to string for JSON serialization
    return JSONResponse(content=jsonable_encoder(reports))

@router.get("/analytics")
async def get_violation_analytics():
    pipeline = [
        {"$unwind": "$incident_details.violation_types"},
        {"$group": {"_id": "$incident_details.violation_types", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    results = list(reports_collection.aggregate(pipeline))
    return {item["_id"]: item["count"] for item in results}

from bson import ObjectId

def validate_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

@router.post("/{report_id}/note")
async def add_note(report_id: str, note: dict):
    _id = validate_object_id(report_id)
    note["timestamp"] = datetime.utcnow()
    result = reports_collection.update_one(
        {"_id": _id},
        {"$push": {"notes": note}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Note added successfully"}