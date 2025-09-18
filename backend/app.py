import os
import boto3
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
s3 = boto3.client('s3')

app = Flask(__name__)
CORS(app)

# Generate url used to display image. Expires in an hour
def create_presigned_url(bucket_name, key, expiration=3600):
    try:
        response = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': key},
            ExpiresIn=expiration
        )
        return response
    except ClientError as e:
        print(e)

def get_categories():
    rows = supabase.table("categories").select("categoryName").order("categoryName").execute()
    data = rows.data
    names = [d['categoryName'] for d in data]
    print(names)
    return names

# Given a category, returns a description
def get_description(category: str):
    print(category)
    rows = supabase.table("categories").select("categoryDescription").eq("categoryName", category).execute()
    data = rows.data
    description = data[0]['categoryDescription']
    return description

# Given a category, returns a list of urls
def get_images(category: str):
    rows = supabase.table("images").select("object_key", "caption").eq("category", category).execute()
    data = rows.data
    urls = [{"url": create_presigned_url("smerfmc", d["object_key"]), "caption": d["caption"]} for d in data]
    return urls

@app.get("/api/categories")
def list_categories():
    categories = get_categories()
    return jsonify(categories)

@app.get("/api/category-description/<category>")
def cat_description(category):
    description = get_description(category)
    if description:
        return jsonify({"description" : description})
    else:
        return jsonify({"description" : ""})

@app.get("/api/category-images/<category>")
def cat_images(category):
    urls = get_images(category)
    if urls:
        return jsonify(urls)
    else:
        return jsonify([])

