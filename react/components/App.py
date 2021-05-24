from react import Component, get_component
from react.components import Fragment, Admin, Resource, Filter, Route
from react.components.Theme import light_theme #, dark_theme
from react.components.Layout import Layout
#from react.components.Inbox import Inbox
from react.components.Tree import Tree
from react.components.TreeField import Field as TreeField
from react.components.Form import Form
from react.components.FormField import Field as FormField, InputField
from react.components.Sheet import Sheet
from react.components.Group import Group
from javascript import JSON, Object, function, asynchronous
from orm import get_db, models, tools, configuration, views, menu as menu_orm

import json

#material_theme = json.dumps({'palette': {'primary': {'main': configuration.theme_color}, 'secondary': {'main': configuration.appbar_color}}, 'shape': {'borderRadius': '10px'}})
light_theme = json.dumps(light_theme)

tree_components = {component.__name__: component for component in [Tree, TreeField]}
components = {component.__name__: component for component in [Form, FormField, Sheet, Group]}

def recurseView(view, tree=False, form=False, model=None, components=components, parent=None):
    filters = None
    if view.tag == 'tree':
       components = tree_components
       if tree and 'model' in view.attrib:
          model = view.attrib['model']
          fields = [InputField (props=tools.merge(children.attrib, {'model': model, 'is_filter': JSON.fromBoolean(True)})) for index, children in enumerate(view._children)]
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
          filters_object = Filters()
          def filters(): return filters_object.toRef()
       if not tree:
          parent_model = parent.view.attrib['model']
          parent_field = parent.view.attrib['name']
          field = models.env[parent_model]._fields_object[parent_field]
          if not hasattr(field, 'relation'): raise Exception("Tree inside a form view must be a relational field")
          model = field.relation
    elif view.tag == 'form':
       form = []
       if 'model' in view.attrib: model = view.attrib['model']
    component = None
    component_name = view.tag[0].upper() + view.tag.lower()[1:] if '-' not in view.tag else "".join([word[0].upper() + word.lower()[1:] for word in view.tag.split('-')])
    if component_name in components:
       component = components[component_name]
    if component is None and view.tag in components:
       component = components[view.tag]
       component_name = view.tag
    #if component is None: return component
    if not component: component = get_component(view.tag)
    if model: view.attrib['model'] = model
    if tree: view.attrib['is_tree_view'] = JSON.fromBoolean(True)
    #return component(props=view.attrib, children=[recurseView(children) for children in view._children])
    children = [recurseView(children, tree=tree, form=form, model=model, components=components, parent=view) for children in view._children]
    result = component(props=view.attrib, children=[child for child in children if child is not None])
    if component == Form:
       for child in form:
           child.form = result
    elif form and component == FormField: form.append(result)
    if filters: result.filters = filters
    return result

compiled_views = {}

for view in views.views:
    if view.endswith('.tree'):
       compiled_views[view] = recurseView(views.views[view], True)
    else:
       compiled_views[view] = recurseView(views.views[view])

def get_compiled_component(view_id, model, menu=None):
    return Object.createClosure(handle_compiled_component, Object.fromString(view_id), model, menu if menu is not None else Object.fromDict(None))

@function
def handle_compiled_component(view_id, model, menu, props):
    Object.get('Module')['orm_active_menu'] = menu.toRef()
    #if '#/' + model.toString() + '/create' in Object.get('window', 'location', 'hash').toString():
    #   
    #el
    component = compiled_views[view_id.toString()]
    if props['match']['path'].toString() == '/' + model.toString() + '/:id':
       props['component'] = 'div'
       return Object.get('window', 'React', 'createElement').call(Object.get('Module', 'Admin', 'Edit').toRef(), Object.get('window', 'Object', 'assign').call(JSON.fromDict({'component': 'div', 'title': component.native_props['title'] if 'title' in component.native_props else ""}), props.toRef()).toRef(), Object.get('window', 'React', 'createElement').call(Object.createClosure(handle_edit_create, view_id).toRef()).toRef())
    for key in props:
        component.native_props[key] = props[key].toRef()
    return component.toObject()

@function
def handle_edit_create(view_id, props):
    component = compiled_views[view_id.toString()]
    for key in props:
        component.native_props[key] = props[key].toRef()
    return component.toObject()

def App():
    theme = Object.get('Module', 'Styles', 'createMuiTheme').call(JSON.rawString(light_theme))
    authProvider = JSON.fromDict({'checkError': JSON.fromFunction(checkError), 'checkAuth': JSON.fromFunction(checkAuth), 'login': JSON.fromFunction(login), 'logout': JSON.fromFunction(logout), 'getIdentity': JSON.fromFunction(getIdentity), 'getPermissions': JSON.fromFunction(getPermissions)})
    dataProvider = JSON.fromDict({'getList': JSON.fromFunction(getList), 'getOne': JSON.fromFunction(getOne), 'getMany': JSON.fromFunction(getMany), 'getManyReference': JSON.fromFunction(getManyReference), 'create': JSON.fromFunction(create), 'update': JSON.fromFunction(update), 'updateMany': JSON.fromFunction(updateMany)})
    customRoutes = [] #Route(exact=True, path='/inbox', component=Inbox().toRef()).toRef()]
    #ListGuesser = Object.get('Module', 'Admin', 'ListGuesser').toRef()
    menus = []
    for parent_menu in menu_orm.get_menus().toArray():
        if parent_menu['childs']['length'].toInteger():
           menus += [{'name': parent_menu['childs']['0']['model'].toString(), 'list': get_compiled_component(parent_menu['childs']['0']['model'].toString() + '.tree', parent_menu['childs']['0']['model'], parent_menu).toRef(), 'edit': get_compiled_component(parent_menu['childs']['0']['model'].toString() + '.form', parent_menu['childs']['0']['model'], parent_menu).toRef(), 'label': parent_menu['string'].toString()}]
           for menu in parent_menu['childs']['slice'].call(JSON.fromInteger(1)).toArray():
               menus += [{'name': menu['model'].toString(), 'list': get_compiled_component(menu['model'].toString() + '.tree', menu['model'], parent_menu).toRef(), 'edit': get_compiled_component(menu['model'].toString() + '.form', menu['model'], parent_menu).toRef(), 'label': menu['string'].toString()}]
               Object.get('window', 'document', 'head', 'insertAdjacentHTML').call('beforeend', "<style>.MuiDrawer-root a[href^='#/" + menu['model'].toString() + "'] {display: none}</style>")
        else:
           menus += [{'name': parent_menu['model'].toString(), 'list': get_compiled_component(parent_menu['model'].toString() + '.tree', parent_menu['model'], parent_menu).toRef(), 'edit': get_compiled_component(parent_menu['model'].toString() + '.form', parent_menu['model'], parent_menu).toRef(), 'label': parent_menu['string'].toString()}]
    return (
        Fragment (children=([iOSNotch()] if Object.get('window', 'navigator', 'standalone').toBoolean() else []) + [
            Admin (theme=theme.toRef(), layout=JSON.fromFunction(Layout), customRoutes=customRoutes, authProvider=authProvider, dataProvider=dataProvider, children=[
                #Resource (name='inbox')
                ] + [
                Resource (name=menu['name'], list=menu['list'], edit=menu['edit'], options={'label': menu['label']}) #(name=parent_menu['childs']['0']['model'].toString() if parent_menu['childs']['length'].toInteger() else parent_menu['model'].toString(), list=get_compiled_component((parent_menu['childs']['0']['model'].toString() if parent_menu['childs']['length'].toInteger() else parent_menu['model'].toString()) + '.tree', parent_menu).toRef(), options={'label': parent_menu['string'].toString()})
            for menu in menus]) #().toArray()])
        ])
    )

div = get_component('div')

def iOSNotch():
    document = Object.get('window', 'document')
    style = document['createElement'].call('style')
    style['innerHTML'] = 'header.MuiAppBar-positionFixed {top: 20px!important;}'
    document['querySelector'].call('head')['append'].call(style.toRef())
    return (
        Fragment ([
            div (props={'style': JSON.fromDict({'height': '20px'})}),
            div (props={'style': JSON.fromDict({'height': '21px'}), 'className': 'MuiPaper-root MuiAppBar-root MuiAppBar-positionFixed MuiAppBar-colorSecondary mui-fixed'})
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
