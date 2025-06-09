from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import List
from .database import reports_collection

router = APIRouter()

class Report(BaseModel):
    title: str
    content: str
    # add other fields as necessary

def validate_object_id(report_id: str) -> ObjectId:
    try:
        return ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    _id = validate_object_id(report_id)
    result = reports_collection.delete_one({"_id": _id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted successfully"}