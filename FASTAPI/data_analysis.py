from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime
from db import cases_collection , users_collection
import pandas as pd
import io
from fastapi.responses import StreamingResponse

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
        {"$group": {"_id": "$location.region", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = list(cases_collection.aggregate(pipeline))
    return [{"region": doc["_id"], "count": doc["count"]} for doc in result]

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

    raw_data = list(cases_collection.find(query, {"_id": 0}))

    # Process data to flatten structure
    processed_data = []
    for case in raw_data:
        processed_case = {}

        # Replace created_by with user name
        created_by_id = case.get("created_by")
        creator_name = ""
        if created_by_id:
            try:
                user = users_collection.find_one({"_id": ObjectId(created_by_id)})
                if user:
                    creator_name = user.get("username", "")
            except:
                pass
        processed_case["Created By"] = creator_name

        # Flatten and clean other fields
        for key, value in case.items():
            if key == "created_by":
                continue
            elif isinstance(value, dict):
                for subkey, subval in value.items():
                    cleaned_value = (
                        ", ".join(map(str, subval)) if isinstance(subval, list)
                        else str(subval)
                    )
                    processed_case[f"{key}.{subkey}"] = cleaned_value
            elif isinstance(value, list):
                processed_case[key] = ", ".join(map(str, value))
            else:
                processed_case[key] = value

        processed_data.append(processed_case)

    df = pd.DataFrame(processed_data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name="Report")

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=report.xlsx"}
    )