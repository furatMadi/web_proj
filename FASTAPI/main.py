from fastapi import FastAPI
app = FastAPI()
from pymongo.mongo_client import MongoClient
uri = "mongodb+srv://odehleen321:odehleen@webproject.7fpcnyw.mongodb.net/?retryWrites=true&w=majority&appName=Webproject"
# Create a new client and connect to the server
client = MongoClient(uri)
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)