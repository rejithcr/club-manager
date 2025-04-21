import json

from ServiceClub import ClubService
from ServiceDefualt import DefaultService
from ServiceFee import FeeService
from ServiceMember import MemberService


def get_params(event):
    params = {}
    params["method"] =  event["requestContext"]['http']['method']
    if event.get("queryStringParameters"):
        params.update(event.get("queryStringParameters"))
    if event.get("body"):
        params.update(json.loads(event.get("body")))
    return params

def get_service(event):
    path = event.get('rawPath')
    if path:
        paths = path.split('/')
        if paths[1] == "club":
            return ClubService()
        if paths[1] == "member":
            return MemberService()
        if paths[1] == "fee":
            return FeeService()
        if paths[1] == "member":
            return MemberService()
        
    return DefaultService()


def execute(conn, service, params):
    if params['method'] == "GET":
        return service.get(conn, params)
    elif params['method'] == "POST":
        return service.post(conn, params)
    elif params['method'] == "PUT":
        return service.put(conn, params)