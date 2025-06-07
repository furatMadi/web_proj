from fastapi import APIRouter

router = APIRouter()

@router.get("/organizations")
async def get_organizations():
    return {"message": "List of organizations"}

@router.post("/organizations")
async def create_organization():
    return {"message": "Organization created"}
