from react import Component, check_is_web, check_is_mobile, initial_state, unmount_state, cache, Method
from react.components import Drawer, List, ListItem, Icon, ScrollView, View
from react.components.Appbar import Appbar
from javascript import JSON, Object, function, types #, Method, method, function
from orm import menu as orm_menu

Method, method = Method(lambda: Page)

class State:

    open = False

class Props:

    title = ''
    history = types.ref
    menu_id = types.ref

@Component(State=State, Props=Props)
class Page:

    def constructor(self):
        self.react_state = initial_state(self, JSON.fromDict({'open': JSON.fromBoolean(State.open)}))

    @method
    def onResize(self):
        print 'resizing'
        self.setState()

    @method
    def onClose(self):
        self.react_state['open'] = JSON.fromBoolean(False)
        self.state.open = self.react_state['open'].toBoolean()
        self.setState()

    @method
    def toggleDrawer(self):
        state = self.react_state
        state['open'] = JSON.fromBoolean(not state['open'].toBoolean())
        self.state.open = state['open'].toBoolean()
        self.setState()

    def mount(self):
        state = self.react_state
        if state['drawer_resize'].type == 'undefined':
           state['drawer_resize'] = Method(self, Page.onResize)
        Object('Module.Native.Dimensions.addEventListener').call(state['drawer_resize'].toRef())

    def unmount(self):
        state = self.react_state
        Object('Module.Native.Dimensions.removeEventListener').call(state['drawer_resize'].toRef())
        unmount_state(self)

    def render(self):
        web = check_is_web()
        mobile = check_is_mobile()
        minHeight = cache.dimensions_get.call('window')['height'].toInteger() - 56
        appbar = Object.get('window', 'React')['createElement'].call(Object.get('Module', 'components', 'withRouter').call(JSON.fromFunction(Appbar)).toRef(), JSON.fromDict({'title': self.props['title'].toRef(), 'menu_id': self.props['menu_id'].toRef(), 'toggleDrawer': Method(self, Page.toggleDrawer)}))
        #menus = menu.get_menus()
        menuContent = []
        for menu in orm_menu.get_menus().toArray():
            childs = menu['childs']
            #textStyle={'fontWeight': '500', 'fontSize': JSON.fromInteger(15)},
            listItem = ListItem (text=menu['string'].toString(), textStyle={'fontWeight': '500', 'fontSize': JSON.fromInteger(15)}, onPress=Object.createClosure(onPressMenu, childs['0'] if childs['length'].toInteger() else menu, self.props['history']).toRef()) #, icon=Icon(name='menu', size=24).toRef())
            menuContent += [listItem]
        drawerContent = (
            ScrollView (style={'padding': JSON.fromInteger(16 if mobile else 34), 'height': '100%', 'flex': JSON.fromInteger(1)}, children=[
                List (menuContent)
            ])
        )
        drawer = (
            Drawer (open=self.state.open, type='modal', onClose=Method(self, Page.onClose), drawerContent=drawerContent.toRef(), appbar=appbar.toRef(), animationTime=200, width=280 if mobile else 265, style={'height': 'auto', 'minHeight': '100vh' if web else '100%'}, drawerStyle={'height': '100%'}, scrimStyles={'position': 'absolute', 'height': '100%'}, children=[
                View (style={'width': '100%', 'minHeight': JSON.fromInteger(minHeight), 'position': 'relative', 'marginBottom': JSON.fromInteger(0), 'maxWidth': JSON.fromInteger(1440)}, children=[
                    ScrollView (children=[ #contentContainerStyle={'paddingBottom': JSON.fromInteger(100)}
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
    history['orm_active_menu'] = menu.toRef()
    history['push'].call('/tree/' + menu['model'].toString())
