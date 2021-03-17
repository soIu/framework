from .models import Model, Environment
from .fields import Char
from javascript import Object, JSON

def merge(*objects, **options):
    reverse = options.get('reverse', False)
    if reverse: objects.reverse()
    target = objects[0]
    for object in objects[1:]:
        target.update(object)
    return target

def register_models():
    models = Model.__subclasses__()
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

def adapt_object_to_field(type):
    if type in ['char', 'text', 'selection']:
       return '.toString()'
    elif type == 'integer':
       return '.toInteger()'
    elif type == 'float':
       return '.toFloat()'
    elif type == 'boolean':
       return '.toBoolean()'
    #Relational fields, Date, and Datetime need research

model_read_template = """
def read(self):
    values = Global()['Object'].new()
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
        read += '\n' + indent + "values['" + key + "'] = None if self." + key + (" is None else %s" % ('self.{}'.format(key) if field['type'] in ['char', 'text', 'selection'] else 'JSON.fromInteger({})'.format(key) if field['type'] == 'integer' else 'JSON.fromFloat({})'.format(key) if field['type'] == 'float' else 'JSON.fromBoolean({})'.format(key) if field['type'] == 'boolean' else None))
        update += '\n' + indent + "if values['" + key  + "'].type != 'undefined': self." + key + ' = ' + "values['" + key + "']" + adapt_object_to_field(field['type']) + "if values['" + key + ("'].type %s else %s" % ("!= 'random'" if field['type'] in ['char', 'text', 'selection'] else "== 'number'" if field['type'] in ['integer', 'float'] else "== 'boolean'" if field['type'] == 'boolean' else "!= 'random'", field['default'] if field['type'] == 'boolean' else 0 if field['type'] == integer else 0.0 if field['type'] == 'float' else None))
    read += '\n' + indent + 'return values'
    update += '\n' + indent + 'return self'
    namespace = {'Global': Global, 'JSON': JSON}
    exec(read + '\n' + update, namespace)
    model.read = namespace['read']
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

def check_server():
    import os
    return 'server.py' in os.getenv('RPYTHON_TARGET_FILE')
