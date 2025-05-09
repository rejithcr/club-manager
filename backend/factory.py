import json

from ServiceClub import ClubService
from ServiceDefualt import DefaultService
from ServiceFee import FeeService
from ServiceMember import MemberService
from ServiceClubMember import ClubMemberService
from ServiceFeeException import FeeExceptionService
from ServiceFeeCollection import FeeCollectionService
from ServiceFeeAdhoc import FeeAdhocService
from ServiceClubTransaction import ClubTransactionService


def get_params(event):
    params = {}
    params["method"] =  event["requestContext"]['http']['method']
    if event.get("queryStringParameters"):
        params.update(event.get("queryStringParameters"))
    if event.get("body"):
        params.update(json.loads(event.get("body")))
    
    print(params)

    return params

def get_service(event):
    path = event["requestContext"]['http']['path']
    if path:
        paths = path.split('/')
        print(paths)
        if paths[1] == "club":
            if len(paths) > 2 and paths[2] =="member":
                print("club member")
                return ClubMemberService()
            if len(paths) > 2 and paths[2] =="transaction":
                print("transaction")
                return ClubTransactionService()
            return ClubService()
        if paths[1] == "member":
            return MemberService()
        if paths[1] == "fee":
            if len(paths) > 2 and paths[2] =="exception":
                print("fee exception")
                return FeeExceptionService()
            if len(paths) > 2 and paths[2] =="collection":
                print("fee collection")
                return FeeCollectionService()
            if len(paths) > 2 and paths[2] =="adhoc":
                print("fee adhoc")
                return FeeAdhocService()
            return FeeService()
        
    return DefaultService()


def execute(conn, service, params):
    if params['method'] == "GET":
        return service.get(conn, params)
    elif params['method'] == "POST":
        return service.post(conn, params)
    elif params['method'] == "PUT":
        return service.put(conn, params)
    elif params['method'] == "DELETE":
        return service.delete(conn, params)