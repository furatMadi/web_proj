from fastapi import APIRouter
from db import cases_collection
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from db import cases_collection

# routes/case_routes.py
from fastapi import APIRouter, HTTPException

from db import cases_collection, case_status_history_collection

router = APIRouter()

@router.get("/allcases")
async def list_cases():
    def clean_case(case):
        case["_id"] = str(case["_id"])
        case["created_by"] = str(case["created_by"])
        case["victims"] = [str(v) for v in case.get("victims", [])]
        
        # Convert dates to readable format
        for date_field in ["date_occurred", "date_reported", "created_at", "updated_at"]:
            if date_field in case and isinstance(case[date_field], dict) and "$date" in case[date_field]:
                case[date_field] = datetime.fromtimestamp(int(case[date_field]["$date"]["$numberLong"]) / 1000).isoformat()
        
        # Convert evidence dates if exist
        for ev in case.get("evidence", []):
            if "date_captured" in ev and isinstance(ev["date_captured"], dict):
                ev["date_captured"] = datetime.fromtimestamp(int(ev["date_captured"]["$date"]["$numberLong"]) / 1000).isoformat()
        
        return case

    cases = list(cases_collection.find({}))
    cleaned_cases = [clean_case(case) for case in cases]
    return JSONResponse(content=jsonable_encoder(cleaned_cases))




@router.delete("/AdminCases/{case_id}")
async def archive_case(case_id: str):
    # جلب القضية الأصلية
    case = cases_collection.find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # تحديث الحالة
    update_result = cases_collection.update_one(
        {"case_id": case_id},
        {"$set": {"status": "archived", "updated_at": datetime.utcnow()}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to archive the case")

    # إعادة تحميل الوثيقة المُحدثة
    updated_case = cases_collection.find_one({"case_id": case_id})

    # نسخها إلى السجل التاريخي
    updated_case["case_ref_id"] = updated_case["_id"]
    del updated_case["_id"]
    case_status_history_collection.insert_one(updated_case)

    return {"message": f"Case '{case_id}' archived successfully"}





@router.get("/AdminCases/search")
async def search_cases(
    case_id: Optional[str] = None,
    title: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    region: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    query = {}

    if case_id:
        query["case_id"] = case_id
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    if region:
        query["location.region"] = {"$regex": region, "$options": "i"}
    if from_date or to_date:
        query["date_occurred"] = {}
        if from_date:
            query["date_occurred"]["$gte"] = datetime.fromisoformat(from_date)
        if to_date:
            query["date_occurred"]["$lte"] = datetime.fromisoformat(to_date)

    results = list(cases_collection.find(query))
    for r in results:
        r["_id"] = str(r["_id"])
        r["created_by"] = str(r["created_by"])
        r["victims"] = [str(v) for v in r.get("victims", [])]

    return JSONResponse(content=jsonable_encoder(results))
