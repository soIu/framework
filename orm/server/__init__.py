from javascript import JSON, Object, asynchronous
from .. import db, get_db, tools, data

@asynchronous
def init():
    require = Object.get('require').toFunction()
    fastify = require('fastify').call()
    fastify['register'].call(require('fastify-cors').toRef(), JSON.fromDict({'origin': JSON.fromBoolean(True), 'credentials': JSON.fromBoolean(True)}))
    fastify['register'].call(require('fastify-express').toRef()).wait()
    db.server = fastify.keep()
    get_db()
    data.run().wait()
    #return

def init_compile():
    tools.register_models()
    return
