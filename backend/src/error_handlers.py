import json


def generic_error_handler(error):
  return {"error":str(error.original_exception)}, 500