from react import Component, Text
from javascript import types

@Component(path='Module.Admin.Admin')
class Admin:
    theme = types.ref
    authProvider = types.ref
    dataProvider = types.ref

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
class Datagrid: pass

@Component(path='Module.Admin.TextField')
class TextField:
    source = types.str
    label = types.str

@Component(path='Module.Admin.DateField')
class DateField:
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
