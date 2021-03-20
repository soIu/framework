from javascript import JSON, Object, Error

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

def load_plugin(require, PouchDB):
    #PouchDB['plugin'].call(require('pouchdb-find').toRef()) not required, maybe on client only
    PouchDB['plugin'].call(require('pouchdb-replication').toRef())
    PouchDB['plugin'].call(require('pouchdb-adapter-http').toRef())
    PouchDB['plugin'].call(require('pouchdb-adapter-memory').toRef())

def get_db():
    if db.pouchdb is not None:
       return Object.get('global', db.pouchdb.variable)
    if db.server is not None:
       require = Object.get('require').toFunction()
       PouchDB = require('pouchdb-core')
       load_plugin(require, PouchDB)
       if configuration.server_db_custom_adapter:
          PouchDB['plugin'].call(require(configuration.server_db_custom_adapter).toRef())
       options = JSON.fromDict({'adapter': configuration.server_db_adapter})
       db.server['use'].call('/db', require('express-pouchdb').call(PouchDB['defaults'].call(options).toRef()).toRef())
       db.pouchdb = PouchDB.new(configuration.server_db, options).keep() #, JSON.fromDict({'adapter': configuration.server_db_adapter})).keep()
       return db.pouchdb
    PouchDB = Object.get('window', 'PouchDB')
    db.pouchdb = PouchDB.new(configuration.client_db).keep()
    return db.pouchdb
