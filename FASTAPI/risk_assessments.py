from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from db import victim_risk_assessments_collection  # تأكد تعريفه في db.py

router = APIRouter(
    prefix="/risk-assessments",
    tags=["Risk Assessments"]
)

# --- Models ---
class RiskAssessmentModel(BaseModel):
    victim_id: str
    risk_level: str = Field(..., pattern="^(low|medium|high)$")
    threats: List[str]
    protection_needed: bool
    assessment_date: datetime
    assessed_by: str
    notes: Optional[str] = None

# --- Helper ---
def to_objectid(_id: str):
    try:
        return ObjectId(_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

# --- Endpoints ---

@router.post("/")
async def create_risk_assessment(assessment: RiskAssessmentModel):
    doc = assessment.dict()
    doc["victim_id"] = to_objectid(doc["victim_id"])
    result = victim_risk_assessments_collection.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Risk assessment added successfully"}

@router.get("/{victim_id}")
async def get_risk_assessments(victim_id: str):
    oid = to_objectid(victim_id)
    assessments = list(victim_risk_assessments_collection.find({"victim_id": oid}))
    for a in assessments:
        a["_id"] = str(a["_id"])
        a["victim_id"] = str(a["victim_id"])
    return JSONResponse(content=jsonable_encoder(assessments))

@router.patch("/{assessment_id}")
async def update_risk_assessment(assessment_id: str, update: RiskAssessmentModel):
    update_data = update.dict(exclude_unset=True)
    if "victim_id" in update_data:
        update_data["victim_id"] = to_objectid(update_data["victim_id"])
    result = victim_risk_assessments_collection.update_one(
        {"_id": to_objectid(assessment_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return {"message": "Risk assessment updated successfully"}

@router.delete("/{assessment_id}")
async def delete_risk_assessment(assessment_id: str):
    result = victim_risk_assessments_collection.delete_one({"_id": to_objectid(assessment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return {"message": "Risk assessment deleted successfully"}

@router.get("/victims/list")
async def list_victims_with_assessments():
    victim_ids = victim_risk_assessments_collection.distinct("victim_id")
    result = [{"_id": str(v_id)} for v_id in victim_ids]
    return JSONResponse(content=jsonable_encoder(result))
