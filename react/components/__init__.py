from react import Component, Text as ReactText
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

@Component(path='Module.Native.Text')
class NativeText:
    style = {}

def Text(text, style={}):
    component = ReactText(text)
    return NativeText(style=style, children=[component])

@Component(path='Module.components.BreadProvider')
class BreadProvider:
    value = {}
    text = {}

@Component(path='Module.components.Router')
class Router: pass

@Component(path='Module.components.BackButton')
class BackButton: pass

#@Component(path='Module.components.Switch')
#class Switch:
#    swipable = False

@Component(path='Module.components.AnimatedStack')
class AnimatedStack:
    swipable = False

@Component(path='Module.components.Route')
class Route:
    exact = types.bool
    path = types.str
    component = types.ref

@Component(path='Module.components.List')
class List: pass

@Component(path='Module.components.ListItem')
class ListItem:
    text = types.str
    textStyle = types.dict
    onPress = types.ref
    icon = types.ref

@Component(path='Module.components.Icon')
class Icon:
    name = types.str
    size = types.int

@Component(path='Module.components.IconButton')
class IconButton:
    name = types.str
    size = types.int
    color = types.str

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
    actionItems = types.list

@Component(path='Module.components.CSSTransition')
class CSSTransition:
    timeout = types.int
    unmountOnExit = types.bool
    classNames = types.str

@Component
class div:
    className = types.str

Div = div

@Component(path='Module.components.DataTableHeader')
class TableHeader:
    title = types.ref
    rightActions = types.list

@Component(path='Module.components.DataTableRow')
class TableRow:
    key = types.str
    hover = types.bool
    onPress = types.ref

@Component(path='Module.components.DataTableCell')
class TableCell:
    type = types.str
    text = types.str
    style = types.dict

@Component(path='Module.components.DataTablePagination')
class TablePagination:
    page = types.int
    perPage = types.int
    numberOfPages = types.int
    numberOfRows = types.int
    onChangePage = types.ref
    onChangeRowsPerPage = types.ref

@Component(path='Module.components.Button')
class Button:
    onPress = types.ref
    style = types.dict
    text = types.str
    textColor = types.str
    type = types.ref
    useInputCasing = types.bool

@Component(path='Module.components.TextField')
class TextField:
    label = types.str
    value = types.str
    type = types.str
    leadingIcon = types.ref
    trailingIcon = types.ref
    onChangeText = types.ref
    style = types.dict
    containerStyle = types.dict

@Component(path='Module.components.Menu')
class Menu:
    visible = types.bool
    onBackdropPress = types.ref
    button = types.ref
    modalMenuStyle = types.dict

@Component(path='Module.components.MenuItem')
class MenuItem:
    text = types.str
    onPress = types.ref
