import json
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb", region_name="us-east-2")
table = dynamodb.Table("hhh-newsletter")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}


def lambda_handler(event, context):
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body", "{}"))
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Invalid JSON"}),
        }

    email = body.get("email", "").strip().lower()
    name = body.get("name", "").strip()

    if not email or "@" not in email:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Valid email is required"}),
        }

    table.put_item(
        Item={
            "email": email,
            "name": name,
            "subscribed_at": datetime.now(timezone.utc).isoformat(),
        }
    )

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"message": "Subscribed successfully"}),
    }
