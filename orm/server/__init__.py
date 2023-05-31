from javascript import JSON, asynchronous
from typing import Object, Function
from .. import db, get_db, tools, data, Fastify

@asynchronous
def init():
    require = Object.get('require').toFunction()
    fastify = Fastify(require('fastify').call())
    fastify.register(require('fastify-cors').toRef(), JSON.fromDict({'origin': JSON.fromBoolean(True), 'credentials': JSON.fromBoolean(True)}))
    fastify.register(require('fastify-express').toRef()).wait()
    db.server = fastify.toObject().keep()
    get_db()
    data.run().wait()
    #return

def init_compile():
    #tools.register_models()
    return
