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

@async
def logout_async(resolve):
    session_db = Object.get('window', 'PouchDB').new('session')
    local_db = get_db()
    error = Object.get('window', 'console', 'error').toRef()
    wait([session_db['destroy'].call()['catch'].call(error), local_db['destroy'].call()['catch'].call(error)])
    Object.get('window', 'localStorage', 'removeItem').call('orm_server_url') #TODO We need __del__ in Object
    Object.get('window', 'location', 'reload').call()
    resolve()

@function
def getIdentity():
    return Object.get('window', 'Promise', 'resolve').call(JSON.fromDict({'id': models.env.user.id, 'fullName': models.env.user.name}))
