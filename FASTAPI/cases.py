from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from db import cases_collection

router = APIRouter()

# #database connection
# #atlas connection
# client = MongoClient("mongodb+srv://1211543:furat1234@cluster0.f5xruvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# #access "human_rights_db" database
# db = client["human_rights_db"]
# #access "cases" collection
# cases_collection = db["cases"]

#models
class LocationModel(BaseModel):
    country: str
    region: str
    coordinates: dict

class EvidenceModel(BaseModel):
    type: str
    url: str
    description: str
    date_captured: datetime

class PerpetratorModel(BaseModel):
    name: str
    type: str

class CaseModel(BaseModel):
    case_id: str
    title: str
    description: str
    violation_types: List[str]
    status: str
    priority: str
    location: LocationModel
    date_occurred: datetime
    date_reported: datetime
    victims: List[str]
    perpetrators: List[PerpetratorModel]
    evidence: List[EvidenceModel]
    created_by: str
    created_at: datetime
    updated_at: datetime

#helper
def to_objectid_list(ids: List[str]):
    try:
        return [ObjectId(_id) for _id in ids]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid victim ID format")

#endpoints
@router.get("/")
async def root():
    return {"message": "Welcome to the Palestinian Prisoner Case Management API"}



@router.post("/cases/")
async def create_case(case: CaseModel):
    case_dict = case.dict()
    case_dict["victims"] = to_objectid_list(case_dict["victims"])
    case_dict["created_by"] = ObjectId(case_dict["created_by"])
    result = cases_collection.insert_one(case_dict)
    return {"id": str(result.inserted_id)}

@router.get("/cases/")
async def list_cases(status: Optional[str] = None):
    query = {"status": status} if status else {}
    cases = list(cases_collection.find(query))
    for case in cases:
        case["_id"] = str(case["_id"])
        case["created_by"] = str(case["created_by"])
        case["victims"] = [str(v) for v in case["victims"]]
    return JSONResponse(content=jsonable_encoder(cases))

@router.get("/cases/{case_id}")
async def get_case(case_id: str):
    case = cases_collection.find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    case["_id"] = str(case["_id"])
    case["created_by"] = str(case["created_by"])
    case["victims"] = [str(v) for v in case["victims"]]
    return JSONResponse(content=jsonable_encoder(case))

@router.patch("/cases/{case_id}")
async def update_case_status(case_id: str, status: str):
    result = cases_collection.update_one(
        {"case_id": case_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="No updates made")
    return {"message": "Case status updated"}

@router.delete("/cases/{case_id}")
async def delete_case(case_id: str):
    result = cases_collection.delete_one({"case_id": case_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    return {"message": "Case deleted"}
