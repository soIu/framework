from javascript import Object, JSON, Error, function
from typing import Object, String, Function
from . import db, tools
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

ErrorMessage = Object({
  'message': String,
})

@function
def handle(error, address):
    if error.toBoolean() or address.type == 'null':
       print "There's an error"
       error.log()
       Error(ErrorMessage(error).message)
    print "Listening on " + address.toString()

Path = Object({
  'join': Function,
})

def run(port, host=None):
    dirname = tools.Global().get_dirname()
    require = Object('require').toFunction()
    fastify = db.server #require('fastify').call()
    fastify.register(require('fastify-formbody').toRef())
    merge = Object('Object.assign').toFunction()
    for path in routes:
        route = routes[path]
        configuration = merge(JSON.fromDict({'path': route.path, 'method': JSON.fromList(route.method), 'handler': JSON.fromFunction(route.function)}), JSON.rawString(route.configuration))
        fastify.route(configuration.toRef())
    fastify.register(require('fastify-static').toRef(), JSON.fromDict({'root': Path(require('path')).join(dirname, 'web').toRef(), 'preCompressed': JSON.fromBoolean(True)}))
    if host is None:
       fastify.listen(JSON.fromInteger(port), JSON.fromFunction(handle))
       return
    fastify.listen(JSON.fromDict({'port': JSON.fromInteger(port), 'host': host}), JSON.fromFunction(handle))

Response = Object({
  'send': Object,
})

def login_response():
    response = Response(tools.Global().Object.new())
    promise = tools.Global().Promise.newObject(Object.createClosure(login_response_handle, response.toObject()).toRef())
    promise['send'] = response.send.toRef()
    return promise

@function
def login_response_handle(response, resolve):
    response['send'] = resolve.toRef()
