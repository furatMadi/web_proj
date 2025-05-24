from pymongo import MongoClient
client = MongoClient("mongodb+srv://odehleen321:leen4321@cluster0.f5xruvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["human_rights_db"]