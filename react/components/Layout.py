from react import Component, Text
from react.components import Typography, IconButton, MoreVertical, Menu, MenuItem
from javascript import JSON, Object, function, types

@Component(path='Module.Admin.AppBar')
class AppBar:
    elevation = types.int

@Component
class span:
    className = types.ref

@Component
class div: pass

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
        Object.get('window', 'location')['hash'] = '#/' + menu['model'].toString()

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
                    MenuItem (onClick=Object.createClosure(self.onMenu, setElement, child).toRef(), children=[
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
    classes = Object.get('Module', 'Core', 'makeStyles').call(JSON.rawString(styles)).call()
    new_props = {} #key: props[key].toRef() for key in props}
    for key in props:
        new_props[key] = props[key].toRef()
    return (
        AppBar (props=new_props, elevation=1, children=[
            Typography (variant='h6', color='inherit', id='react-admin-title', className=classes['title'].toRef()),
            span (className=classes['spacer'].toRef()),
            #TODO Menu
            Submenu ()
        ])
    ).toObject()

def AdminLayout(props, appBar):
    Layout = Object.get('Module', 'Admin', 'Layout')
    return Object.get('window', 'React', 'createElement').call(Layout.toRef(), Object.get('window', 'Object', 'assign').call(JSON.fromDict({'appBar': appBar}), props.toRef()).toRef())

@function
def Layout(props):
    return (
        AdminLayout (props=props, appBar=JSON.fromFunction(Appbar))
    )
