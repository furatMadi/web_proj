from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db import reports_collection
from datetime import datetime
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/riview_reports", tags=["Riview Reports"])
router = APIRouter()

class IncidentReportReviewModel(BaseModel):
    status: str  # "accepted" | "rejected"
    reviewed_by: str
    linked_case_id: str | None = None

@router.get("/reports/pending")
def get_pending_reports():
    reports = list(reports_collection.find({"status": "pending"}))
    for r in reports:
        r["_id"] = str(r["_id"])
    return JSONResponse(content=jsonable_encoder(reports))

@router.patch("/reports/review/{report_id}")
def review_report(report_id: str, review: IncidentReportReviewModel):
    update_fields = {
        "status": review.status,
        "reviewed_by": review.reviewed_by,
        "reviewed_at": datetime.utcnow()
    }

    if review.status == "accepted" and review.linked_case_id:
        update_fields["linked_case_id"] = review.linked_case_id

    result = reports_collection.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": f"Report {review.status} successfully"}
