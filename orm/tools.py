from javascript import JSON, Object, Function
from . import configuration

import models as orm_models
import fields as orm_fields

def merge_compile(*objects, **options):
    reverse = options.get('reverse', False)
    if reverse:
       objects = list(objects)
       objects.reverse()
    target = objects[0]
    for object in objects[1:]:
        target.update(object)
    return target

def merge(*items):
    objects = list(items)
    target = objects[0]
    for object in objects[1:]:
        target.update(object)
    return target

class Field:
    def __init__(self, kwargs):
        self.__dict__ = kwargs

class SelectionField(Field):

    def selection(self):
        return []

class RelationalField(Field):

    relation = ''
    ondelete = ''

class InversedRelationalField(Field):

    relation = ''
    ondelete = ''
    inverse = ''

def register_models():
    Char = orm_fields.Char
    Environment = orm_models.Environment
    models = orm_models.Model.__subclasses__()
    for model in models:
        fields = {}
        for property in model.__dict__:
            if property.startswith('_'): continue
            value = model.__dict__[property]
            if callable(value): continue
            if type(value) == dict and all(key in value for key in ['string', 'required', 'readonly', 'protect', 'no_offline']):
               fields[property] = value
               fields[property]['name'] = property
               setattr(model, property, value['default'])
        if not fields:
           fields['name'] = Char(string='Name')
           fields['name']['name'] = 'name'
        model._fields = fields
        model._model = model
        Environment.models[model._name] = model
        configure_model(model)
        model._fields = fields.keys()
        model._fields_object = {}
        for field in fields:
            FieldClass = SelectionField if fields[field]['type'] == 'selection' else RelationalField if fields[field]['type'] in ['many2one', 'one2one', 'many2many'] else InversedRelationalField if fields[field]['type'] == 'one2many' else Field
            model._fields_object[field] = FieldClass(fields[field])

def adapt_object_to_field(type):
    if type in ['char', 'text', 'selection', 'many2one', 'one2one']:
       return '.toString()'
    elif type == 'integer':
       return '.toInteger()'
    elif type == 'float':
       return '.toFloat()'
    elif type == 'boolean':
       return '.toBoolean()'
    elif type in ['date', 'datetime']:
       return "['toISOString'].call().toString()"
    #Relational fields, Date, and Datetime need research

model_read_template = """
def read_singleton(self):
    values = Global()['Object'].new()
    values['id'] = self.id
"""

model_update_template = """
def update(self, values):
"""

def configure_model(model):
    read = model_read_template
    update = model_update_template
    indent = ' ' * 4
    for key in model._fields:
        field = model._fields[key]
        read += '\n' + indent + "values['" + key + "'] = None if self." + key + (" is None else %s" % ('self.{}'.format(key) if field['type'] in ['char', 'text', 'selection', 'many2one', 'one2one', 'date', 'datetime'] else 'JSON.fromInteger({})'.format(key) if field['type'] == 'integer' else 'JSON.fromFloat({})'.format(key) if field['type'] == 'float' else 'JSON.fromBoolean({})'.format(key) if field['type'] == 'boolean' else None))
        if field['type'] in ['one2many', 'many2many']: continue
        update += '\n' + indent + "if values['" + key  + "'].type != 'undefined': self." + key + ' = ' + "values['" + key + "']" + adapt_object_to_field(field['type']) + "if values['" + key + ("'].type %s else %s" % ("!= 'random'" if field['type'] in ['char', 'text', 'selection', 'many2one', 'one2one'] else "== 'number'" if field['type'] in ['integer', 'float'] else "== 'boolean'" if field['type'] == 'boolean' else "== 'object' and values['" + key + "']['toISOString'].type == 'function'" if field['type'] in ['date', 'datetime'] else "!= 'random'", field['default'] if field['type'] == 'boolean' else 0 if field['type'] == 'integer' else 0.0 if field['type'] == 'float' else "values['" + key + "'].toString() if values['" + key + "'].type == 'string' else None" if field['type'] in ['date', 'datetime'] else None))
    read += '\n' + indent + 'return values'
    update += '\n' + indent + 'return self'
    namespace = {'Global': Global, 'JSON': JSON}
    exec(read + '\n' + update, namespace)
    model.read_singleton = namespace['read_singleton']
    model.update = namespace['update']

class Cache:
    global_object = None

cache = Cache()

def get_global():
    if cache.global_object is not None: return cache.global_object
    window = Object.get('window')
    if window.type != 'undefined':
       cache.global_object = window.keep()
       return window
    self = Object.get('self')
    if self.type != 'undefined':
       cache.global_object = self.keep()
       return self
    require = Object.get('require').toFunction()
    cache.global_object = require('./global.js').keep()
    return cache.global_object

Global = get_global

def id_to_pouch_id(id, model):
    return 'orm_records:' + model + ':' + id

def generate_static_closures():

    import os
    server = 'server.py' in os.getenv('RPYTHON_TARGET_FILE')

    def is_server():
        return server

    def is_client():
        return not server

    return is_server, is_client

is_server, is_client = generate_static_closures()

check_server = is_server
check_client = is_client

if is_client() and configuration.server_db_adapter == 'http': configuration.server_db_url = ""

def empty_promise():
    return Global()['Promise'].new(JSON.fromFunction(empty_promise_handle))

@Function
def empty_promise_handle(args):
    assert args is not None and len(args) >= 1
    args[0].call()

def create_promise():
    object = Global()['Object'].new()
    promise = Global()['Promise'].new(Object.createClosure(create_promise_handle, object).toRef())
    return promise, object['resolve']

@Function
def create_promise_handle(args):
    assert args is not None and len(args) >= 2
    object = args[0]
    object['resolve'] = args[1].toRef()

highest_char = '\xef\xbf\xb0'
