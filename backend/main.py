import json

import db
import factory


def handler(event, context):
    print(event)
    if event["headers"].get("auth-token") != "ys85U2fj0ASeoACsHDBqBO2CfxusSYIIizuX23atl346QGDYQ7LzLwgaBMVxWCKl":
        return { "code": 400, "status": "ERROR", "message": "Unauthorized. Please pass valid token" }

    params = factory.get_params(event)
    service = factory.get_service(event)

    try: 
        conn = db.connect()
        result = factory.execute(conn, service, params)
    except Exception as e:
        return {
            "isBase64Encoded": False,
            "statusCode": 500,
            "body": {"error" : str(e)},
            "headers": {
                "Content-Type": "application/json",
            }
        }
    finally:
        conn.close()

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "body": result,
        "headers": {
            "Content-Type": "application/json",
        },
    }