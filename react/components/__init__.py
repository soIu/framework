from react import Component, Text
from javascript import types

@Component(path='Module.Admin.Admin')
class Admin:
    theme = types.dict
    authProvider = types.dict
    dataProvider = types.dict

@Component(path='Module.Admin.Resource')
class Resource:
    name = types.str
    list = types.ref
    create = types.ref
    edit = types.ref
    show = types.ref
    options = types.dict
