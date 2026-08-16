import json
import boto3
import base64
import os


# --------------------------------------------------
# S3 Configuration
# --------------------------------------------------

BUCKET_NAME = os.environ.get("BUCKET_NAME")

s3 = boto3.client("s3")


# --------------------------------------------------
# Response helper
# --------------------------------------------------

def response(status_code, body):

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(body)
    }


# --------------------------------------------------
# Lambda Handler
# --------------------------------------------------

def lambda_handler(event, context):

    try:

        # Get HTTP method
        method = (
            event.get("requestContext", {})
            .get("http", {})
            .get("method", "GET")
        )

        path = event.get("rawPath", "/")

        # Remove API Gateway stage prefix if present
        if path.startswith("/prod/"):
            path = path[len("/prod"):]

        print("METHOD RECEIVED:", method)
        print("PATH RECEIVED:", path)

        # ==================================================
        # UPLOAD FILE
        # POST /upload
        # ==================================================

        if method == "POST" and path == "/upload":

            body = event.get("body", "")

            # Decode Base64 body if necessary
            if event.get("isBase64Encoded", False):

                file_data = base64.b64decode(body)

            else:

                file_data = body.encode("utf-8")


            # Get filename
            query_parameters = (
                event.get("queryStringParameters") or {}
            )

            file_name = query_parameters.get(
                "filename",
                "uploaded-file.txt"
            )


            # Upload to S3
            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=file_name,
                Body=file_data
            )


            return response(
                200,
                {
                    "success": True,
                    "message": "File uploaded successfully",
                    "filename": file_name
                }
            )


        # ==================================================
        # LIST FILES
        # GET /files
        # ==================================================

        if method == "GET" and path == "/files":

            result = s3.list_objects_v2(
                Bucket=BUCKET_NAME
            )

            files = []

            for obj in result.get("Contents", []):

                files.append({
                    "name": obj["Key"],
                    "size": obj["Size"],
                    "lastModified": obj[
                        "LastModified"
                    ].isoformat()
                })


            return response(
                200,
                {
                    "success": True,
                    "files": files
                }
            )


        # ==================================================
        # DOWNLOAD FILE
        # GET /download
        # ==================================================

        if method == "GET" and path == "/download":

            query_parameters = (
                event.get("queryStringParameters") or {}
            )

            file_name = query_parameters.get(
                "filename"
            )

            if not file_name:

                return response(
                    400,
                    {
                        "success": False,
                        "message": "Filename is required"
                    }
                )


            # Generate temporary download URL
            download_url = s3.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": BUCKET_NAME,
                    "Key": file_name
                },
                ExpiresIn=300
            )


            return response(
                200,
                {
                    "success": True,
                    "downloadUrl": download_url
                }
            )


        # ==================================================
        # DELETE FILE
        # DELETE /files
        # ==================================================

        if method == "DELETE" and path == "/files":

            query_parameters = (
                event.get("queryStringParameters") or {}
            )

            file_name = query_parameters.get(
                "filename"
            )

            if not file_name:

                return response(
                    400,
                    {
                        "success": False,
                        "message": "Filename is required"
                    }
                )


            s3.delete_object(
                Bucket=BUCKET_NAME,
                Key=file_name
            )


            return response(
                200,
                {
                    "success": True,
                    "message": "File deleted successfully",
                    "filename": file_name
                }
            )


        # ==================================================
        # INVALID ROUTE
        # ==================================================

        return response(
            404,
            {
                "success": False,
                "message": "Route not found",
                "method_received": method,
                "path_received": path
            }
        )


    except Exception as error:

        print("ERROR:", str(error))

        return response(
            500,
            {
                "success": False,
                "error": str(error)
            }
        )