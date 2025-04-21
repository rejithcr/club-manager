import json

import db
import factory

def handler(event, context):

    if event["headers"].get("auth-token") != "test-token":
        return { "code": 400, "status": "ERROR", "message": "Unauthorized. Please pass valid token" }

    params = factory.get_params(event)
    service = factory.get_service(event)

    try: 
        conn = db.connect()
        result = factory.execute(conn, service, params)
    finally:
        conn.close()

    return {"result": result}