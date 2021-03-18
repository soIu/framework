from orm import models, http, configuration
from orm.server import init, init_compile
from javascript import JSON, Object, asynchronous

import sys
import orm
sys.modules['orm'] = orm

import modules

@http.route('/', method=['GET', 'POST'], asynchronous=True)
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
    if not user_id:
       response['send'].call(JSON.fromDict({'status': 'denied', 'message': 'Username/Password wrong'}))
       return
    response['send'].call(JSON.fromDict({'status': 'success', 'result': JSON.fromDict({'id': user_id.id, 'name': user_id.name})}))

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