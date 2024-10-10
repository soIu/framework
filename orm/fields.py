attributes = ['required', 'readonly', 'defaults', 'compute', 'related', 'no_offline', 'protect']

class Field:
    def __init__(self, fields):
        for key in dict(fields):
            self[key] = fields[key]

def field_factory(*args): return new (Field(Object.assign(*args.reverse())))

def Char(string, **params):
    return field_factory({'type': 'char', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Text(string, **params):
    return field_factory({'type': 'text', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Integer(string, **params):
    return field_factory({'type': 'integer', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True, 'defaults': params.defaults or 0}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Float(string, **params):
    return field_factory({'type': 'float', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True, 'defaults': params.defaults or 0.0}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

#While javascript have the same Number type for integer and float, we will differentiate them for data-storing purposes. Integer will be stored with parseInt and float will be stored with parseFloat

def Boolean(string, **params):
    return field_factory({'type': 'boolean', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True, 'defaults': params.defaults or False}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Binary(string, **params):
    return field_factory({'type': 'binary', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Many2one(relation, string, **params):
    return field_factory({'type': 'many2one', 'relation': relation, 'ondelete': 'cascade', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def One2many(relation, inverse, string, **params):
    return field_factory({'type': 'one2many', 'relation': relation, 'ondelete': 'cascade', 'defaults': params.defaults or [], 'inverse': inverse, 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Many2many(relation, string, **params):
    return field_factory({'type': 'many2many', 'relation': relation, 'ondelete': 'cascade', 'defaults': params.defaults or [], 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

#This only exists in pouchdb-relational, maybe we should retire this

#def One2one(relation, string, **params):
#    return field_factory({'type': 'one2one', 'relation': relation, 'ondelete': 'cascade', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Selection(selection, **params):
    return field_factory({'type': 'selection', 'selection': selection, 'string': params.string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Date(string, **params):
    return field_factory({'type': 'date', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

def Datetime(string, **params):
    return field_factory({'type': 'datetime', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

#Add fields.Data for storing JSON
def Data(string, **params):
    return field_factory({'type': 'data', 'string': string, 'store': params.store if 'store' in params else True, 'index': params.index if 'index' in params else True, 'index_fields': []}, Object.fromEntries([[attribute, params[attribute] or None] for attribute in Object.keys(attributes)]))

__all__ = ['Field', 'Char', 'Text', 'Integer', 'Float', 'Boolean', 'Binary', 'Many2one', 'One2many', 'Many2many', 'Selection', 'Date', 'Datetime', 'Data']
__default__ = {'Field': Field, 'Char': Char, 'Text': Text, 'Integer': Integer, 'Float': Float, 'Boolean': Boolean, 'Binary': Binary, 'Many2one': Many2one, 'One2many': One2many, 'Many2many': Many2many, 'Selection': Selection, 'Date': Date, 'Datetime': Datetime, 'Data': Data}
