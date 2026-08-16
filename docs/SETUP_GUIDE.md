# Cloud File Storage

A simple serverless cloud file storage application built with **Amazon S3, AWS Lambda, API Gateway, and HTML/CSS/JavaScript**.

The project provides a mini cloud-storage experience where users can:

- Upload files
- View uploaded files
- Download files
- Delete files

The application is designed as a **Cloud Computing Lab mini-project** and focuses on demonstrating cloud storage, serverless computing, REST APIs, and cloud-based application integration.

---

## 1. Project Overview

This project implements a simplified version of a cloud drive.

Instead of storing files on the local computer, files are stored as objects in an **Amazon S3 bucket**.

The browser communicates with **Amazon API Gateway**, which invokes an **AWS Lambda** function. Lambda uses **Boto3** to perform operations on the S3 bucket.

### Architecture

```text
                    ┌─────────────────────────┐
                    │       Web Browser       │
                    │   HTML + CSS + JS       │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / HTTPS
                                 ▼
                    ┌─────────────────────────┐
                    │      API Gateway        │
                    │       HTTP API          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       AWS Lambda        │
                    │     Python + Boto3      │
                    └────────────┬────────────┘
                                 │
                                 │ AWS SDK
                                 ▼
                    ┌─────────────────────────┐
                    │       Amazon S3         │
                    │      Object Storage     │
                    └─────────────────────────┘
```

### Why this architecture?

The application does not require a traditional backend server.

- **S3** provides durable cloud object storage.
- **Lambda** provides serverless backend processing.
- **API Gateway** exposes the Lambda functionality through HTTP endpoints.
- **JavaScript** provides the user interface.
- No EC2 instance is required for the core project.

---

# 2. Features

## Upload

Users can select a file from their computer and upload it.

```text
Browser
   ↓
POST /upload
   ↓
API Gateway
   ↓
Lambda
   ↓
S3
```

The original filename is used as the S3 object key.

---

## View Uploaded Files

The application retrieves the objects stored in S3 and displays:

- Filename
- File size
- Download option
- Delete option

```text
GET /files
```

---

## Download

The backend generates a temporary S3 **presigned URL**.

```text
Browser
   ↓
GET /download?filename=example.pdf
   ↓
API Gateway
   ↓
Lambda
   ↓
S3 Presigned URL
   ↓
Browser downloads file
```

The presigned URL expires after a configured period.

---

## Delete

Users can delete a file from the interface.

```text
DELETE /files?filename=example.pdf
```

Lambda calls S3's `delete_object` operation.

---

# 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML5 |
| Styling | CSS3 |
| Client-side logic | JavaScript |
| Cloud Storage | Amazon S3 |
| Serverless Backend | AWS Lambda |
| Backend Language | Python |
| AWS SDK | Boto3 |
| API Layer | Amazon API Gateway |
| Authentication for local AWS access | AWS CLI |
| Development Environment | Visual Studio Code |
| Version Control | Git/GitHub (optional) |

---

# 4. AWS Services Used

## Amazon S3

Used to store uploaded files as objects.

The S3 bucket acts as the application's cloud storage layer.

---

## AWS Lambda

Lambda contains the backend logic for:

- Uploading files
- Listing files
- Generating download URLs
- Deleting files

The Lambda function uses **Boto3** to communicate with S3.

---

## Amazon API Gateway

API Gateway exposes Lambda through HTTP endpoints.

The application uses the following routes:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/files` | List uploaded files |
| POST | `/upload` | Upload a file |
| GET | `/download` | Generate download URL |
| DELETE | `/files` | Delete a file |

---

# 5. Project Structure

The project can be organized as follows:

```text
Cloud-File-Storage/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── lambda/
│   ├── lambda_function.py
│   └── test_lambda_GET_files.py
│
├── README.md
│
└── .gitignore
```

Additional local test files can be added under `lambda/` if required.

---

# 6. Prerequisites

Before setting up the project, install:

1. An AWS account
2. Visual Studio Code
3. Python 3.x
4. AWS CLI
5. A modern web browser

Optional:

- Git
- GitHub account
- Python virtual environment

---

# 7. AWS Region

Choose one AWS region and use it consistently.

For example:

```text
ap-southeast-2
```

The S3 bucket, Lambda function, and API Gateway should be created in compatible/appropriate regions for the project.

> If using another region, replace the example region in commands and URLs with your selected region.

---

# 8. Create the Project Folder

Open PowerShell or Command Prompt.

```powershell
mkdir Cloud-File-Storage
cd Cloud-File-Storage
```

Create the frontend and Lambda directories:

```powershell
mkdir frontend
mkdir lambda
```

Open the project in VS Code:

```powershell
code .
```

The structure should now be:

```text
Cloud-File-Storage/
├── frontend/
└── lambda/
```

---

# 9. Set Up Python Environment

From the project root:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\Activate.ps1
```

Verify Python:

```powershell
python --version
```

---

# 10. Install Boto3

Install the AWS SDK for Python:

```powershell
pip install boto3
```

Verify:

```powershell
python -c "import boto3; print(boto3.__version__)"
```

---

# 11. Configure AWS CLI

Install the official AWS CLI if it is not already installed.

Verify:

```powershell
aws --version
```

Authenticate the AWS CLI:

```powershell
aws login
```

Follow the browser-based authentication process.

Verify that the CLI can access the AWS account:

```powershell
aws sts get-caller-identity
```

A successful response contains information such as:

```json
{
    "UserId": "...",
    "Account": "...",
    "Arn": "..."
}
```

Set the default region:

```powershell
aws configure set region ap-southeast-2
```

Verify:

```powershell
aws configure get region
```

---

# 12. Create the S3 Bucket

Open the AWS Console.

Navigate to:

```text
AWS Console
→ S3
→ Create bucket
```

Choose a globally unique bucket name, for example:

```text
cloud-file-storage-yourname-2026
```

Important:

- Bucket names must be globally unique.
- Keep the bucket private.
- Do not make the bucket publicly accessible.

For this project, keep the default security settings unless your lab specifically requires a different configuration.

Create the bucket.

---

# 13. S3 Checkpoint

Open:

```text
S3
→ Your bucket
```

Confirm that the bucket exists.

### Checkpoint

You should see:

```text
Bucket created successfully
```

At this stage:

```text
Browser/CLI
    ↓
Amazon S3
```

is available.

---

# 14. Create a Test Object

Inside the S3 bucket, upload a small test file manually.

For example:

```text
test.txt
```

This helps verify that the bucket is working before connecting Lambda.

Alternatively, using the AWS CLI:

```powershell
echo "Cloud File Storage test" > test.txt
aws s3 cp test.txt s3://YOUR_BUCKET_NAME/test.txt
```

Replace:

```text
YOUR_BUCKET_NAME
```

with the actual bucket name.

Verify:

```powershell
aws s3 ls s3://YOUR_BUCKET_NAME/
```

Expected result:

```text
test.txt
```

---

# 15. Create the Lambda Function

Open:

```text
AWS Console
→ Lambda
→ Create function
```

Select:

```text
Author from scratch
```

Example:

```text
Function name:
cloud-file-storage-api
```

Runtime:

```text
Python 3.x
```

Choose the appropriate current Python runtime offered by AWS.

Create the function.

---

# 16. Give Lambda Permission to Access S3

Lambda needs permission to interact with the S3 bucket.

Open:

```text
Lambda
→ cloud-file-storage-api
→ Configuration
→ Permissions
```

Open the Lambda execution role.

Add permissions allowing the Lambda function to work with the project bucket.

For a lab project, the simplest approach is to attach an appropriate S3 policy to the execution role.

A more secure production implementation should restrict permissions to only the required bucket and actions.

Required operations include:

```text
s3:ListBucket
s3:GetObject
s3:PutObject
s3:DeleteObject
```

The exact IAM policy should restrict resources to the project bucket.

---

# 17. Configure Lambda Environment Variable

Open:

```text
Lambda
→ Configuration
→ Environment variables
```

Create:

```text
Key:
BUCKET_NAME

Value:
YOUR_BUCKET_NAME
```

Example:

```text
BUCKET_NAME = cloud-file-storage-yourname-2026
```

Save the configuration.

This allows the same Lambda code to work without hard-coding the bucket name.

---

# 18. Lambda Backend Code

Create:

```text
lambda/lambda_function.py
```

Use the following code:

```python
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

            if event.get("isBase64Encoded", False):
                file_data = base64.b64decode(body)
            else:
                file_data = body.encode("utf-8")

            query_parameters = (
                event.get("queryStringParameters") or {}
            )

            file_name = query_parameters.get(
                "filename",
                "uploaded-file.txt"
            )

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

            file_name = query_parameters.get("filename")

            if not file_name:

                return response(
                    400,
                    {
                        "success": False,
                        "message": "Filename is required"
                    }
                )

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

            file_name = query_parameters.get("filename")

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
```

---

# 19. Upload Lambda Code

Open the Lambda function in AWS Console.

Go to:

```text
Code
→ lambda_function.py
```

Replace the default Lambda code with the code above.

Click:

```text
Deploy
```

---

# 20. Test Lambda → S3

Before API Gateway, test Lambda directly.

Create a Lambda test event representing an API Gateway request.

Example GET `/files` event:

```json
{
  "version": "2.0",
  "routeKey": "GET /files",
  "rawPath": "/files",
  "requestContext": {
    "http": {
      "method": "GET"
    }
  },
  "isBase64Encoded": false
}
```

Run the test.

Expected response:

```json
{
  "success": true,
  "files": []
}
```

or a list containing existing objects.

### Checkpoint

If Lambda can list objects from S3:

```text
Lambda
   ↓
Boto3
   ↓
S3
```

is working.

---

# 21. Test Upload Through Lambda

Create a POST test event:

```json
{
  "version": "2.0",
  "routeKey": "POST /upload",
  "rawPath": "/upload",
  "requestContext": {
    "http": {
      "method": "POST"
    }
  },
  "queryStringParameters": {
    "filename": "lambda-test.txt"
  },
  "body": "This file was uploaded by Lambda.",
  "isBase64Encoded": false
}
```

Run the test.

Expected response:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "filename": "lambda-test.txt"
}
```

Open S3 and verify:

```text
lambda-test.txt
```

exists.

---

# 22. Create API Gateway

Open:

```text
AWS Console
→ API Gateway
→ Create API
```

Choose:

```text
HTTP API
```

Create the API.

Example name:

```text
CloudFileStorageAPI
```

---

# 23. Add Lambda Integration

Configure Lambda as the backend integration.

Select:

```text
Integration type:
Lambda
```

Select:

```text
cloud-file-storage-api
```

---

# 24. Create API Routes

Create these routes:

### Route 1

```text
GET /files
```

Integration:

```text
cloud-file-storage-api
```

### Route 2

```text
POST /upload
```

Integration:

```text
cloud-file-storage-api
```

### Route 3

```text
GET /download
```

Integration:

```text
cloud-file-storage-api
```

### Route 4

```text
DELETE /files
```

Integration:

```text
cloud-file-storage-api
```

---

# 25. Configure CORS

API Gateway must allow browser requests from the frontend.

Configure:

```text
Access-Control-Allow-Origin:
*
```

Allow headers:

```text
*
```

Allow methods:

```text
GET
POST
DELETE
OPTIONS
```

Deploy/update the API after changing CORS settings.

> For a production application, restrict the allowed origin to the actual frontend domain rather than using `*`.

---

# 26. Deploy API Gateway

Create a stage:

```text
prod
```

After deployment, API Gateway provides an Invoke URL similar to:

```text
https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com
```

With the `prod` stage, the application endpoints become:

```text
https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod/files
https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod/upload
https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod/download
```

The exact URL depends on the API Gateway API and AWS region.

---

# 27. Test API Gateway

Test the list endpoint first:

```text
GET /prod/files
```

Example:

```text
https://YOUR_API_ID.execute-api.ap-southeast-2.amazonaws.com/prod/files
```

A successful response resembles:

```json
{
  "success": true,
  "files": [
    {
      "name": "test.txt",
      "size": 154,
      "lastModified": "2026-08-15T13:52:02+00:00"
    }
  ]
}
```

---

# 28. Test Upload Through API Gateway

Using PowerShell:

```powershell
Invoke-RestMethod -Uri "https://YOUR_API_ID.execute-api.ap-southeast-2.amazonaws.com/prod/upload?filename=api-test.txt" -Method POST -Body "This file was uploaded through API Gateway."
```

Expected result:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "filename": "api-test.txt"
}
```

Verify the object in S3.

---

# 29. Test Delete Through API Gateway

Run:

```powershell
Invoke-RestMethod -Uri "https://YOUR_API_ID.execute-api.ap-southeast-2.amazonaws.com/prod/files?filename=api-test.txt" -Method DELETE
```

Expected result:

```json
{
  "success": true,
  "message": "File deleted successfully",
  "filename": "api-test.txt"
}
```

Verify that the object is removed from S3.

---

# 30. Frontend

Create:

```text
frontend/index.html
frontend/style.css
frontend/script.js
```

---



# 31. Configure the Frontend API URL

In:

```text
frontend/script.js
```

replace:

```javascript
const API_URL =
    "https://YOUR_API_ID.execute-api.ap-southeast-2.amazonaws.com/prod";
```

with the actual API Gateway URL.

For example:

```javascript
const API_URL =
    "https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod";
```

Do not add `/files` to `API_URL`.

Correct:

```text
...amazonaws.com/prod
```

The JavaScript adds:

```text
/files
/upload
/download
```

automatically.

---

# 32. Run the Frontend

The frontend can be opened locally.

Recommended approach:

Open the project in VS Code and use the **Live Server** extension.

Open:

```text
frontend/index.html
```

and select:

```text
Open with Live Server
```

The browser will open an address similar to:

```text
http://127.0.0.1:5500/frontend/
```

---

# 33. Complete End-to-End Test

Perform the following sequence.

## Test 1 — List

Open the application.

Expected:

```text
My Files

test.txt
lambda-test.txt
```

---

## Test 2 — Upload

Select:

```text
sample.txt
```

Click:

```text
Upload File
```

Expected:

```text
File uploaded successfully.
```

The file should appear in the list.

Verify it also exists in S3.

---

## Test 3 — Download

Click:

```text
Download
```

The backend generates a temporary presigned URL.

The file should open/download successfully.

---

## Test 4 — Delete

Click:

```text
Delete
```

Confirm deletion.

The file should disappear from the UI.

Refresh the page.

The file should remain absent.

Verify the object has also been removed from S3.

---

# 34. Final Checkpoint

The project is working when this complete chain works:

```text
                  UPLOAD
Browser ──────────────────────┐
                              ▼
                         API Gateway
                              │
                              ▼
                           Lambda
                              │
                              ▼
                              S3
                              │
                              ▼
                         File stored


                  LIST
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
S3
   ↓
File metadata
   ↓
Browser


                DOWNLOAD
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
Presigned S3 URL
   ↓
Browser


                  DELETE
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
S3
   ↓
Object deleted
```

---

# 35. Local Lambda Testing

The Lambda logic can also be tested locally with Boto3.

Set the bucket name in PowerShell:

```powershell
$env:BUCKET_NAME="YOUR_BUCKET_NAME"
```

Verify:

```powershell
echo $env:BUCKET_NAME
```

Expected:

```text
YOUR_BUCKET_NAME
```

Verify AWS authentication:

```powershell
aws sts get-caller-identity
```

Then test S3 access:

```powershell
python -c "import boto3, os; s3=boto3.client('s3'); print(s3.list_objects_v2(Bucket=os.environ['BUCKET_NAME']).get('Contents', []))"
```

If objects are returned, local Boto3 access to the bucket is working.

---

# 36. Security Considerations

This project is intended for educational use.

For a production implementation, additional security should be added.

Recommended improvements include:

- Use least-privilege IAM policies.
- Keep the S3 bucket private.
- Restrict CORS to the actual frontend domain.
- Add user authentication.
- Validate filenames.
- Restrict file sizes.
- Validate file types.
- Add rate limiting.
- Add logging and monitoring.
- Avoid exposing sensitive error messages.
- Use HTTPS for deployed frontends.
- Consider antivirus/malware scanning for uploaded files.

The current implementation deliberately keeps the architecture simple enough for a Cloud Computing Lab mini-project.

---

# 37. Cost Considerations

The project uses AWS services that are commonly suitable for small educational workloads, but **AWS pricing and free-tier eligibility can change**.

Before running the project extensively, check the current AWS pricing/free-tier terms for:

- Amazon S3
- AWS Lambda
- Amazon API Gateway

Avoid unnecessary resources and delete test data when finished.

EC2 is not required for this project's core architecture.

---

# 38. Troubleshooting

## Problem: `Route not found`

Check that:

1. The API Gateway route exists.
2. The HTTP method is correct.
3. The API is deployed.
4. The correct stage is being used.
5. The API URL is correct.

For example:

```text
GET /files
```

must not accidentally be called as:

```text
POST /files
```

---

## Problem: `Access-Control-Allow-Origin missing`

Check API Gateway CORS configuration.

Allow:

```text
GET
POST
DELETE
OPTIONS
```

and:

```text
Access-Control-Allow-Origin: *
```

Redeploy the API after changing CORS settings.

---

## Problem: Lambda returns S3 permission error

Check the Lambda execution role.

The role needs permissions for the required S3 operations:

```text
s3:ListBucket
s3:GetObject
s3:PutObject
s3:DeleteObject
```

---

## Problem: `BUCKET_NAME` is missing locally

PowerShell:

```powershell
$env:BUCKET_NAME="YOUR_BUCKET_NAME"
```

Check:

```powershell
echo $env:BUCKET_NAME
```

Environment variables set this way apply to the current PowerShell session.

---

## Problem: AWS CLI says credentials are missing

Run:

```powershell
aws login
```

Then:

```powershell
aws sts get-caller-identity
```

---

## Problem: Frontend cannot connect to API

Check:

```javascript
const API_URL =
    "https://YOUR_API_ID.execute-api.ap-southeast-2.amazonaws.com/prod";
```

Make sure:

- The API ID is correct.
- The region is correct.
- The stage is correct.
- CORS is configured.
- The API has been deployed.

---



# 39. Project Learning Outcomes

After completing this project, the following cloud concepts are demonstrated:

### Cloud Storage

Understanding Amazon S3:

- Buckets
- Objects
- Object keys
- Object metadata
- Object operations

### Serverless Computing

Understanding AWS Lambda:

- Lambda functions
- Execution roles
- Environment variables
- Event-driven execution
- Boto3 integration

### Cloud APIs

Understanding API Gateway:

- HTTP APIs
- Routes
- HTTP methods
- Lambda integrations
- Stages
- CORS

### Cloud Application Architecture

Understanding how multiple cloud services can be combined:

```text
Client
  ↓
API Gateway
  ↓
Lambda
  ↓
S3
```



