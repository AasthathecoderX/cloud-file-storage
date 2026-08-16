# ☁️ Cloud File Storage

A serverless cloud-based file storage application built using **Amazon S3, AWS Lambda, and Amazon API Gateway**.

The application provides a simple web interface through which users can:

- 📤 Upload files
- 📋 View uploaded files
- 📥 Download files
- 🗑️ Delete files

The project demonstrates how cloud storage and serverless computing services can be integrated to build a simple cloud-native application.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Web Browser    │
                    │   HTML / CSS / JS   │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │   API Gateway       │
                    │   REST API          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AWS Lambda       │
                    │   Python + Boto3    │
                    └──────────┬──────────┘
                               │
                               │ Boto3
                               ▼
                    ┌─────────────────────┐
                    │     Amazon S3       │
                    │    File Storage     │
                    └─────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 Upload | Upload files directly to Amazon S3 |
| 📋 List | View files currently stored in S3 |
| 📥 Download | Generate a temporary download URL |
| 🗑️ Delete | Delete files from S3 |
| ☁️ Serverless Backend | Backend runs using AWS Lambda |
| 🔗 REST API | API endpoints are exposed through API Gateway |
| 🌐 Web Interface | Simple browser-based frontend |

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend

- Python
- AWS Lambda
- Boto3

### AWS Services

- Amazon S3
- AWS Lambda
- Amazon API Gateway
- AWS IAM

### Development Tools

- Visual Studio Code
- Python
- Git / GitHub
- AWS CLI

---

## 📁 Project Structure

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
├── docs/
│   └── SETUP_GUIDE.md
│
├── .gitignore
│
└── README.md
```

---

## 🔌 API Endpoints

The application exposes the following API endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/files` | List uploaded files |
| `POST` | `/upload` | Upload a file |
| `GET` | `/download` | Generate a download URL |
| `DELETE` | `/files` | Delete a file |

Example:

```text
GET /files
```

```text
POST /upload?filename=test.txt
```

```text
GET /download?filename=test.txt
```

```text
DELETE /files?filename=test.txt
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Cloud-File-Storage
```

### 2. Configure AWS

Create and configure:

1. Amazon S3 bucket
2. AWS Lambda function
3. IAM permissions
4. API Gateway HTTP API
5. Required API routes
6. CORS configuration

### 3. Configure the frontend

Open:

```text
frontend/script.js
```

Set:

```javascript
const API_URL =
    "YOUR_API_GATEWAY_INVOKE_URL";
```

For example:

```javascript
const API_URL =
    "https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod";
```

### 4. Open the application

Open:

```text
frontend/index.html
```

in a browser.

You can now upload, view, download, and delete files.

---


## 📄 Documentation

For the complete implementation and AWS configuration instructions:

### 👉 [Read the Detailed Setup Guide](docs/SETUP_GUIDE.md)


---

## 🧪 Testing

The project can be tested at multiple levels.

### Local Backend Testing

The Lambda logic can be tested locally using Python and Boto3.

Example:

```bash
python lambda/test_lambda_GET_files.py
```

### API Testing

The API can be tested using PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "https://YOUR_API_URL/prod/files" `
  -Method GET
```

Upload:

```powershell
Invoke-RestMethod `
  -Uri "https://YOUR_API_URL/prod/upload?filename=test.txt" `
  -Method POST `
  -Body "Hello from Cloud File Storage."
```

Delete:

```powershell
Invoke-RestMethod `
  -Uri "https://YOUR_API_URL/prod/files?filename=test.txt" `
  -Method DELETE
```

---

## ☁️ AWS Services Demonstrated

This project demonstrates the following cloud computing concepts:

### Amazon S3

Used for:

- Object storage
- File management
- Uploading objects
- Listing objects
- Deleting objects
- Generating temporary download URLs

### AWS Lambda

Used as the serverless backend.

Lambda processes requests from API Gateway and interacts with S3 using Boto3.

### Amazon API Gateway

Provides HTTP endpoints for the application.

```text
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
S3
```

### AWS IAM

Controls the permissions required by Lambda to access the S3 bucket.

---

## 🔐 Security

The project is intended as a **Cloud Computing Lab mini-project** and uses a simple architecture for demonstration purposes.

For a production deployment, additional security mechanisms should be implemented, such as:

- Authentication and authorization
- Least-privilege IAM policies
- File size restrictions
- File type validation
- Rate limiting
- Private S3 configuration
- Input validation
- Secure logging
- HTTPS-only access

---

## 💰 AWS Cost

The project is designed to use AWS services that can generally be used within applicable **AWS Free Tier / free-plan allowances**, depending on the account, region, and current AWS pricing.

AWS usage should still be monitored.

After completing the project, unused resources should be removed to avoid unexpected charges.

---

## 🎓 Project Objective

The objective of this mini-project is to demonstrate the practical integration of cloud services to create a simple cloud-based application.

The project demonstrates:

```text
Cloud Storage
      +
Serverless Computing
      +
REST APIs
      +
Web Application
      =
Cloud File Storage
```

---

## 📚 Learning Outcomes

After completing this project, you should understand:

- How object storage works
- How files are stored in Amazon S3
- How AWS Lambda provides serverless computing
- How API Gateway exposes backend functionality
- How Lambda communicates with S3 using Boto3
- How REST APIs are consumed from JavaScript
- How CORS affects browser-based API requests
- How IAM permissions control AWS resources
- How cloud services can be combined to build applications

---

## 👩‍💻 Author

**Aastha Bhat**

Cloud Computing Lab Mini-Project

Dayananda Sagar College of Engineering


