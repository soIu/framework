from javascript import Object, Error

class Database:
    gun = None
    server = None

db = Database()

def get_db():
    if db.gun is not None: return db.gun
    if db.server is not None:
       require = Object.get('require').toFunction()
       db.gun = require('gun').call(JSON.fromDict({'web': db.server.toRef()})).keep()
       return db.gun
    db.gun = Object.get('window', 'Gun').call().keep()
    return db.gun
