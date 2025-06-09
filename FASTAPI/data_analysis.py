from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime
from db import cases_collection , users_collection
import pandas as pd
import io
from fastapi.responses import StreamingResponse
from bson import ObjectId
from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt
from reportlab.platypus import Image as RLImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet

from PIL import Image
import xlsxwriter
from pathlib import Path
from urllib.parse import urlparse

router = APIRouter()

@router.get("/analytics/violations")
def count_violations(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    region: Optional[str] = Query(None),
    violation_type: Optional[str] = Query(None)
):
    query = {}
    if start_date and end_date:
        query["date_occurred"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        query["date_occurred"] = {"$gte": start_date}
    elif end_date:
        query["date_occurred"] = {"$lte": end_date}

    if region:
        query["location.region"] = region
    if violation_type:
        query["violation_types"] = violation_type

    pipeline = [
        {"$match": query},
        {"$unwind": "$violation_types"},
        {"$group": {"_id": "$violation_types", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = list(cases_collection.aggregate(pipeline))
    return {doc["_id"]: doc["count"] for doc in result}

@router.get("/analytics/geodata")
def cases_by_region(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    violation_type: Optional[str] = Query(None)
):
    query = {}
    if start_date and end_date:
        query["date_occurred"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        query["date_occurred"] = {"$gte": start_date}
    elif end_date:
        query["date_occurred"] = {"$lte": end_date}
    if violation_type:
        query["violation_types"] = violation_type

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": "$location.region",
                "count": {"$sum": 1},
                "coordinates": {"$first": "$location.coordinates"}
            }
        },
        {"$sort": {"count": -1}}
    ]
    result = list(cases_collection.aggregate(pipeline))
    return [
        {
            "region": doc["_id"],
            "count": doc["count"],
            "coordinates": doc.get("coordinates", {}).get("coordinates", [])
        } for doc in result if doc.get("coordinates")
    ]

@router.get("/analytics/timeline")
def timeline_data(
    region: Optional[str] = Query(None),
    violation_type: Optional[str] = Query(None)
):
    query = {}
    if region:
        query["location.region"] = region
    if violation_type:
        query["violation_types"] = violation_type

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$date_occurred"},
                    "month": {"$month": "$date_occurred"}
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    result = list(cases_collection.aggregate(pipeline))
    return [
        {"date": f"{doc['_id']['year']}-{doc['_id']['month']:02d}", "cases": doc["count"]}
        for doc in result
    ]

@router.get("/api/options/regions")
def get_region_options():
    return cases_collection.distinct("location.region")

@router.get("/api/options/violations")
def get_violation_type_options():
    return cases_collection.distinct("violation_types")

@router.get("/report/generate")
def generate_report(
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    region: Optional[str] = Query(None),
    violation_type: Optional[str] = Query(None)
):
    query = {}
    if start and end:
        query["date_occurred"] = {"$gte": start, "$lte": end}
    elif start:
        query["date_occurred"] = {"$gte": start}
    elif end:
        query["date_occurred"] = {"$lte": end}

    if region and region != "All":
        query["location.region"] = region

    if violation_type and violation_type != "All":
        query["violation_types"] = violation_type

    raw_data = list(cases_collection.find(query))

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet("Report")

    headers = [
        "Title", "Description", "Status", "Date Occurred",
        "Region", "Created By", "Evidence Image"
    ]
    for col_num, header in enumerate(headers):
        worksheet.write(0, col_num, header)

    row = 1
    for case in raw_data:
        created_by_id = case.get("created_by")
        creator_name = ""
        if created_by_id:
            try:
                user = users_collection.find_one({"_id": ObjectId(created_by_id)})
                if user:
                    creator_name = user.get("username", "")
            except:
                pass

        worksheet.write(row, 0, case.get("title"))
        worksheet.write(row, 1, case.get("description"))
        worksheet.write(row, 2, case.get("status"))
        worksheet.write(row, 3, str(case.get("date_occurred")))
        worksheet.write(row, 4, case.get("location", {}).get("region", ""))
        worksheet.write(row, 5, creator_name)

        image_col = 6
        for ev in case.get("evidence", []):
            if ev.get("type") == "photo":
                filename = ev.get("url", "").split("/")[-1] 
                image_path = f"../Frontend/public/evidence/{filename}"
                try:
                    with open(image_path, "rb") as f:
                        img_data = f.read()
                        img = Image.open(io.BytesIO(img_data))
                        img.verify()  
                        image_io = io.BytesIO(img_data)
                        worksheet.set_row(row, 100)
                        worksheet.insert_image(row, image_col, filename, {
                            'image_data': image_io,
                            'x_scale': 0.3,
                            'y_scale': 0.3
                        })
                        worksheet.set_column(image_col, image_col, 20)
                        image_col += 1

                except Exception as e:
                            print(f"Error inserting local image from {image_path}: {e}")
                except Exception as e:
                    print(f"Error inserting image from {image_path}: {e}")
                

        row += 1

    workbook.close()
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=report.xlsx"}
    )