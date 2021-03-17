from . import tools
from javascript import asynchronous_function

import os

def server(method=None, asynchronous=False):
    def wrapper(method):
        if tools.check_server():
           return method
        def empty_server_method(*args):
            return
        return empty_server_method
    if not method and asynchronous:
       def async_wrapper(method):
           if not tools.check_server(): return wrapper(method)
           return wrapper(asynchronous_function(method))
       return async_wrapper
    return wrapper(method)
