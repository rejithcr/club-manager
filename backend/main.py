import json
import logging
import db
import factory

logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

def handler(event, context):
    print(event)
    if event["headers"].get("auth-token") != "adc8f973-a213-4765-97d4-db6a4801582a":
        return { "code": 400, "status": "ERROR", "message": "Unauthorized. Please pass valid token" }

    params = factory.get_params(event)
    service = factory.get_service(event)

    try: 
        conn = db.connect()
        result = factory.execute(conn, service, params)
    except Exception as e:
        logging.exception(str(e))
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