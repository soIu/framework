from orm import models, http, tools, configuration
from orm.server import init, init_compile
from javascript import JSON, Object, asynchronous, function

import sys
import orm
sys.modules['orm'] = orm

import modules
configuration.modules = modules

modules.load()

python_version = sys.version

@http.route('/api/check', method=['GET', 'POST'])
def check(request, response):
    response['send'].call(JSON.fromDict({'status': 'success', 'orm_compiler_python_version': python_version}))

@http.route('/api/login', method=['GET', 'POST'], asynchronous=True)
def login(request, response):
    Object = tools.Global()['Object']
    merge = Object['assign'].toFunction()
    params = Object.new()
    query = request['query']
    if query.type != 'undefined': params = merge(params.toRef(), query.toRef())
    body = request['body']
    if body.type != 'undefined': params = merge(params.toRef(), body.toRef())
    login = None
    password = None
    if params['login'].type == 'string':
       login = params['login'].toString()
       if not login:
          response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Username/email is empty'}))
          return
    else:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Username/email type is invalid'}))
       return
    if params['password'].type == 'string':
       password = params['password'].toString()
       if not password:
          response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Password is empty'}))
          return
    else:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Password type is invalid'}))
       return
    user_id = models.env['res.users'].search([('login', '=', login), ('password', '=', password)], 1).wait()
    if not len(user_id):
       response['send'].call(JSON.fromDict({'status': 'denied', 'message': 'Username/Password wrong'}))
       return
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromDict({'id': user_id.id, 'name': user_id.name}), 'custom_js': '\nModule.orm_loaded = new Promise(function (resolve) {Module.orm_resolve = resolve;});', 'wasm': JSON.fromList(['/api/orm/wasm', '/api/orm/js'])}))

@http.route('/api/search', method=['GET', 'POST'], asynchronous=True)
def search(request, response):
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if result['status'].toString() != 'success':
       response['send'].call(result.toRef())
       return
    merge = Object('Object')['assign'].toFunction()
    params = Object('{}')
    query = request['query']
    if query.type != 'undefined': params = merge(params.toRef(), query.toRef())
    body = request['body']
    if body.type != 'undefined': params = merge(params.toRef(), body.toRef())
    if params['model'].type != 'string':
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params['model'].toString()
    if model not in models.env.models:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params['domain'].type == 'string':
       params['domain'] = tools.Global()['JSON']['stringify'].call(params['domain'].toRef()).toRef()
    if params['domain'].type != 'array':
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Domain type is invalid'}))
       return
    if params['limit'].type == 'string':
       params['limit'] = tools.Global()['JSON']['stringify'].call(params['limit'].toRef()).toRef()
    if params['limit'].type != 'number':
       if params['limit'].type in ['null', 'undefined']:
          params['limit'] = JSON.fromInteger(0)
       else:
          response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Limit type is invalid'}))
          return
    if params['pagination'].type != 'number':
       if params['pagination'].type in ['null', 'undefined']:
          params['pagination'] = JSON.fromInteger(0)
       else:
          response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Pagination type is invalid'}))
          return
    order = None
    if params['order'].type != 'string':
       if params['order'].type not in ['null', 'undefined']:
          response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Limit type is invalid'}))
          return
    else:
       order = params['order'].toString()
    #TODO params['order']
    domain = []
    for args in params['domain'].toArray():
        if args['length'].toInteger() != 3:
           response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Domain type is invalid'}))
           return
        domain += [(args['0'].toString(), args['1'].toString(), args['2'].toRef())]
    limit = params['limit'].toInteger()
    pagination = params['pagination'].toInteger()
    search = models.env[model].search_ids(domain, limit, pagination, order).wait()
    ids, total = search
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromList(ids), 'search_total': JSON.fromInteger(total)}))

@http.route('/api/create', method=['GET', 'POST'], asynchronous=True)
def create(request, response):
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if result['status'].toString() != 'success':
       response['send'].call(result.toRef())
       return
    merge = Object('Object')['assign'].toFunction()
    params = Object('{}')
    query = request['query']
    if query.type != 'undefined': params = merge(params.toRef(), query.toRef())
    body = request['body']
    if body.type != 'undefined': params = merge(params.toRef(), body.toRef())
    if params['model'].type != 'string':
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params['model'].toString()
    if model not in models.env.models:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params['values'].type == 'string':
       params['values'] = tools.Global()['JSON']['stringify'].call(params['values'].toRef()).toRef()
    if params['values'].type not in ['array', 'object']:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Values type is invalid'}))
       return
    records = models.env[model].create_server(params['values']).wait()
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromList(records.ids)}))

@http.route('/api/write', method=['GET', 'POST'], asynchronous=True)
def write(request, response):
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if result['status'].toString() != 'success':
       response['send'].call(result.toRef())
       return
    merge = Object('Object')['assign'].toFunction()
    params = Object('{}')
    query = request['query']
    if query.type != 'undefined': params = merge(params.toRef(), query.toRef())
    body = request['body']
    if body.type != 'undefined': params = merge(params.toRef(), body.toRef())
    if params['model'].type != 'string':
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model type is invalid'}))
       return
    model = params['model'].toString()
    if model not in models.env.models:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Model does not exist'}))
       return
    if params['ids'].type == 'string':
       params['ids'] = tools.Global()['JSON']['stringify'].call(params['ids'].toRef()).toRef()
    if params['ids'].type != 'array':
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'IDs type is invalid'}))
       return
    if params['values'].type == 'string':
       params['values'] = tools.Global()['JSON']['stringify'].call(params['values'].toRef()).toRef()
    if params['values'].type not in ['array', 'object']:
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Values type is invalid'}))
       return
    records = models.env[model].browse(ids=[id.toString() for id in params['ids'].toArray()]).wait()
    records.write_server(params['values']).wait()
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromList(records.ids)}))

@http.route('/api/orm/wasm', method=['GET', 'POST'], asynchronous=True)
def wasm(request, response):
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if result['status'].toString() != 'success':
       response['send'].call(result.toRef())
       return
    response['sendFile'].call('client.wasm', Object.get('get_dirname').call().toString());
    #stream = Object.get('require').call('fs')['createReadStream'].call('./client.wasm')
    #response['type'].call('application/wasm')['send'].call(stream.toRef())

#@function
#def transform_js(chunk, encoding, callback):
#    callback.call(None, chunk.toRef())

#@function
#def flush_js(stream, callback):
#    stream['push'].call('\nModule.orm_loaded = new Promise(function (resolve) {Module.orm_resolve = resolve;});')
#    callback.call()

@http.route('/api/orm/js', method=['GET', 'POST'], asynchronous=True)
def js(request, response):
    login_response = http.login_response()
    Object.fromFunction(login).call(request.toRef(), login_response.toRef()) #.wait()
    result = login_response.wait()
    if result['status'].toString() != 'success':
       response['send'].call(result.toRef())
       return
    response['sendFile'].call('client.js', Object.get('get_dirname').call().toString());
    #require = Object.get('require').toFunction()
    #stream = require('fs')['createReadStream'].call('./client.js')
    #append = require('stream')['Transform'].new()
    #append['_transform'] = JSON.fromFunction(transform_js)
    #append['_flush'] = Object.createClosure(flush_js, append).toRef()
    #response['type'].call('application/js')['send'].call(stream['pipe'].call(append.toRef()).toRef())

tools.register_models()

@asynchronous
def start():
    init().wait()
    http.run(configuration.port)

def main(argv):
    start()
    return 0

def target(*args):
    init_compile()
    return main, None
