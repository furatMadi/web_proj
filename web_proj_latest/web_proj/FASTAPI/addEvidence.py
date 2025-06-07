from fastapi import APIRouter, HTTPException, Request
from db import reports_collection
from bson import ObjectId  # <-- Add this import

router = APIRouter()

@router.post("/{report_id}/evidence")
async def add_evidence(report_id: str, request: Request):
    data = await request.json()
    evidence = {
        "type": data.get("type"),
        "url": data.get("url"),
        "description": data.get("description"),
    }
    try:
        _id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")
    result = reports_collection.update_one(
        {"_id": _id},
        {"$push": {"evidence": evidence}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Evidence added successfully"}