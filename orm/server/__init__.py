from javascript import Object, asynchronous
from .. import db, get_db, tools, data

@asynchronous
def init():
    require = Object.get('require').toFunction()
    fastify = require('fastify').call()
    fastify['register'].call(require('middie').toRef()).wait()
    db.server = fastify.keep()
    #require middie here so db.server['use'] works
    get_db()
    data.run().wait()
    return

def init_compile():
    tools.register_models()
    return
