from pymongo import MongoClient

# uri = "mongodb+srv://1211543:furat1234@cluster0.f5xruvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
uri = "mongodb+srv://1211371:JxVWtb86Jhk17eDS@cluster0.f5xruvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
db = client["human_rights_db"]

#collections
cases_collection = db["cases"]
victims_collection = db["victims"]
reports_collection = db["incident_reports"]
status_history_collection = db["case_status_history"]
users_collection = db["users"]
case_status_history_collection = db["case_status_history"]
victim_risk_assessments_collection=db["victim_risk_assessments"]

 