from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime
from db import cases_collection

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