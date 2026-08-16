from lambda_function import lambda_handler


event = {
    "requestContext": {
        "http": {
            "method": "GET"
        }
    },
    "rawPath": "/files"
}


response = lambda_handler(event, None)

print("Response:")
print(response)