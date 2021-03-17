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
        excepts = {}
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
               excepts[index + ':'] = 0
            elif operator.startswith('>'):
               index = template % (self._name, field, type) + ': ' + value.toString()
               if field not in queries:
                  queries[field] = {'<': template $ (self._name, field, type) + '\ufff0'}
               queries[field]['>'] = index
               if operator != '>=': excepts[index + ':'] = 0
            elif operator.startswith('<'):
               index = template % (self._name, field, type) + ': ' + value.toString()
               if field not in queries:
                  queries[field] = {'>': template % (self._name, field, type) + ': '}
               queries[field]['<'] = index
               if operator != '<=': excepts[index + ':'] = 0
            elif operator == 'in':
               queries[field] = {'in_length': value['length'].toString()}
               for index in value:
                   object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   queries[field][str(index)] = template % (self._name, field, object_type) + ': ' + object.toString() + ':'
            elif operator == 'not in':
               for object in value.toArray():
                   object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   excepts[template % (self._name, field, object_type) + ': ' + object.toString() + ':'] = 0
            elif operator in ['like', 'ilike']:
               index = template % (self._name, field, type) + ': ' + value.toString()
               queries[field] = {'>': index, '<': index + '\ufff0'}
        db = get_db()
        get_indexes = None
        get_excepts = None
        if len(queries):
           promises = Global()['Array'].new()
           for field in queries:
               query = queries[field]
               if 'in_length' in query:
                  in_query = []
                  for index in range(int(query['in_length'])):
                      value = query[str(index)]
                      in_query += [{'>': value, '<': value + '\ufff0'}]
                  promise = get_index(in_query, mode='or')
                  promises['push'].call(promise.toRef())
               else:
                  promises['push'].call(get_index([query], handle=False)['0'].toRef())
           mode = Object.fromString('and')
           get_indexes = Global()['Promise']['all'].call(promises.toRef())['then'].call(Object.createClosure(get_index_handle, mode).toRef())
        else:
           key = 'orm_records:%s:' % (self._name)
           get_indexes = db['allDocs'].call(JSON.fromDict({'startkey': key, 'endkey': key + '\ufff0'}))
        if len(excepts):
           get_excepts = get_index([{'>': key, '<': key + '\ufff0'} for key in excepts], mode='or')
        else:
           get_excepts = tools.empty_promise()
        results = get_indexes.wait()
        excepts = get_excepts.wait()
        ids = []
        except_ids = {}
        if excepts.type != 'undefined':
           for row in excepts['rows'].toArray():
               except_ids[row['id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0']] = 0
        for row in results['rows'].toArray():
            id = row['id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0']
            if id in except_ids: continue
            ids += [id]
            if limit and len(ids) == limit: break
        return ids

def get_index(queries, mode='and', handle=True):
    db = get_db()
    Promise = Global()['Promise']
    promises = Object.fromList([db['allDocs'].call(JSON.fromDict({'startkey': query['>'], 'endkey': query['<']})).toRef() for query in queries])
    if not handle: return promises
    return Promise['all'].call(promises.toRef())['then'].call(Object.createClosure(get_index_handle, Object.fromString(mode)).toRef())

@function
def get_index_handle(mode, results):
    mode = mode.toString()
    if mode == 'or':
       new_result = Global()['Object'].new()
       new_result['rows'] = JSON.fromList([])
       rows = new_result['rows']
       for result in results.toArray():
           rows['push']['apply'].call(None, result['rows'].toRef())
       return new_result

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
