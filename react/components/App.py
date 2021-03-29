from react.components import Admin, Resource
from javascript import JSON, Object, function
from orm import get_db, models, tools, configuration

import json

material_theme = json.dumps({'palette': {'primary': {'main': configuration.theme_color}, 'secondary': {'main': configuration.appbar_color}}})

def App():
    theme = Object.get('Module', 'Styles', 'createMuiTheme').call(JSON.rawString(material_theme))
    return (
      Admin (theme=theme.toRef(), authProvider=authProvider.toRef(), dataProvider=dataProvider.toRef(), children=[
      ])
    )

@function
def checkError(): return tools.Global()['Promise']['resolve'].call() #Need to setup dataProvider errors first

@function
def checkAuth(): return tools.Global()['Promise']['resolve'].call() #Pretty much useless anyway, we will just utilize checkError

@function
def login(): return tools.Global()['Promise']['resolve'].call() #Already configured at webclient

@function
def logout():
    promise, resolve = tools.create_promise()
    logout_async(resolve)
    return promise

@asynchronous
def logout_async(resolve):
    session_db = Object.get('window', 'PouchDB').new('session')
    local_db = get_db()
    error = Object.get('window', 'console', 'error').toRef()
    wait([session_db['destroy'].call()['catch'].call(error), local_db['destroy'].call()['catch'].call(error)])
    Object.get('window', 'localStorage', 'removeItem').call('orm_server_url') #TODO We need __del__ in Object
    Object.get('window', 'location', 'reload').call()
    resolve.call()

@function
def getIdentity():
    return Object.get('window', 'Promise', 'resolve').call(JSON.fromDict({'id': models.env.user.id, 'fullName': models.env.user.name}))

@function
def getList(model, option):
    promise, resolve = tools.create_promise()
    getListAsync(model, option, resolve)
    return promise

@asynchronous
def getListAsync(model, option, resolve):
    if model not in models.env.models: return
    args = []
    filter = option['filter']
    for key in filter:
        args += [(key, '=', filter[key].toRef())]
    records = models.env[model].search(args, limit=option['pagination']['perPage'].toInteger(), pagination=option['pagination']['page'].toInteger(), order=option['sort']['field'].toString() + ' ' + option['sort']['order'].toString().lower()).wait()
    result = Object.fromDict({'data': JSON.fromList([]), 'total': JSON.fromInteger(records._search_total)})
    for record in records:
        record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def getOne(model, option):
    promise, resolve = tools.create_promise()
    getOneAsync(model, option, resolve)
    return promise

@asynchronous
def getOneAsync(model, option, resolve):
    if model not in models.env.models: return
    record = models.env[model].browse(option['id'].toString()).wait()
    result = Object.fromDict({'data': record.read().toRef()})
    #for record in records:
    #    record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def getMany(model, option):
    promise, resolve = tools.create_promise()
    getOneAsync(model, option, resolve)
    return promise

@asynchronous
def getManyAsync(model, option, resolve):
    if model not in models.env.models: return
    records = models.env[model].browse(ids=[id.toString() for id in option['ids'].toArray()]).wait()
    result = Object.fromDict({'data': JSON.fromList([])})
    for record in records:
        record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def getManyReference(model, option):
    promise, resolve = tools.create_promise()
    getManyReferenceAsync(model, option, resolve)
    return promise

@asynchronous
def getManyReferenceAsync(model, option, resolve):
    if model not in models.env.models: return
    args = [(option['target'].toString(), '=', option['id'].toString())]
    filter = option['filter']
    for key in filter:
        args += [(key, '=', filter[key].toRef())]
    records = models.env[model].search(args, limit=option['pagination']['perPage'].toInteger(), pagination=option['pagination']['page'].toInteger(), order=option['sort']['field'].toString() + ' ' + option['sort']['order'].toString().lower()).wait()
    result = Object.fromDict({'data': JSON.fromList([]), 'total': JSON.fromInteger(records._search_total)})
    for record in records:
        record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def create(model, option):
    promise, resolve = tools.create_promise()
    createAsync(model, option, resolve)
    return promise

@asynchronous
def createAsync(model, option, resolve):
    if model not in models.env.models: return
    record = models.env[model].create(values=option['data']).wait()
    result = Object.fromDict({'data': record.read().toRef()})
    #for record in records:
    #    record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def update(model, option):
    promise, resolve = tools.create_promise()
    updateAsync(model, option, resolve)
    return promise

@asynchronous
def updateAsync(model, option, resolve):
    if model not in models.env.models: return
    record = models.env[model].browse(option['id'].toString()).wait()
    new_record = record.write(values=option['data']).wait()
    result = Object.fromDict({'data': new_record.read().toRef()})
    #for record in records:
    #    record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def updateMany(model, option):
    promise, resolve = tools.create_promise()
    updateManyAsync(model, option, resolve)
    return promise

@asynchronous
def updateManyAsync(model, option, resolve):
    if model not in models.env.models: return
    old_records = models.env[model].browse(ids=[id.toString() for id in option['ids'].toArray()]).wait()
    records = old_records.write(values=option['data']).wait()
    result = Object.fromDict({'data': JSON.fromList([])})
    for record in records:
        record['data']['push'].call(record.id)
        #record['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())
