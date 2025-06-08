from fastapi import APIRouter, HTTPException, Request
from db import reports_collection
from bson import ObjectId  # <-- Add this import

from fastapi import UploadFile, File
import os
import shutil

router = APIRouter()

@router.post("/{report_id}/evidence")
async def add_evidence(report_id: str, request: Request):
    data = await request.json()
    evidence = {
        "type": data.get("type"),
        "url": data.get("url"),
        "description": data.get("description"),
    }
    try:
        _id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")
    result = reports_collection.update_one(
        {"_id": _id},
        {"$push": {"evidence": evidence}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Evidence added successfully"}




UPLOAD_DIR = "static/evidence"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/{report_id}/evidence/upload")
async def upload_evidence_file(report_id: str, file: UploadFile = File(...), description: str = ""):
    filename = f"{report_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # حفظ الملف
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # بناء رابط الصورة
    url = f"/{UPLOAD_DIR}/{filename}"

    # بناء كائن الدليل
    evidence = {
        "type": "photo",
        "url": url,
        "description": description
    }

    try:
        _id = ObjectId(report_id)
        result = reports_collection.update_one(
            {"_id": _id},
            {"$push": {"evidence": evidence}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"message": "Evidence uploaded and linked successfully", "url": url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))