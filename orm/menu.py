from . import tools, views
from javascript import JSON, Object

menu = {}

def add(id, string, model=None, parent=None, view_id=None, sequence=1):
    if tools.check_server(): return
    menu[id] = {'id': id, 'string': string, 'model': model, 'parent': parent, 'view_id': view_id, 'sequence': str(sequence)}

def check_menus():
    for id in menu:
        parent = menu[id]['parent']
        model = menu[id]['model']
        view_id = menu[id]['view_id']
        string = menu[id]['string']
        if parent:
           if parent not in menu: raise Exception("Parent %s of menu %s doesn't exist" % (parent, id))
           if not model and not view_id: raise Exception("Submenu %s doesn't have a model or a view_id" % id)
        elif not model and not view_id and not any(menu[menu_id]['parent'] == id for menu_id in menu if menu_id != id):
           raise Exception("Menu %s is not used anywhere" % id)
        if model and not view_id:
           tree = model + '.tree'
           if tree not in views.views: raise Exception("Menu %s doesn't have a tree view" % id)
           view = views.views[model + '.tree']
           if not view.attrib.get('title'): view.attrib['title'] = string
           form = views.views.get(model + '.form')
           if form:
              if not form.attrib.get('title'): form.attrib['title'] = string
           view.attrib['orm_menu_id'] = id
        if view_id:
           if view_id not in views.views: raise Exception("Menu %s uses view_id %s but it doesn't exist" % (id, view_id))
           view = views.views[view_id]
           if not view.attrib.get('title'): view.attrib['title'] = string
           view.attrib['orm_menu_id'] = id

class Cache:
    menus = None
    menu_map = None

cache = Cache()

def get_menus(map=False):
    if map and cache.menu_map is not None: return cache.menu_map
    if cache.menus is not None: return cache.menus
    cache.menus = tools.Global()['Array'].new()
    menus = tools.Global()['Object'].new()
    sort = Object('function (a, b) {return a.sequence - b.sequence;}') #.toRef()
    for id in menu:
        menu_object = menu[id]
        if menu_object['parent'] is None:
           sequence = int(menu_object['sequence'])
           parent = Object(JSON.fromDict(menu_object), safe_json=True)
           parent['sequence'] = JSON.fromInteger(sequence)
           parent['childs'] = JSON.fromList([])
           menus[id] = parent.toRef()
           cache.menus['push'].call(parent.toRef())
    cache.menus['sort'].call(sort.toRef())
    for id in menu:
        menu_object = menu[id]
        if menu_object['parent'] is not None:
           child = Object(JSON.fromDict(menu_object), safe_json=True)
           child['sequence'] = JSON.fromInteger(child['sequence'].toInteger())
           #TODO Assign empty array to childs and also check if parent exist, if it doesn't it is a sub-submenu
           childs = menus[menu_object['parent']]['childs']
           childs['push'].call(child.toRef())
           childs['sort'].call(sort.toRef())
           menus[id] = child.toRef()
    cache.menu_map = menus.keep()
    if map: return menus
    return cache.menus.keep()

def get_menu(id):
    if id in menu: return menu[id]
    print "Menu with id %s doesn't exist" % id
    return None

add(id='settings', string='Settings', sequence=1000000)
