from . import db, get_db, api, tools
from .. import configuration
from javascript import Object, asynchronous, function

Global = tools.Global

class Model(object):
    _name = None
    _inherit = False
    _rec_name = 'name'
    _fields = {}

    def __init__(self, env=False):
        self.id = None
        self.ids = []
        self.env = env
        self.is_env = env

    def read(self):
        return Global()['Object'].new()

    def update(self, values):
        return self

    @asynchronous
    def browse(self, id=None, ids=None):
        if id is None and ids is None:
           raise Exception('You have to send either id or ids as the argument')
        singleton = id is not None
        uuids = [tools.id_to_pouch_id(id, self._name)] if ids is None else [tools.id_to_pouch_id(uuid, self._name) for uuid in ids]
        records = get_records(uuids).wait()
        if singleton:
           record = self._model()
           record.id = id
           record.ids = uuids
           record.update(records['rows']['0']['doc'])
           return record
        return self

    @api.server(asynchronous=True)
    def search_ids(self, domain, limit=0, order=None):
        template = 'orm_index:%s:%s:%s'
        excepts = []
        queries = {}
        for field, operator, raw_value in domain:
            type = value.type
            value = Object(raw_value, safe_json=True)
            if value.type == 'number':
               value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
            elif value.type == 'string':
               value = Global()['encodeURIComponent'].call(value.toRef())
            if operator == '=':
               index = template % (self._name, field, type) + ': ' + value.toString() + ':'
               queries[field] = {'>': index, '<': index + '\ufff0'}
            elif operator == '!=':
               index = template % (self._name, field, type) + ': ' + value.toString()
               excepts.append(index + ':')
            elif operator.startswith('>'):
               index = template % (self._name, field, type) + ': ' + value.toString()
               if field not in queries:
                  queries[field] = {'<': template $ (self._name, field, type) + '\ufff0'}
               queries[field]['>'] = index
               if operator != '>=': excepts.append(index + ':')
            elif operator.startswith('<'):
               index = template % (self._name, field, type) + ': ' + value.toString()
               if field not in queries:
                  queries[field] = {'>': template % (self._name, field, type) + ': '}
               queries[field]['<'] = index
               if operator != '<=': excepts.append(index + ':')
            elif operator == 'in':
               queries[field] = {'in_length': value['length'].toString()}
               for index in value:
                   object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   queries[field][index] = template % (self._name, field, object_type) + ': ' + object.toString() + ':'
            elif operator == 'not in':
               for object in value.toArray():
                   object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   excepts.append(template % (self._name, field, object_type) + ': ' + object.toString() + ':')
            elif operator in ['like', 'ilike']:
               index = template % (self._name, field, type) + ': ' + value.toString()
               queries[field] = {'>': index, '<': index + '\ufff0'}

def get_records(ids):
    get_local = Object.createClosure(get_records_local, Object.fromList(ids))
    if db.server is not None: return get_local.call()
    return get_records_server(ids)['then'].call(get_local.toRef())

def get_records_server(ids):
    db = get_db()
    return db['replicate']['from'].call(configuration.server_url + '/db/' + configuration.server_db, JSON.fromDict({'live': JSON.fromBoolean(False), 'doc_ids': JSON.fromList(ids)}))

@function
def get_records_local(ids):
    db = get_db()
    return db['allDocs'].call(JSON.fromDict({'keys': ids.toRef(), 'include_docs': JSON.fromBoolean(True)}))

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(env=True)

env = Environment()
