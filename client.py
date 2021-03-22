
from orm import models, tools, configuration, menu
from orm.client import init, init_compile
from javascript import JSON, Object, Error, function

if not configuration.server_url: configuration.server_url = ''

import sys
import orm
sys.modules['orm'] = orm

import modules
configuration.modules = modules

modules.load()

menu.check_menus()

from react.components.App import App

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

@function(asynchronous=True)
def search(domain_args):
    domain = []
    for args in domain_args.toArray():
        if args['length'].toInteger() != 3:
           Error('Not sufficient')
        domain += [(args['0'].toString(), args['1'].toString(), args['2'].toRef())]
    records = models.env['res.users'].search(domain).wait()
    print len(records)
    for record in records:
        print record.name
        record.read().log()

def main(argv):
    url_promise, url_resolve = tools.create_promise()
    user_promise, user_resolve = tools.create_promise()
    promise = tools.Global()['Promise']['all'].call(JSON.fromList([url_promise.toRef(), user_promise.toRef()]))
    ORM = tools.Global()['Object'].new()
    ORM['set_server_url'] = Object.createClosure(set_server_url, url_resolve).toRef()
    ORM['set_user'] = Object.createClosure(set_user, user_resolve).toRef()
    ORM['search'] = JSON.fromFunction(search)
    Module = Object.get('Module')
    Module['orm'] = ORM.toRef()
    Module['orm_resolve'].call()
    init(promise, App().toRef())
    return 0

def target(*args):
    init_compile()
    models.env.user = models.env['res.users'].new()
    return main, None
