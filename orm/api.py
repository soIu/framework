from . import tools
from javascript import asynchronous_function

import os

def server(method=None, asynchronous=False, client=True):
    def wrapper(method, client=client):
        if tools.check_server():
           return method
        if not client:
           def empty_server_method(*args):
               return
           return empty_server_method
    if not method and asynchronous:
       def async_wrapper(method):
           if not client and not tools.check_server(): return wrapper(method, client)
           return wrapper(asynchronous_function(method), client)
       return async_wrapper
    return wrapper(method)
