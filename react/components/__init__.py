from react import Component
from javascript import types

@Component(path='Module.Native.View')
class View:
    style = {}

@Component(path='Module.Native.SafeAreaView')
class SafeAreaView:
    style = {}

@Component(path='Module.components.BreadProvider')
class BreadProvider:
    value = {}
    text = {}

@Component(path='Module.components.Router')
class Router: pass

@Component(path='Module.components.BackButton')
class BackButton: pass

@Component(path='Module.components.Switch')
class Switch: pass

@Component(path='Module.components.AnimatedStack')
class AnimatedSwitch:
    swipable = False

@Component(path='Module.components.Route')
class Route:
    exact = types.bool
    path = types.str
    component = types.ref
