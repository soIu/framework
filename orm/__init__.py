from javascript import JSON, Error
from typing import Object, Function, Dict

class Configuration: pass

configuration = Configuration()

import os
import imp

def load_configuration():
    configuration_path = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'configuration.py')
    configuration_module = imp.load_source('orm_configuration', configuration_path)
    for key in dir(configuration_module):
        if key[0] == '_': continue
        setattr(configuration, key, getattr(configuration_module, key))

load_configuration()

class Database:
    #loaded = False
    server = None
    pouchdb = None

db = Database()

Pouch = Object({
  'plugin': Function,
  'defaults': Function,
})

Window = Object({
  'PouchDB': Pouch,
})

def load_plugin(require, PouchDB):
    #PouchDB.plugin(require('pouchdb-find').toRef()) not required, maybe on client only
    PouchDB.plugin(require('pouchdb-replication').toRef())
    PouchDB.plugin(require('pouchdb-adapter-http').toRef())
    PouchDB.plugin(require('pouchdb-adapter-memory').toRef())

DB = Object({
  'replicate': Dict,
  'allDocs': Function,
  'bulkDocs': Function,
  'get': Function,
  'put': Function,
  'remove': Function,
})

Fastify = Object({
  'use': Function,
  'register': Function,
  'route': Function,
  'listen': Function,
})

def get_db():
    if db.pouchdb is not None:
       return DB(db.pouchdb) #Object.get('global', db.pouchdb.variable)
    if db.server is not None:
       require = Object.get('require').toFunction()
       PouchDB = Pouch(require('pouchdb-core'))
       load_plugin(require, PouchDB)
       if configuration.server_db_custom_adapter:
          PouchDB.plugin(require(configuration.server_db_custom_adapter).toRef())
       options = JSON.fromDict({'prefix': configuration.server_db_url if configuration.server_db_adapter == 'http' else "", 'adapter': configuration.server_db_adapter})
       Fastify(db.server).use('/db', require('express-pouchdb').call(PouchDB.defaults(options).toRef(), JSON.fromDict({'inMemoryConfig': JSON.fromBoolean(True), 'mode': 'custom', 'overrideMode': JSON.fromDict({'include': JSON.fromList(['routes/all-docs', 'routes/changes', 'routes/db', 'routes/documents'])})})).toRef())
       db.pouchdb = PouchDB.newObject(configuration.server_db, options).keep() #, JSON.fromDict({'adapter': configuration.server_db_adapter})).keep()
       return DB(db.pouchdb)
    PouchDB = Window(Object.get('window')).PouchDB
    db.pouchdb = PouchDB.newObject(configuration.client_db).keep()
    return DB(db.pouchdb)
