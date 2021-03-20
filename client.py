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
def set_server_url(url):
    configuration.server_url = url.toString()

@function
def set_user(id, login, password):
    models.env.user.id = id.toString()
    models.env.user.login = login.toString()
    models.env.user.password = password.toString()

def main(argv):
    models.env.user = models.env['res.users'].new()
    ORM = tools.Global()['Object'].new()
    ORM['set_server_url'] = JSON.fromFunction(set_server_url)
    ORM['set_user'] = JSON.fromFunction(set_user)
    Module = Object.get('Module')
    Module['orm'] = ORM.toRef()
    return 0

def target(*args):
    init_compile()
    return main, None
