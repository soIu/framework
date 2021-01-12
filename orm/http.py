from javascript import Object, JSON, Error, function
import json

args = function

routes = {}

def route(path, method, **configuration):
    def wrapper(function):
        if path in routes: print "WARNING, there's already an http route for " + str(path)
        routes[path] = {'function': args(function), 'path': path, 'method': method, 'configuration': json.dumps(configuration)}
    return wrapper

@function
def handle(error, address):
    if error.toBoolean():
       Error(error['message'].toString())
    print "Listening on " + address.toString()

def run(port, host=None):
    require = Object('require').toFunction()
    fastify = require('fastify').call()
    merge = Object('Object')['assign'].toFunction()
    register = fastify['route'].toFunction()
    for path in routes:
        route = routes[path]
        configuration = merge(JSON.fromDict({'path': route['path'], 'method': route['method'], 'handler': JSON.fromFunction(route['function'])), JSON.rawString(route['configuration']))
        register(configuration.toRef())
    listen = fastify['listen'].toFunction()
    if host is None:
       listen(JSON.fromInteger(port), handle)
    listen(JSON.fromDict({'port': JSON.fromInteger(port), 'host': host}), handle)
