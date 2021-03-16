from javascript import Object, Error
from .. import configuration

class Database:
    #loaded = False
    server = None
    pouchdb = None

db = Database()

def load_plugin(PouchDB):
    #PouchDB['plugin'].call(require('pouchdb-find').toRef()) not required, maybe on client only
    PouchDB['plugin'].call(require('pouchdb-adapter-http').toRef())
    PouchDB['plugin'].call(require('pouchdb-adapter-memory').toRef())

def get_db():
    if db.pouchdb is not None: return db.pouchdb
    if db.server is not None:
       require = Object.get('require').toFunction()
       PouchDB = require('pouchdb-core')
       load_plugin(PouchDB)
       if configuration.server_db_custom_adapter:
          PouchDB['plugin'].call(require(configuration.server_db_custom_adapter).toRef())
       PouchDB['defaults'].call(JSON.fromDict({'adapter': configuration.server_db_adapter}))
       db.server['use'].call('/db', require('express-pouchdb').call(PouchDB.toRef()).toRef())
       db.pouchdb = PouchDB.new(configuration.server_db).keep() #, JSON.fromDict({'adapter': configuration.server_db_adapter})).keep()
       return db.pouchdb
    PouchDB = Object.get('window', 'PouchDB').call()
    db.pouchdb = PouchDB.new(configuration.client_db).keep()
    return db.pouchdb
