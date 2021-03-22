from react import Component, check_is_web, check_is_mobile, initial_state, component_id, cache
from react.components import Drawer, List, ListExpand, ScrollView, View
from react.components.Appbar import Appbar
from javascript import JSON, Object, Method, method, function
from orm import menu as orm_menu

onResize, onClose, toggleDrawer = Method(3)

class State:

    open = False

@Component(State=State)
class Page:

    def constructor(self, title='', history=None):
        self.title = title
        self.history = history

    @method
    def onResize(self):
        self.setState()

    @method
    def onClose(self):
        self.state.open = True
        self.toggleDrawer()

    @method
    def toggleDrawer(self):
        self.state.open = not self.state.open
        initial_state(JSON.fromBoolean(State.open), JSON.fromBoolean(self.state.open), component_id(self))
        self.setState()

    def mount(self):
        orm = Object.get('Module', 'orm')
        if orm['drawer_resize'].type == 'undefined':
           orm['drawer_resize'] = onResize(self.onResize)
        Object('Module.Native.Dimensions.addEventListener').call(orm['drawer_resize'].toRef())

    def unmount(self):
        orm = Object.get('Module', 'orm')
        Object('Module.Native.Dimensions.removeEventListener').call(orm['drawer_resize'].toRef())

    def render(self):
        web = check_is_web()
        mobile = check_is_mobile()
        minHeight = cache.dimensions_get.call('window')['height'].toInteger() - 56
        appbar = Object.get('window', 'React')['createElement'].call(Object.get('Module', 'components', 'withRouter').call(JSON.fromFunction(Appbar)).toRef(), JSON.fromDict({'title': self.title, 'toggleDrawer': toggleDrawer(self.toggleDrawer)}))
        #menus = menu.get_menus()
        menuContent = []
        for menu in orm_menu.get_menus().toArray():
            childs = menu['childs']
            listExpand = ListExpand (expanded=False, title=menu['string'].toString(), titleStyle={'fontWeight': '500', 'fontSize': JSON.fromInteger(15)}, onPress=Object.createClosure(onPressMenu, childs['0'] if childs['length'].toInteger() else menu, self.history).toRef())
            menuContent += [listExpand]
        drawerContent = (
            ScrollView (style={'padding': JSON.fromInteger(16 if mobile else 34), 'height': '100%', 'flex': JSON.fromInteger(1)}, children=[
                List (menuContent)
            ])
        )
        drawer = (
            Drawer (open=self.state.open, type='modal', onClose=onClose(self.onClose), drawerContent=drawerContent.toRef(), appbar=appbar.toRef(), animationTime=200, width=280 if mobile else 265, style={'height': 'auto', 'minHeight': '100vh' if web else '100%'}, drawerStyle={'height': '100%'}, scrimStyles={'position': 'absolute', 'height': '100%'}, children=[
                View (style={'width': '100%', 'minHeight': JSON.fromInteger(minHeight), 'position': 'relative', 'marginBottom': JSON.fromInteger(0), 'maxWidth': JSON.fromInteger(1440)}, children=[
                    ScrollView (contentContainerStyle={'paddingBottom': JSON.fromInteger(100)}, children=[
                        View (
                            self.children
                        )
                    ])
                ])
            ])
        )
        return drawer

@function
def onPressMenu(menu, history):
    history['push'].call('/tree/' + menu['model'].toString())
