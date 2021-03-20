from orm import models, tools, configuration
from orm.client import init, init_compile
from javascript import JSON, Object, function

if not configuration.server_url: configuration.server_url = ''

import sys
import orm
sys.modules['orm'] = orm

import modules
configuration.modules = modules

modules.load()

@function
def set_server_url(resolve, url):
    configuration.server_url = url.toString()
    resolve.call()

@function
def set_user(resolve, id, login, password):
    models.env.user.id = id.toString()
    models.env.user.login = login.toString()
    models.env.user.password = password.toString()
    resolve.call()

def main(argv):
    url_promise, url_resolve = tools.create_promise()
    user_promise, user_resolve = tools.create_promise()
    promise = tools.Global()['Promise']['all'].call(url_promise.toRef(), user_promise.toRef())
    models.env.user = models.env['res.users'].new()
    ORM = tools.Global()['Object'].new()
    ORM['set_server_url'] = Object.createClosure(set_server_url, url_resolve).toRef()
    ORM['set_user'] = Object.createClosure(set_user, user_resolve).toRef()
    Module = Object.get('Module')
    Module['orm'] = ORM.toRef()
    init(promise)
    return 0

def target(*args):
    init_compile()
    return main, None
