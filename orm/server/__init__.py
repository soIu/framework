from javascript import asynchronous
from . import db, get_db, tools

@asynchronous
def init():
    require = Object.get('require').toFunction()
    fastify = require('fastify')
    fastify['register'].call(require('middie').toRef())
    db.server = fastify #.keep()
    #require middie here so db.server['use'] works
    get_db()
    return

def init_compile()
    tools.register_models()
    return
