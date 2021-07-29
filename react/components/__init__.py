from react import Component, Text
from javascript import types

@Component(path='window.React.Fragment')
class Fragment: pass

@Component(path='Module.Router.Route')
class Route:
    exact = types.bool
    path = types.str
    component = types.ref

@Component(path='Module.Core.Typography')
class Typography:
    variant = types.str
    color = types.str
    id = types.str
    ref = types.ref
    className = types.ref
    style = types.dict
    gutterBottom = types.bool

@Component(path='Module.Core.Menu')
class Menu:
    id = types.str
    anchorEl = types.ref
    keepMounted = types.bool
    open = types.bool
    onClose = types.ref

@Component(path='Module.Core.MenuItem')
class MenuItem:
    onClick = types.ref

@Component(path='Module.Core.IconButton')
class IconButton:
    onClick = types.ref

@Component(path='Module.Core.Button')
class Button:
    variant = types.str
    type = types.type
    onClick = types.ref

@Component(path='Module.Core.Grid')
class Grid:
    xs = types.int
    sm = types.int
    spacing = types.int
    item = types.bool
    container = types.bool
    style = types.dict
    className = types.str

@Component(path='Module.Core.Box')
class Box: pass

@Component(path='Module.Core.Card')
class Card: pass

@Component(path='Module.Core.CardContent')
class CardContent:
    style = types.dict

@Component(path='Module.Icons.MoreVert')
class MoreVertical: pass

@Component(path='Module.Admin.Admin')
class Admin:
    theme = types.ref
    layout = types.ref
    authProvider = types.ref
    dataProvider = types.ref
    customRoutes = types.list

@Component(path='Module.Admin.Resource')
class Resource:
    name = types.str
    list = types.ref
    create = types.ref
    edit = types.ref
    show = types.ref
    options = types.dict

@Component(path='Module.Admin.List')
class List:
    title = types.str

@Component(path='Module.Admin.Datagrid')
class Datagrid:
    rowClick = types.str

@Component(path='Module.Admin.TextField')
class TextField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.DateField')
class DateField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.DateTimeField')
class DateTimeField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.NumberField')
class NumberField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.BooleanField')
class BooleanField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.SelectField')
class SelectField:
    source = types.str
    label = types.str
    choices = types.list

@Component(path='Module.Admin.ReferenceField')
class ReferenceField:
    source = types.str
    label = types.str
    link = types.str
    reference = types.str

@Component(path='Module.Admin.ReferenceArrayField')
class ReferenceArrayField:
    source = types.str
    reference = types.str

@Component(path='Module.Admin.ReferenceManyField')
class ReferenceManyField:
    target = types.str
    reference = types.str

@Component(path='Module.Admin.AutocompleteField')
class AutocompleteField: pass

@Component(path='Module.Admin.Filter')
class Filter: pass

@Component(path='Module.Admin.TextInput')
class TextInput:
    source = types.str

@Component(path='Module.Admin.DateInput')
class DateInput:
    source = types.str

@Component(path='Module.Admin.DateTimeInput')
class DateTimeInput:
    source = types.str

@Component(path='Module.Admin.NumberInput')
class NumberInput:
    source = types.str

@Component(path='Module.Admin.BooleanInput')
class BooleanInput:
    source = types.str

@Component(path='Module.Admin.SelectInput')
class SelectInput:
    source = types.str
    choices = types.list

@Component(path='Module.Admin.ReferenceInput')
class ReferenceInput:
    source = types.str
    reference = types.str

@Component(path='Module.Admin.AutocompleteInput')
class AutocompleteInput: pass

@Component(path='Module.Admin.Labeled')
class Labeled:
    label = types.str

@Component(path='Module.Admin.Form')
class Form:
    render = types.ref

@Component(path='Module.Admin.FormWithRedirect')
class FormWithRedirect:
    render = types.ref

@Component(path='Module.Admin.Toolbar')
class Toolbar: pass
