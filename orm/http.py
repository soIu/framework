from javascript import Object, JSON, Error, function
from . import db
import json

args = function

routes = {}

class Route:
    def __init__(self, kwargs):
        self.__dict__ = kwargs

def route(path, method, asynchronous=False, **configuration):
    def wrapper(function):
        if path in routes: print "WARNING, there's already an http route for " + str(path)
        routes[path] = Route({'function': args(function) if not asynchronous else args(asynchronous=True)(function), 'path': path, 'method': method if type(method) == list else [method], 'configuration': json.dumps(configuration)})
        return routes[path].function
    return wrapper

@function
def handle(error, address):
    if error.toBoolean():
       Error(error['message'].toString())
    print "Listening on " + address.toString()

def run(port, host=None):
    require = Object('require').toFunction()
    fastify = require('fastify').call()
    fastify['register'].call(require('fastify-formbody').toRef())
    merge = Object('Object')['assign'].toFunction()
    register = fastify['route'].toFunction()
    for path in routes:
        route = routes[path]
        configuration = merge(JSON.fromDict({'path': route.path, 'method': JSON.fromList(route.method), 'handler': JSON.fromFunction(route.function)}), JSON.rawString(route.configuration))
        register(configuration.toRef())
    listen = fastify['listen'].toFunction()
    if host is None:
       listen(JSON.fromInteger(port), JSON.fromFunction(handle))
    listen(JSON.fromDict({'port': JSON.fromInteger(port), 'host': host}), JSON.fromFunction(handle))