from javascript import Object, Error

class Database:
    loaded = False
    server = None

db = Database()

def get_db():
    if db.server is not None:
       require = Object.get('require').toFunction()
       gun = require('gun').call(JSON.fromDict({'web': db.server.toRef()})) if not db.loaded else require('gun').call()
       db.loaded = True
       return gun
    gun = Object.get('window', 'Gun').call()
    return gun

get_gun = get_db
