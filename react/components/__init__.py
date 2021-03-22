from react import Component
from javascript import types

@Component(path='Module.Native.View')
class View:
    style = {}

@Component(path='Module.Native.SafeAreaView')
class SafeAreaView:
    style = {}

@Component(path='Module.Native.ScrollView')
class ScrollView:
    style = {}
    contentContainerStyle = {}

@Component(path='Module.components.BreadProvider')
class BreadProvider:
    value = {}
    text = {}

@Component(path='Module.components.Router')
class Router: pass

@Component(path='Module.components.BackButton')
class BackButton: pass

@Component(path='Module.components.Switch')
class Switch:
    swipable = False

@Component(path='Module.components.AnimatedStack')
class AnimatedSwitch:
    swipable = False

@Component(path='Module.components.Route')
class Route:
    exact = types.bool
    path = types.str
    component = types.ref

@Component(path='Module.components.List')
class List: pass

@Component(path='Module.components.ListExpand')
class ListExpand:
    expanded = types.bool
    title = types.str
    titleStyle = types.dict
    onPress = types.ref

@Component(path='Module.components.Drawer')
class Drawer:
    open = types.bool
    type = types.str
    onClose = types.ref
    drawerContent = types.ref
    style = types.dict
    drawerStyle = types.dict
    scrimStyles = types.dict
    width = types.int
    appbar = types.ref
    animationTime = types.int

@Component(path='Module.components.Appbar')
class AppBar:
    title = types.str
    navigation = types.str
    onNavigation = types.ref
    style = types.list
    color = types.str
