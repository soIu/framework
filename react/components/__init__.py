from react import Component, Text
from javascript import types

@Component(path='Module.Router.Route')
class Route:
    exact = types.bool
    path = types.str
    component = types.ref

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

@Component(path='Module.Core.Typography')
class Typography:
    variant = types.str
    color = types.str
    id = types.str
    className = types.ref

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

@Component(path='Module.Icons.MoreVert')
class MoreVertical: pass

@Component(path='Module.Admin.List')
class List:
    title = types.str

@Component(path='Module.Admin.Datagrid')
class Datagrid: pass

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
    reference = types.str

@Component(path='Module.Admin.Filter')
class Filter: pass

@Component(path='Module.Admin.TextInput')
class TextInput:
    source = types.str
    label = types.str

@Component(path='Module.Admin.DateInput')
class DateInput:
    source = types.str
    label = types.str

@Component(path='Module.Admin.DateTimeInput')
class DateTimeInput:
    source = types.str
    label = types.str

@Component(path='Module.Admin.NumberInput')
class NumberInput:
    source = types.str
    label = types.str

@Component(path='Module.Admin.BooleanInput')
class BooleanInput:
    source = types.str
    label = types.str

@Component(path='Module.Admin.SelectInput')
class SelectInput:
    source = types.str
    label = types.str
    choices = types.list

@Component(path='Module.Admin.ReferenceInput')
class ReferenceInput:
    source = types.str
    label = types.str
    reference = types.str
