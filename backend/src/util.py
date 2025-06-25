
def get_params(request):
    params = {}
    if request.args:
        params.update(request.args)
    if request.is_json:
        params.update(request.json)

    print(params)
    return params