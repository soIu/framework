from react import check_is_mobile
from react.components import AppBar
from react.components.UserMenu import UserMenu
from javascript import JSON, Object, function
from orm import configuration
from orm.menu import get_menus
from orm.tools import Global

@function
def Appbar(props):
    match = props['match']
    model = match['params']['model'].toString()
    location = props['location']
    history = props['history']
    history['match'] = match.toRef()
    #router['history'] = history.toRef()
    #Object.get('Module')['router'] = JSON.fromDict(
    hideMenu = check_is_mobile() and location['pathname'].toString() != '/'
    title = ''
    if props['title'].type not in ['null', 'undefined']:
       title = props['title'].toString()
    menus = get_menus(map=True)
    menu = None
    parent_menu = None
    print props['menu_id'].type
    if props['menu_id'].type != 'null':
       menu = menus[props['menu_id'].toString()]
       title = menu['string'].toString()
       print title
       if menu['parent'].type != 'null':
          parent_menu = menus[menu['parent'].toString()]
          title = parent_menu['string'].toString()
          print title
    return AppBar(color=configuration.appbar_color, title=title, navigation='menu' if not hideMenu else 'arrow-back', onNavigation=Object.createClosure(onNavigation, location, props, history).toRef(), style=[JSON.fromDict({'boxShadow': 'none'}), JSON.fromDict({'zIndex': JSON.fromInteger(1000), 'borderRadius': JSON.fromInteger(0)})], actionItems=[UserMenu().toRef()]).toObject()

@function
def onNavigation(location, props, history):
    if not (check_is_mobile() and location['pathname'].toString() != '/'): return props['toggleDrawer'].call()
    return history['goBack'].call()
