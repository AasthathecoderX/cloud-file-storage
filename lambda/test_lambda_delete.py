from lambda_function import lambda_handler


event = {
    "requestContext": {
        "http": {
            "method": "DELETE"
        }
    },
    "rawPath": "/files",
    "queryStringParameters": {
        "filename": "local-test.txt"
    }
}


response = lambda_handler(event, None)

print("Response:")
print(response)