import tools
import types

def generalize_selection(selection):
    if isinstance(selection, types.GeneratorType):
       selection = list(selection)
       def selection_closure():
           return selection
       return selection_closure
    if callable(selection): return selection
    def selection_closure(): return selection
    return selection_closure

attributes = {'required': False, 'readonly': False, 'default': None, 'compute': None, 'related': None, 'no_offline': False, 'protect': False, 'index': False}

def Char(string, **args):
    return tools.merge_compile({'type': 'char', 'string': string, 'store': args['store'] if 'store' in args else True, 'default': args.get('default', "")}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Text(string, **args):
    return tools.merge_compile({'type': 'text', 'string': string, 'store': args['store'] if 'store' in args else True, 'default': args.get('default', "")}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Integer(string, **args):
    return tools.merge_compile({'type': 'integer', 'string': string, 'store': args['store'] if 'store' in args else True, 'default': args.get('default', 0)}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Float(string, **args):
    return tools.merge_compile({'type': 'float', 'string': string, 'store': args['store'] if 'store' in args else True, 'default': args.get('default', 0.0)}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Boolean(string, **args):
    return tools.merge_compile({'type': 'boolean', 'string': string, 'store': args['store'] if 'store' in args else True, 'default': args.get('default', False)}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Binary(string, **args):
    return tools.merge_compile({'type': 'binary', 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Many2one(relation, string, **args):
    return tools.merge_compile({'type': 'many2one', 'relation': relation, 'ondelete': 'cascade', 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def One2many(relation, inverse, string, **args):
    return tools.merge_compile({'type': 'one2many', 'relation': relation, 'ondelete': 'cascade', 'default': args.get('default', []), 'inverse': inverse, 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Many2many(relation, string, **args):
    return tools.merge_compile({'type': 'many2many', 'relation': relation, 'ondelete': 'cascade', 'default': args.get('default', []), 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def One2one(relation, string, **args):
    return tools.merge_compile({'type': 'one2one', 'relation': relation, 'ondelete': 'cascade', 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Selection(selection, string, **args):
    return tools.merge_compile({'type': 'selection', 'selection': generalize_selection(selection), 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Date(string, **args):
    return tools.merge_compile({'type': 'date', 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

def Datetime(string, **args):
    return tools.merge_compile({'type': 'datetime', 'string': string, 'store': args['store'] if 'store' in args else True}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)

#We'll decide if we support storing raw JSON
#def Data(string, **args):
#    return tools.merge_compile({'type': 'data', 'string': string, 'store': args['store'] if 'store' in args else True, 'index_fields': []}, {attribute: args.get(attribute, attributes[attribute]) for attribute in attributes}, reverse=True)
