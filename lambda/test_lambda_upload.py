from lambda_function import lambda_handler


event = {
    "requestContext": {
        "http": {
            "method": "POST"
        }
    },
    "rawPath": "/upload",
    "queryStringParameters": {
        "filename": "local-test.txt"
    },
    "body": "This file was uploaded from the local Lambda test.",
    "isBase64Encoded": False
}


response = lambda_handler(event, None)

print("Response:")
print(response)