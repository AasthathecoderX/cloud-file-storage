from lambda_function import lambda_handler


event = {
    "requestContext": {
        "http": {
            "method": "GET"
        }
    },
    "rawPath": "/download",
    "queryStringParameters": {
        "filename": "local-test.txt"
    }
}


response = lambda_handler(event, None)

print("Response:")
print(response)