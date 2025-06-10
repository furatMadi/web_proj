from fastapi import APIRouter, HTTPException
from db import cases_collection
from bson import ObjectId

router = APIRouter()

@router.get("/cases/")
def get_all_cases():
    cases = list(cases_collection.find({}, {"_id": 0}))
    return cases

@router.put("/AdminCases/{case_id}")
def update_case_status(case_id: str, status: str):
    if status not in ["under investigation", "solved"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    result = cases_collection.update_one(
        {"case_id": case_id},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")

    return {"message": f"Case status updated to '{status}'"}
