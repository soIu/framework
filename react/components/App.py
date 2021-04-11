from react import Component
from react.components import Admin, Resource, Filter, Route
#from react.components.Inbox import Inbox
from react.components.Tree import Tree
from react.components.TreeField import Field as TreeField
from react.components.FormField import Field as FormField
from javascript import JSON, Object, function, asynchronous
from orm import get_db, models, tools, configuration, views, menu

import json

material_theme = json.dumps({'palette': {'primary': {'main': configuration.theme_color}, 'secondary': {'main': configuration.appbar_color}}, 'shape': {'borderRadius': '10px'}})

tree_components = {component.__name__: component for component in [Tree, TreeField]}
components = {}

def recurseView(view, tree=False, model=None, components=components, parent=None):
    filters = None
    if view.tag == 'tree':
       components = tree_components
       if tree and 'model' in view.attrib:
          model = view.attrib['model']
          fields = [FormField (props=tools.merge(children.attrib, {'model': model, 'alwaysOn': JSON.fromBoolean(True)} if index == 0 else {'model': model})) for index, children in enumerate(view._children)]
          class State: pass
          @Component(State=State)
          class Filters:
              def render(self):
                  props = {}
                  for key in self.props:
                      props[key] = self.props[key].toRef()
                  return (
                      Filter (props=props, children=fields)
                  )
          filters = Filters()
       if not tree:
          parent_model = parent.view.attrib['model']
          parent_field = parent.view.attrib['name']
          field = models.env[parent_model]._fields_object[parent_field]
          if not hasattr(field, 'relation'): raise Exception("Tree inside a form view must be a relational field")
          model = field.relation
    component = None
    component_name = view.tag[0].upper() + view.tag.lower()[1:]
    if component_name in components:
       component = components[component_name]
    if component is None and view.tag in components:
       component = components[view.tag]
       component_name = view.tag
    if component is None: return component
    if model: view.attrib['model'] = model
    if tree: view.attrib['is_tree_view'] = JSON.fromBoolean(True)
    #return component(props=view.attrib, children=[recurseView(children) for children in view._children])
    children = [recurseView(children, tree=tree, model=model, components=components, parent=view) for children in view._children]
    result = component(props=view.attrib, children=[child for child in children if child is not None])
    if filters: result.filters = filters
    return result

compiled_views = {}

for view in views.views:
    if view.endswith('.tree'):
       compiled_views[view] = recurseView(views.views[view], True)

def get_compiled_component(view_id):
    return Object.createClosure(handle_compiled_component, Object.fromString(view_id))

@function
def handle_compiled_component(view_id, props):
    component = compiled_views[view]
    for key in props:
        component.native_props[key] = props[key].toRef()
    return component.toObject()

def App():
    theme = Object.get('Module', 'Styles', 'createMuiTheme').call(JSON.rawString(material_theme))
    authProvider = JSON.fromDict({'checkError': JSON.fromFunction(checkError), 'checkAuth': JSON.fromFunction(checkAuth), 'login': JSON.fromFunction(login), 'logout': JSON.fromFunction(logout), 'getIdentity': JSON.fromFunction(getIdentity), 'getPermissions': JSON.fromFunction(getPermissions)})
    dataProvider = JSON.fromDict({'getList': JSON.fromFunction(getList), 'getOne': JSON.fromFunction(getOne), 'getMany': JSON.fromFunction(getMany), 'getManyReference': JSON.fromFunction(getManyReference), 'create': JSON.fromFunction(create), 'update': JSON.fromFunction(update), 'updateMany': JSON.fromFunction(updateMany)})
    customRoutes = [] #Route(exact=True, path='/inbox', component=Inbox().toRef()).toRef()]
    #ListGuesser = Object.get('Module', 'Admin', 'ListGuesser').toRef()
    return (
      Admin (theme=theme.toRef(), customRoutes=customRoutes, authProvider=authProvider, dataProvider=dataProvider, children=[
        #Resource (name='inbox')
        ] + [
        Resource (name=parent_menu['childs']['0']['model'].toString() if parent_menu['childs']['length'].toInteger() else parent_menu['model'].toString(), list=get_compiled_component((parent_menu['childs']['0']['model'].toString() if parent_menu['childs']['length'].toInteger() else parent_menu['model'].toString()) + '.tree').toRef(), options={'label': parent_menu['string'].toString()})
      for parent_menu in menu.get_menus().toArray()])
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
def getPermissions():
    return Object.get('window', 'Promise', 'resolve').call()

@function
def getList(model, option):
    promise, resolve = tools.create_promise()
    getListAsync(model, option, resolve)
    return promise

@asynchronous
def getListAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    args = []
    filter = option['filter']
    for key in filter:
        value = filter[key]
        type = value.type
        args += [(key, 'ilike' if type == 'string' and key != 'id' else '=' if type != 'array' else 'in', value.toRef())]
    records = models.env[model].search(args, limit=option['pagination']['perPage'].toInteger(), pagination=option['pagination']['page'].toInteger(), order=option['sort']['field'].toString() + ' ' + option['sort']['order'].toString().lower()).wait()
    result = Object.fromDict({'data': JSON.fromList([]), 'total': JSON.fromInteger(records._search_total)})
    for record in records:
        result['data']['push'].call(record.read().toRef())
    result.log()
    resolve.call(result.toRef())

@function
def getOne(model, option):
    promise, resolve = tools.create_promise()
    getOneAsync(model, option, resolve)
    return promise

@asynchronous
def getOneAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    record = models.env[model].browse(option['id'].toString()).wait()
    result = Object.fromDict({'data': record.read().toRef()})
    #for record in records:
    #    result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def getMany(model, option):
    promise, resolve = tools.create_promise()
    getManyAsync(model, option, resolve)
    return promise

@asynchronous
def getManyAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    records = models.env[model].browse(ids=[id.toString() for id in option['ids'].toArray()]).wait()
    result = Object.fromDict({'data': JSON.fromList([])})
    for record in records:
        result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def getManyReference(model, option):
    promise, resolve = tools.create_promise()
    getManyReferenceAsync(model, option, resolve)
    return promise

@asynchronous
def getManyReferenceAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    args = [(option['target'].toString(), '=', option['id'].toString())]
    filter = option['filter']
    for key in filter:
        args += [(key, '=', filter[key].toRef())]
    records = models.env[model].search(args, limit=option['pagination']['perPage'].toInteger(), pagination=option['pagination']['page'].toInteger(), order=option['sort']['field'].toString() + ' ' + option['sort']['order'].toString().lower()).wait()
    result = Object.fromDict({'data': JSON.fromList([]), 'total': JSON.fromInteger(records._search_total)})
    for record in records:
        result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def create(model, option):
    promise, resolve = tools.create_promise()
    createAsync(model, option, resolve)
    return promise

@asynchronous
def createAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    record = models.env[model].create(values=option['data']).wait()
    result = Object.fromDict({'data': record.read().toRef()})
    #for record in records:
    #    result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def update(model, option):
    promise, resolve = tools.create_promise()
    updateAsync(model, option, resolve)
    return promise

@asynchronous
def updateAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    record = models.env[model].browse(option['id'].toString()).wait()
    new_record = record.write(values=option['data']).wait()
    result = Object.fromDict({'data': new_record.read().toRef()})
    #for record in records:
    #    result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())

@function
def updateMany(model, option):
    promise, resolve = tools.create_promise()
    updateManyAsync(model, option, resolve)
    return promise

@asynchronous
def updateManyAsync(model_object, option, resolve):
    model = model_object.toString()
    if model not in models.env.models: return
    old_records = models.env[model].browse(ids=[id.toString() for id in option['ids'].toArray()]).wait()
    records = old_records.write(values=option['data']).wait()
    result = Object.fromDict({'data': JSON.fromList([])})
    for record in records:
        result['data']['push'].call(record.id)
        #result['data']['push'].call(record.read().toRef())
    resolve.call(result.toRef())
