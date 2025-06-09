from fastapi import APIRouter
from db import reports_collection
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.get("/reports/new")
def get_new_reports():
    reports = list(reports_collection.find({"status": "new"}))
    for r in reports:
        r["_id"] = str(r["_id"])
    return JSONResponse(content=jsonable_encoder(reports))
