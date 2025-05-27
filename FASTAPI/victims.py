from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from db import victims_collection



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from db import client, victims_collection
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId




router = APIRouter(
    prefix="/victims",
    tags=["Victims"]
)



# --- Schemas ---
class Demographics(BaseModel):
    gender: str
    age: int
    ethnicity: Optional[str] = None
    occupation: Optional[str] = None

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    secure_messaging: Optional[str] = None

class RiskAssessment(BaseModel):
    level: str
    threats: List[str]
    protection_needed: bool

class SupportService(BaseModel):
    type: str
    provider: Optional[str] = None
    status: Optional[str] = None

class Victim(BaseModel):
    type: str
    anonymous: bool = False
    demographics: Demographics
    contact_info: Optional[ContactInfo] = None
    cases_involved: List[str] = Field(..., example=["case_id_123"]) # type: ignore
    risk_assessment: RiskAssessment
    support_services: Optional[List[SupportService]] = []

class UpdateRiskLevel(BaseModel):
    level: str


# --- POST: Add new victim ---
@router.post("/victims/")
def create_victim(victim: Victim):
    try:
        victim_dict = victim.dict()
        now = datetime.utcnow()
        victim_dict["created_at"] = now
        victim_dict["updated_at"] = now

        print("🟢 Inserting victim:", victim_dict)  # Debug
        result = victims_collection.insert_one(victim_dict)
        return {"id": str(result.inserted_id), "message": "Victim added successfully"}
    
    except Exception as e:
        print("❌ Error while inserting victim:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

# --- GET: Get victim by ID ---
@router.get("/victims/{victim_id}")
def get_victim(victim_id: str):
    try:
        victim = victims_collection.find_one({"_id": ObjectId(victim_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid victim ID format")

    if not victim:
        raise HTTPException(status_code=404, detail="Victim not found")

    victim["_id"] = str(victim["_id"])
    return JSONResponse(content=jsonable_encoder(victim))

# --- PATCH: Update risk level ---
@router.patch("/victims/{victim_id}")
def update_risk_level(victim_id: str, update: UpdateRiskLevel):
    try:
        result = victims_collection.update_one(
            {"_id": ObjectId(victim_id)},
            {"$set": {
                "risk_assessment.level": update.level,
                "updated_at": datetime.utcnow()
            }}
        )
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid victim ID format")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Victim not found")

    return {"message": "Risk level updated"}

# --- GET: Get victims by case ID ---
@router.get("/victims/case/{case_id}")
def get_victims_by_case(case_id: str):
    victims = list(victims_collection.find({"cases_involved": case_id}))
    for v in victims:
        v["_id"] = str(v["_id"])
    return JSONResponse(content=jsonable_encoder(victims))


@router.get("/test-victim")
def test_connection():
    victim = victims_collection.find_one()
    if victim:
        victim["_id"] = str(victim["_id"])  # لتحويل ObjectId إلى نص
        return {"status": "connected", "sample": victim}
    else:
        return {"status": "connected", "message": "No victims found in the collection"}



@router.get("/ping-db")
def ping_db():
    try:
        client.admin.command('ping')
        return {"status": "✅ MongoDB connected successfully"}
    except Exception as e:
        return {"status": "❌ MongoDB connection failed", "error": str(e)}
