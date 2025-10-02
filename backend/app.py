import os
import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initializing supabase to allow us to interact with the database
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initializing s3 to allow us to interact with objects
s3 = boto3.client('s3')

app = Flask(__name__)
# Enable requests from any origin to any route
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

# Return list of all categories
def get_categories() -> list[str]:
    rows = supabase.table("categories").select("categoryName").order("categoryName").execute()
    data = rows.data
    names = [d['categoryName'] for d in data]
    return names

# Given a category, returns its description
def get_description(category: str):
    rows = supabase.table("categories").select("categoryDescription").eq("categoryName", category).execute()
    data = rows.data
    description = data[0]['categoryDescription']
    return description

# Given a category, returns a list of generated presigned urls
def get_images(category: str):
    rows = supabase.table("images").select("object_key", "caption").eq("category", category).execute()
    data = rows.data
    # List of dictionaries with image urls and corresponding caption
    urls = [{"url": create_presigned_url("smerfmc", d["object_key"]), "caption": d["caption"]} for d in data]
    return urls

# Initial load to the homepage needs all the categories for the dropdown menu
@app.get("/api/categories")
def list_categories():
    categories = get_categories()
    return jsonify(categories)

@app.get("/api/category-description")
def cat_description():
    category = request.args.get("category")
    if not category:
        return jsonify({"description" : ""})
    description = get_description(category)
    if description:
        return jsonify({"description" : description})
    else:
        return jsonify({"description" : ""})

@app.get("/api/category-images")
def cat_images():
    category = request.args.get("category")
    if not category:
        return jsonify([])
    urls = get_images(category)
    if urls:
        return jsonify(urls)
    else:
        return jsonify([])

