from fastapi import APIRouter
from db import victims_collection, cases_collection, reports_collection


router = APIRouter()

@router.get("/stats/victims-count")
def get_victims_count():
    count = victims_collection.count_documents({})
    return {"count": count}

@router.get("/stats/cases-count")
def get_cases_count():
    count = cases_collection.count_documents({})
    return {"count": count}

@router.get("/stats/reports-count")
def get_reports_count():
    count = reports_collection.count_documents({})
    return {"count": count}
