from react import check_is_mobile
from react.components import AppBar
from javascript import Object, function
from orm.tools import Global

@function
def Appbar(props):
    match = props['match']
    model = match['params']['model'].toString()
    location = props['location']
    history = props['history']
    history['match'] = match.toRef()
    router = Global()['Object'].new()
    router['history'] = history.ref()
    Object.get('Module')['router'] = router.toRef()
    hideMenu = check_is_mobile() and location['pathname'].toString() != '/'
    return AppBar(title='Home', navigation='menu' if not hideMenu else 'arrow-back', onNavigation=Object.createClosure(onNavigation, Object.fromBoolean(hideMenu), props, history).toRef(), style=[JSON.fromDict({'boxShadow': 'none'}), JSON.fromDict({'zIndex': JSON.fromInteger(1000), 'borderRadius': JSON.fromInteger(0)})]).toObject() #TODO title

@function
def onNavigation(hideMenu, props, history):
    if not hideMenu.toBoolean(): return props['toggleDrawer'].call()
    return history['goBack'].call()
