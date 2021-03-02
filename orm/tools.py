from .models import Model, env

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
            if property.startswith('__'): continue
            value = model.__dict__[property]
            if callable(value): continue
            if type(value) == dict and all(key in value for key in ['string', 'required', 'readonly', 'protect', 'no_offline']):
               fields[property] = value
               setattr(model, property, value['default'])
        model.fields = fields
