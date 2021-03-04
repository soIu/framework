from .models import Model, Environment
from .fields import Char
from javascript import Object

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

def adapt_type(type):
    if type in ['char', 'text', 'selection']:
       return '.toString()'
    elif type == 'integer':
       return '.toInteger()'
    elif type == 'float':
       return '.toFloat()'
    elif type == 'boolean':
       return '.toBoolean()'
    #Relational fields, Date, and Datetime need research

model_update_template = """
def update(self, values):
"""

def configure_model(model):
    template = model_update_template
    indent = ' ' * 4
    for key in model._fields:
        field = model._fields[key]
        template += '\n' + indent + "if values['" + key  + "'].type != 'undefined': self." + key + ' = ' + "values['" + key + "']" + adapt_type(field['type']) + "if values['" + key + ("'].type %s else %s") % ("!= 'random'" if field['type'] in ['char', 'text', 'selection'] else "== 'number'" if field['type'] in ['integer', 'float'] else "== 'boolean'" if field['type'] == 'boolean' else "!= 'random'", field['default'] if field['type'] == 'boolean' else 0 if field['type'] == integer else 0.0 if field['type'] == 'float' else None)
    template += '\n' + indent + 'return self'
    namespace = {}
    exec(template, namespace)
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
