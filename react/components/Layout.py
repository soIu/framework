from react import Component, Text
from react.components import Typography, IconButton, MoreVertical, Menu, MenuItem
from javascript import JSON, Object, function, types
from orm import configuration

@Component(path='Module.Admin.AppBar')
class AppBar:
    elevation = types.int

@Component
class span:
    className = types.ref

@Component
class div: pass

@Component
class a:
    style = types.dict

@Component
class img:
    src = types.str

class Props: pass

@Component(Props=Props)
class Submenu:

    @function
    def onClick(setElement, event):
        setElement.call(event['currentTarget'].toRef())

    @function
    def onClose(setElement):
        setElement.call(None)

    @function
    def onMenu(setElement, menu):
        setElement.call(None)
        #Object.get('window', 'location')['hash'] = '#/' + menu['model'].toString()

    def render(self):
        menu = Object.get('Module')['orm_active_menu']
        if not menu.toBoolean() or not menu['childs']['length'].toInteger(): return div()
        id = 'solu-appbar-submenu'
        states = Object.get('window', 'React', 'useState').call(None)
        element, setElement = states['0'], states['1'] #.toFunction()
        return (
            div ([
                IconButton (props={'aria-controls': id, 'aria-haspopup': 'true', 'color': 'inherit'}, onClick=Object.createClosure(self.onClick, setElement).toRef(), children=[
                    MoreVertical ()
                ]),
                Menu (id=id, anchorEl=element.toRef(), keepMounted=True, open=element.toBoolean(), onClose=Object.createClosure(self.onClose, setElement).toRef(), children=[
                    MenuItem (props={'component': 'a', 'href': '#/' + child['model'].toString()}, onClick=Object.createClosure(self.onMenu, setElement, child).toRef(), children=[
                        Text (child['string'].toString())
                    ])
                for child in menu['childs'].toArray()])
            ])
        )

import json

styles = json.dumps({
    'title': {
        'flex': 1,
        'textOverflow': 'ellipsis',
        'whiteSpace': 'nowrap',
        'overflow': 'hidden',
    },
    'spacer': {
        'flex': 1,
    },
})

@function
def Appbar(props):
    #classes = Object.get('Module', 'Core', 'makeStyles').call(JSON.rawString(styles)).call()
    new_props = {} #key: props[key].toRef() for key in props}
    for key in props:
        new_props[key] = props[key].toRef()
    cached_title = Object.get('global', 'cached_react_admin_title')
    return (
        AppBar (props=new_props, elevation=1, children=[
            Typography (style={'width': '100%'}, variant='h6', color='inherit', id='react-admin-title-fix', children=[] if not cached_title.toBoolean() else [Text(cached_title.toString())]), #, className=classes['title'].toRef()),
            Typography (style={'display': 'none'}, variant='h6', color='inherit', id='react-admin-title', ref=JSON.fromFunction(fix_title)), #, className=classes['title'].toRef()),
            #span (className=classes['spacer'].toRef()),
            Submenu (),
            a (props={'href': 'https://solu.js.org', 'target': '_blank'}, style={'position': 'absolute', 'right': JSON.fromInteger(0), 'top': JSON.fromIntger(0), 'margin': '15px'}, children=[
                img (props={'height': '28px'}, src='logo192.png')
            ]) if not configuration.appbar_color else None
        ])
    ).toObject()

@function
def fix_title(element):
    if element.type == 'null': return
    cache = Object.fromDict({})
    observer = Object.get('window', 'MutationObserver').new(Object.createClosure(check_empty_title, element, cache).toRef())
    cache['observer'] = observer.toRef()
    observer['observe'].call(element.toRef(), JSON.fromDict({'characterData': JSON.fromBoolean(False), 'attributes': JSON.fromBoolean(False), 'childList': JSON.fromBoolean(True)}))

@function
def check_empty_title(element, cache):
    if not element['children']['length'].toInteger(): return
    cache['observer']['disconnect'].call()
    Object.get('window', 'document', 'getElementById').call('react-admin-title-fix')['innerHTML'] = element['innerHTML'].toRef()
    Object.get('global')['cached_react_admin_title'] = element['children']['0']['innerText'].toRef()

def AdminLayout(props, appBar):
    Layout = Object.get('Module', 'Admin', 'Layout')
    return Object.get('window', 'React', 'createElement').call(Layout.toRef(), Object.get('window', 'Object', 'assign').call(JSON.fromDict({'appBar': appBar}), props.toRef()).toRef())

@function
def Layout(props):
    return (
        AdminLayout (props=props, appBar=JSON.fromFunction(Appbar))
    )
