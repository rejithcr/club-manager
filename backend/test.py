import main

payload = {
        "headers": {
            "auth-token": ""
        },
        "isBase64Encoded": False,
        "rawPath": "/club",
        "requestContext": {
            "http": {
                "path": "/",
                "protocol": "HTTP/1.1",
                "method": "GET",
                "sourceIp": "106.222.237.212",
                "userAgent": None
            },
            "time": "20/Apr/2025:08:51:49 +0000",
            "apiId": "yto2koj5fsbpyaw4ols236rutm0kdnln"
        },
        "queryStringParameters":{
            "clubId": "8"
        },
       # "body": "{\"clubName\": \"TCS Kochi\", \"memberId\": 1, \"email\": \"rejith.cr\"}",
      #  "body": "{\"firstName\": \"Rejith\", \"lastName\": \"CR\", \"phone\": \"8281478847\",\"email\": \"rejith.cr@gmail.com\"}",
        "version": "2.0",
        "rawQueryString": ""
    }


print(main.handler(payload, None))