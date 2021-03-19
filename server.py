from orm import models, http, tools, configuration
from orm.server import init, init_compile
from javascript import JSON, Object, asynchronous

import sys
import orm
sys.modules['orm'] = orm

import modules

@http.route('/api/login', method=['GET', 'POST'], asynchronous=True)
def login(request, response):
    merge = Object('Object')['assign'].toFunction()
    params = Object('{}')
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
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromDict({'id': user_id.id, 'name': user_id.name})}))

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
       response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Limit type is invalid'}))
       return
    #TODO params['order']
    domain = []
    for args in params['domain'].toArray():
        if args['length'].toInteger() != 3:
           response['send'].call(JSON.fromDict({'status': 'error', 'message': 'Domain type is invalid'}))
           return
        domain += [(args['0'].toString(), args['1'].toString(), args['2'].toString())]
    limit = params['limit'].toInteger()
    ids = models.env[model].search_ids(domain, limit, None).wait()
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromList(ids)}))

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
