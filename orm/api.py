from . import tools
from javascript import asynchronous_function

import os

def client(method=None, asynchronous=False, server=True):
    def wrapper(method, server=server):
        if not tools.check_server():
           return method
        if not server:
           def empty_server_method(*args):
               return
           return empty_server_method
    if not method and asynchronous:
       def async_wrapper(method):
           if not server and tools.check_server(): return wrapper(method, server)
           return wrapper(asynchronous_function(method), server)
       return async_wrapper
    return wrapper(method)

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
