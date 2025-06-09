from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from db import victims_collection
<<<<<<< HEAD
=======
from db import victim_risk_assessments_collection 
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from db import client, victims_collection
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

<<<<<<< HEAD
router = APIRouter(
    prefix="/victims",
    tags=["Victims"]
)
=======

router = APIRouter()

>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c



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

<<<<<<< HEAD
=======

class UpdateRiskLevel(BaseModel):
    level: str
    threats: Optional[List[str]] = []
    protection_needed: Optional[bool] = False
    assessed_by: Optional[str] = "admin_user"
    notes: Optional[str] = None


>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
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

<<<<<<< HEAD
class UpdateRiskLevel(BaseModel):
    level: str
=======

>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c


# --- POST: Add new victim ---
@router.post("/victims/")
def create_victim(victim: Victim):
    try:
        victim_dict = victim.dict()
        now = datetime.utcnow()
        victim_dict["created_at"] = now
        victim_dict["updated_at"] = now

<<<<<<< HEAD
        print("🟢 Inserting victim:", victim_dict)  # Debug
        result = victims_collection.insert_one(victim_dict)
        return {"id": str(result.inserted_id), "message": "Victim added successfully"}
=======
        # ✨ أدخل الضحية أولًا
        result = victims_collection.insert_one(victim_dict)
        victim_id = result.inserted_id

        # ✨ بعدها أضف تقييم الخطر الأولي إلى victim_risk_assessments
        risk_assessment = victim_dict.get("risk_assessment", {})
        assessment_doc = {
            "victim_id": victim_id,
            "risk_level": risk_assessment.get("level", "unknown"),
            "threats": risk_assessment.get("threats", []),
            "protection_needed": risk_assessment.get("protection_needed", False),
            "assessment_date": now,
            "assessed_by": "system",  # أو admin لاحقًا
            "notes": "Initial risk assessment (auto-added)",
        }

        victim_risk_assessments_collection.insert_one(assessment_doc)

        return {"id": str(victim_id), "message": "Victim and initial risk assessment added"}
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
    
    except Exception as e:
        print("❌ Error while inserting victim:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

<<<<<<< HEAD
=======

>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
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
<<<<<<< HEAD
=======
        now = datetime.utcnow()

        # ✨ أولاً، تعديل الضحية نفسها
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
        result = victims_collection.update_one(
            {"_id": ObjectId(victim_id)},
            {"$set": {
                "risk_assessment.level": update.level,
<<<<<<< HEAD
                "updated_at": datetime.utcnow()
            }}
        )
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid victim ID format")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Victim not found")

    return {"message": "Risk level updated"}
=======
                "updated_at": now
            }}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Victim not found")

        # ✨ ثانيًا، سجل التغيير في جدول risk_assessments
        assessment_doc = {
            "victim_id": ObjectId(victim_id),
            "risk_level": update.level,
            "threats": update.threats if update.threats else [],
            "protection_needed": update.protection_needed if hasattr(update, "protection_needed") else False,
            "assessment_date": now,
            "assessed_by": update.assessed_by if hasattr(update, "assessed_by") else "admin_user",
            "notes": update.notes or "Updated via patch",
        }

        victim_risk_assessments_collection.insert_one(assessment_doc)

        return {"message": "Risk level updated and logged"}

    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid victim ID format")

>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c

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
<<<<<<< HEAD
        return {"status": "❌ MongoDB connection failed", "error": str(e)}
=======
        return {"status": "❌ MongoDB connection failed", "error": str(e)} 
    
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from datetime import datetime
# from bson import ObjectId
# from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
# from db import victim_risk_assessments_collection  # تأكد تعريفه في db.py

# router = APIRouter(
    
# )

# # --- Models ---
# class RiskAssessmentModel(BaseModel):
#     victim_id: str
#     risk_level: str = Field(..., pattern="^(low|medium|high)$")
#     threats: List[str]
#     protection_needed: bool
#     assessment_date: datetime
#     assessed_by: str
#     notes: Optional[str] = None

# # --- Helper ---
# def to_objectid(_id: str):
#     try:
#         return ObjectId(_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ObjectId format")

# # --- Endpoints ---

# @router.post("/")
# async def create_risk_assessment(assessment: RiskAssessmentModel):
#     doc = assessment.dict()
#     doc["victim_id"] = to_objectid(doc["victim_id"])
#     result = victim_risk_assessments_collection.insert_one(doc)
#     return {"id": str(result.inserted_id), "message": "Risk assessment added successfully"}

# @router.get("/{victim_id}")
# async def get_risk_assessments(victim_id: str):
#     oid = to_objectid(victim_id)
#     assessments = list(victim_risk_assessments_collection.find({"victim_id": oid}))
#     for a in assessments:
#         a["_id"] = str(a["_id"])
#         a["victim_id"] = str(a["victim_id"])
#     return JSONResponse(content=jsonable_encoder(assessments))

# @router.patch("/{assessment_id}")
# async def update_risk_assessment(assessment_id: str, update: RiskAssessmentModel):
#     update_data = update.dict(exclude_unset=True)
#     if "victim_id" in update_data:
#         update_data["victim_id"] = to_objectid(update_data["victim_id"])
#     result = victim_risk_assessments_collection.update_one(
#         {"_id": to_objectid(assessment_id)},
#         {"$set": update_data}
#     )
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Risk assessment not found")
#     return {"message": "Risk assessment updated successfully"}

# @router.delete("/{assessment_id}")
# async def delete_risk_assessment(assessment_id: str):
#     result = victim_risk_assessments_collection.delete_one({"_id": to_objectid(assessment_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Risk assessment not found")
#     return {"message": "Risk assessment deleted successfully"}> from pymongo import MongoClient



# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from datetime import datetime
# from pymongo import MongoClient
# from bson import ObjectId
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from db import victims_collection



# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from db import client, victims_collection
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from datetime import datetime
# from bson import ObjectId
# from bson.errors import InvalidId

# router = APIRouter(
#     prefix="/victims",
#     tags=["Victims"]
# )



# # --- Schemas ---
# class Demographics(BaseModel):
#     gender: str
#     age: int
#     ethnicity: Optional[str] = None
#     occupation: Optional[str] = None

# class ContactInfo(BaseModel):
#     email: Optional[str] = None
#     phone: Optional[str] = None
#     secure_messaging: Optional[str] = None

# class RiskAssessment(BaseModel):
#     level: str
#     threats: List[str]
#     protection_needed: bool

# class SupportService(BaseModel):
#     type: str
#     provider: Optional[str] = None
#     status: Optional[str] = None

# class Victim(BaseModel):
#     type: str
#     anonymous: bool = False
#     demographics: Demographics
#     contact_info: Optional[ContactInfo] = None
#     cases_involved: List[str] = Field(..., example=["case_id_123"]) # type: ignore
#     risk_assessment: RiskAssessment
#     support_services: Optional[List[SupportService]] = []

# class UpdateRiskLevel(BaseModel):
#     level: str


# # --- POST: Add new victim ---
# @router.post("/victims/")
# def create_victim(victim: Victim):
#     try:
#         victim_dict = victim.dict()
#         now = datetime.utcnow()
#         victim_dict["created_at"] = now
#         victim_dict["updated_at"] = now

#         print("🟢 Inserting victim:", victim_dict)  # Debug
#         result = victims_collection.insert_one(victim_dict)
#         return {"id": str(result.inserted_id), "message": "Victim added successfully"}
    
#     except Exception as e:
#         print("❌ Error while inserting victim:", e)
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# # --- GET: Get victim by ID ---
# @router.get("/victims/{victim_id}")
# def get_victim(victim_id: str):
#     try:
#         victim = victims_collection.find_one({"_id": ObjectId(victim_id)})
#     except InvalidId:
#         raise HTTPException(status_code=400, detail="Invalid victim ID format")

#     if not victim:
#         raise HTTPException(status_code=404, detail="Victim not found")

#     victim["_id"] = str(victim["_id"])
#     return JSONResponse(content=jsonable_encoder(victim))

# # --- PATCH: Update risk level ---
# @router.patch("/victims/{victim_id}")
# def update_risk_level(victim_id: str, update: UpdateRiskLevel):
#     try:
#         result = victims_collection.update_one(
#             {"_id": ObjectId(victim_id)},
#             {"$set": {
#                 "risk_assessment.level": update.level,
#                 "updated_at": datetime.utcnow()
#             }}
#         )
#     except InvalidId:
#         raise HTTPException(status_code=400, detail="Invalid victim ID format")

#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Victim not found")

#     return {"message": "Risk level updated"}

# # --- GET: Get victims by case ID ---
# @router.get("/victims/case/{case_id}")
# def get_victims_by_case(case_id: str):
#     victims = list(victims_collection.find({"cases_involved": case_id}))
#     for v in victims:
#         v["_id"] = str(v["_id"])
#     return JSONResponse(content=jsonable_encoder(victims))


# @router.get("/test-victim")
# def test_connection():
#     victim = victims_collection.find_one()
#     if victim:
#         victim["_id"] = str(victim["_id"])  # لتحويل ObjectId إلى نص
#         return {"status": "connected", "sample": victim}
#     else:
#         return {"status": "connected", "message": "No victims found in the collection"}



# @router.get("/ping-db")
# def ping_db():
#     try:
#         client.admin.command('ping')
#         return {"status": "✅ MongoDB connected successfully"}
#     except Exception as e:
#         return {"status": "❌ MongoDB connection failed", "error": str(e)}
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
