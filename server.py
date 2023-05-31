from orm import models, http, tools, configuration
from orm.server import init, init_compile
from javascript import JSON, Object, asynchronous, function
from typing import Object, Function, String

import sys
import orm
sys.modules['orm'] = orm

import modules
configuration.modules = modules

modules.load()

python_version = sys.version

JSObject = Object({
  'assign': Function,
})

Request = Object({
  'query': Object,
  'body': Object,
  'headers': Object({
    'authorization': Object,
  }),
})

Response = Object({
  'send': Function,
  'sendFile': Function,
})

Result = Object({
  'status': Object,
})

Params = Object({
  'login': Object,
  'password': Object,
  'model': Object,
  'domain': Object,
  'limit': Object,
  'order': Object,
  'pagination': Object,
  'values': Object,
  'ids': Object,
})

@http.route('/api/check', method=['GET', 'POST'])
def check(request, response):
    Response(response).send(JSON.fromDict({'status': 'success', 'orm_compiler_python_version': python_version}))

@http.route('/api/login', method=['GET', 'POST'], asynchronous=True)
def login(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    Object = tools.Global().Object
    merge = JSObject(Object).assign
    params = Params(Object.new())
    query = request.query
    if query.type != 'undefined': params = Params(merge(params.toRef(), query.toRef()))
    body = request.body
    if body.type != 'undefined': params = Params(merge(params.toRef(), body.toRef()))
    login = None
    password = None
    if params.login.type == 'string':
       login = params.login.toString()
       if not login:
          response.send(JSON.fromDict({'status': 'error', 'message': 'Username/email is empty'}))
          return
    else:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Username/email type is invalid'}))
       return
    if params.password.type == 'string':
       password = params.password.toString()
       if not password:
          response.send(JSON.fromDict({'status': 'error', 'message': 'Password is empty'}))
          return
    else:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Password type is invalid'}))
       return
    user_id = models.env['res.users'].search([('login', '=', login), ('password', '=', password)], 1).wait()
    if not len(user_id):
       response.send(JSON.fromDict({'status': 'denied', 'message': 'Username/Password wrong'}))
       return
    response.send(JSON.fromDict({'status': 'success', 'result': JSON.fromDict({'id': user_id.id, 'name': user_id.name}), 'custom_js': '\nModule.orm_loaded = new Promise(function (resolve) {Module.orm_resolve = resolve;});', 'wasm': JSON.fromList(['/api/orm/wasm', '/api/orm/js'])}))

@http.route('/api/search', method=['GET', 'POST'], asynchronous=True)
def search(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if Result(result).status.toString() != 'success':
       response.send(result.toRef())
       return
    merge = JSObject(tools.Global().Object).assign
    params = Params(Object.fromDict({}))
    query = request.query
    if query.type != 'undefined': params = Params(merge(params.toRef(), query.toRef()))
    body = request.body
    if body.type != 'undefined': params = Params(merge(params.toRef(), body.toRef()))
    if params.model.type != 'string':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params.model.toString()
    if model not in models.env.models:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params.domain.type == 'string':
       params.toObject()['domain'] = tools.Global().JSON.stringify(params.domain.toRef()).toRef()
    if params.domain.type != 'array':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Domain type is invalid'}))
       return
    if params.limit.type == 'string':
       params.toObject()['limit'] = tools.Global().JSON.stringify(params.limit.toRef()).toRef()
    if params.limit.type != 'number':
       if params.limit.type in ['null', 'undefined']:
          params.toObject()['limit'] = JSON.fromInteger(0)
       else:
          response.send(JSON.fromDict({'status': 'error', 'message': 'Limit type is invalid'}))
          return
    if params.pagination.type != 'number':
       if params.pagination.type in ['null', 'undefined']:
          params.toObject()['pagination'] = JSON.fromInteger(0)
       else:
          response.send(JSON.fromDict({'status': 'error', 'message': 'Pagination type is invalid'}))
          return
    order = None
    if params.order.type != 'string':
       if params.order.type not in ['null', 'undefined']:
          response.send(JSON.fromDict({'status': 'error', 'message': 'Limit type is invalid'}))
          return
    else:
       order = params.order.toString()
    #TODO params.order
    domain = []
    for arguments in params.domain.toArray():
        args = arguments.toList()
        if len(args) != 3:
           response.send(JSON.fromDict({'status': 'error', 'message': 'Domain type is invalid'}))
           return
        domain += [(args[0].toString(), args[1].toString(), args[2].toRef())]
    limit = params.limit.toInteger()
    pagination = params.pagination.toInteger()
    search = models.env[model].search_ids(domain, limit, pagination, order).wait()
    ids, total = search
    response.send(JSON.fromDict({'status': 'success', 'result': JSON.fromList(ids), 'search_total': JSON.fromInteger(total)}))

@http.route('/api/create', method=['GET', 'POST'], asynchronous=True)
def create(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if Result(result).status.toString() != 'success':
       response.send(result.toRef())
       return
    merge = JSObject(tools.Global().Object).assign
    params = Params(Object.fromDict({}))
    query = request.query
    if query.type != 'undefined': params = Params(merge(params.toRef(), query.toRef()))
    body = request.body
    if body.type != 'undefined': params = Params(merge(params.toRef(), body.toRef()))
    if params.model.type != 'string':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params.model.toString()
    if model not in models.env.models:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params.values.type == 'string':
       params.toObject()['values'] = tools.Global().JSON.stringify(params.values.toRef()).toRef()
    if params.values.type not in ['array', 'object']:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Values type is invalid'}))
       return
    records = models.env[model].create_server(params.values).wait()
    response.send(JSON.fromDict({'status': 'success', 'result': JSON.fromList(records.ids)}))

@http.route('/api/write', method=['GET', 'POST'], asynchronous=True)
def write(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if Result(result).status.toString() != 'success':
       response.send(result.toRef())
       return
    merge = JSObject(tools.Global().Object).assign
    params = Params(Object.fromDict({}))
    query = request.query
    if query.type != 'undefined': params = Params(merge(params.toRef(), query.toRef()))
    body = request.body
    if body.type != 'undefined': params = Params(merge(params.toRef(), body.toRef()))
    if params.model.type != 'string':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params.model.toString()
    if model not in models.env.models:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params.ids.type == 'string':
       params.toObject()['ids'] = tools.Global().JSON.stringify(params.ids.toRef()).toRef()
    if params.ids.type != 'array':
       response.send(JSON.fromDict({'status': 'error', 'message': 'IDs type is invalid'}))
       return
    if params.values.type == 'string':
       params.toObject()['values'] = tools.Global().JSON.stringify(params.values.toRef()).toRef()
    if params.values.type not in ['array', 'object']:
       response.send(JSON.fromDict({'status': 'error', 'message': 'Values type is invalid'}))
       return
    records = models.env[model].browse(ids=[id.toString() for id in params.ids.toList()]).wait()
    records.write_server(params.values).wait()
    response.send(JSON.fromDict({'status': 'success', 'result': JSON.fromList(records.ids)}))

Buffer = Object({
  'Buffer': dict,
})

Base64 = Object({
  'toString': Function,
})

@http.route('/api/orm/wasm', method=['GET'], asynchronous=True)
def wasm(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    authorization = request.headers.authorization
    if authorization.type != 'string':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Authorization headers is required'}))
       return
    atobed = Base64(Buffer(Object.get('require').call('buffer')).Buffer['from'].call(authorization.toString().split(' ')[1], 'base64')).toString('binary').toString().split('|:|')
    assert len(atobed) >= 2
    username = atobed[0]
    password = atobed[1]
    query = request.query
    query['login'] = username
    query['password'] = password
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if Result(result).status.toString() != 'success':
       response.send(result.toRef())
       return
    response.sendFile('client.wasm', Object.get('get_dirname').call().toString());
    #stream = Object.get('require').call('fs')['createReadStream'].call('./client.wasm')
    #response['type'].call('application/wasm')['send'].call(stream.toRef())

#@function
#def transform_js(chunk, encoding, callback):
#    callback.call(None, chunk.toRef())

#@function
#def flush_js(stream, callback):
#    stream['push'].call('\nModule.orm_loaded = new Promise(function (resolve) {Module.orm_resolve = resolve;});')
#    callback.call()

@http.route('/api/orm/js', method=['GET', 'PUT', 'POST'], asynchronous=True)
def js(request_object, response_object):
    request = Request(request_object)
    response = Response(response_object)
    authorization = request.headers.authorization
    if authorization.type != 'string':
       response.send(JSON.fromDict({'status': 'error', 'message': 'Authorization headers is required'}))
       return
    atobed = Base64(Buffer(Object.get('require').call('buffer')).Buffer['from'].call(authorization.toString().split(' ')[1], 'base64')).toString('binary').toString().split('|:|')
    assert len(atobed) >= 2
    username = atobed[0]
    password = atobed[1]
    query = request.query
    query['login'] = username
    query['password'] = password
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if Result(result).status.toString() != 'success':
       response.send(result.toRef())
       return
    response.sendFile('client.js', Object.get('get_dirname').call().toString());
    #require = Object.get('require').toFunction()
    #stream = require('fs')['createReadStream'].call('./client.js')
    #append = require('stream')['Transform'].new()
    #append['_transform'] = JSON.fromFunction(transform_js)
    #append['_flush'] = Object.createClosure(flush_js, append).toRef()
    #response['type'].call('application/js')['send'].call(stream['pipe'].call(append.toRef()).toRef())

tools.register_models()

Process = Object({
  'env': Object({
    'HOST': Object,
    'PORT': Object,
  }),
})

@asynchronous
def start():
    init().wait()
    env = Process(Object.get('require').call('process')).env
    http.run(configuration.port if env.PORT.type in ['undefined', 'null'] else env.PORT.toInteger(), host=env.HOST.toString() if env.HOST.type == 'string' else '0.0.0.0' if env.PORT.type not in ['undefined', 'null'] else None)

def main(argv):
    start()
    return 0

def target(*args):
    if configuration.server_db.startswith('http'):
       import os
       url = os.path.split(configuration.server_db)
       configuration.server_db = next(route for route in url[::-1] if route)
       configuration.server_db_url = url[0]
    init_compile()
    return main, None
