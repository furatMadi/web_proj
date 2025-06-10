from fastapi import APIRouter
from db import victims_collection  # أو أي كولكشن يحتوي بيانات الأسرى
from bson import ObjectId

router = APIRouter()

@router.get("/stats/prisoners")
async def get_prisoner_stats():
    admin_count = victims_collection.count_documents({"category": "administrative"})
    child_count = victims_collection.count_documents({"category": "child"})
    female_count = victims_collection.count_documents({"demographics.gender": "female"})
    total_count = victims_collection.count_documents({})

    return {
        "administrative": admin_count,
        "children": child_count,
        "females": female_count,
        "total": total_count,
    }

