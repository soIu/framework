from . import db, get_db, api, tools, configuration
from javascript import JSON, Object, asynchronous, function

Global = tools.Global

def get_records(ids):
    get_local = Object.createClosure(get_records_local, Object.fromList(ids))
    if tools.check_server(): return get_local.call()
    return get_records_server(ids)['then'].call(get_local.toRef())

def get_records_server(ids):
    db = get_db()
    return db['replicate']['from'].call(configuration.server_url + '/db/' + configuration.server_db, JSON.fromDict({'live': JSON.fromBoolean(False), 'doc_ids': JSON.fromList(ids)}))

@function
def get_records_local(ids):
    db = get_db()
    return db['allDocs'].call(JSON.fromDict({'keys': ids.toRef(), 'include_docs': JSON.fromBoolean(True)}))

def get_index(queries, mode='and', handle=True):
    db = get_db()
    Promise = Global()['Promise']
    promises = Object.fromList([db['allDocs'].call(JSON.fromDict({'startkey': query['>'], 'endkey': query['<']})).toRef() for query in queries])
    if not handle: return promises
    return Promise['all'].call(promises.toRef())['then'].call(Object.createClosure(get_index_handle, Object.fromString(mode)).toRef())

@function
def get_index_handle(mode, results):
    mode = mode.toString()
    new_result = Global()['Object'].new()
    new_result['rows'] = JSON.fromList([])
    rows = new_result['rows']
    if mode == 'or':
       for result in results.toArray():
           rows['push']['apply'].call(None, result['rows'].toRef())
       return new_result
    length = results['length'].toInteger()
    ids = {}
    for result in results.toArray():
        for row in result['rows'].toArray():
            id = row['id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
            if id not in ids: ids[id] = 0
            ids[id] += 1
            if ids[id] == length: rows['push'].call(row.toRef())
    return new_result

def set_index(model, field, type, value, id):
    if value.type == 'number':
       value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
    elif value.type == 'string':
       value = Global()['encodeURIComponent'].call(value.toRef())
    index = 'orm_index:%s:%s:%s: %s:%s' % (model, field, type, value.toString(), id)
    return Object.createClosure(set_index_handle, Object.fromString(index))

@function
def set_index_handle(index):
    db = get_db()
    return db['put'].call(JSON.fromDict({'_id': index.toRef()}))

def del_index(model, field, type, value, id):
    if value.type == 'number':
       value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
    elif value.type == 'string':
       value = Global()['encodeURIComponent'].call(value.toRef())
    index = 'orm_index:%s:%s:%s: %s:%s' % (model, field, type, value.toString(), id)
    db = get_db()
    return db['get'].call(index)['then'].call(JSON.fromFunction(del_index_handle))

@function
def del_index_handle(doc):
    db = get_db()
    return db['remove'].call(doc.toRef())

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
        self._records = []
        self._length = 0
        #self._mapped_records = {}

    def __iter__(self):
        if self._length == 0: return iter([])
        if self._length == 1: return iter([self])
        return iter(self._records)

    def __len__(self): return self._length

    def read(self):
        return Global()['Object'].new()

    def update(self, values):
        return self

    @asynchronous
    def browse(self, id=None, ids=None):
        if id is None and ids is None:
           #raise Exception('You have to send either id or ids as the argument')
           record = self._model()
           record._length = 1
           return record
        singleton = id is not None
        uuids = [tools.id_to_pouch_id(id, self._name)] if ids is None else [tools.id_to_pouch_id(uuid, self._name) for uuid in ids]
        records = get_records(uuids).wait()
        length = records['rows']['length'].toInteger()
        if not length: return self._model()
        if singleton:
           record = self._model()
           record.id = id
           record.ids = [id]
           record.update(records['rows']['0']['doc'])
           record._length = 1
           return record
        recordset = self._model()
        for row in records['rows'].toArray():
            doc = row['doc']
            record = self._model()
            record.id = doc['_id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
            record.ids = [record.id]
            record.update(doc)
            record._length = 1
            recordset._records += [record]
        return recordset

    @asynchronous
    def search(self, domain, limit=0, order=None):
        ids = self.search_ids(domain, limit, order).wait()
        uuids = [tools.id_to_pouch_id(uuid, self._name) for uuid in ids]
        records = get_records(uuids).wait()
        length = records['rows']['length'].toInteger()
        if not length: return self._model()
        if limit == 1 or length == 1:
           doc = records['rows']['0']['doc']
           record = self._model()
           record.id = doc['_id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
           record.ids = [record.id]
           record.update(doc)
           record._length = len(record.ids)
           return record
        recordset = self._model()
        for row in records['rows'].toArray():
            doc = row['doc']
            record = self._model()
            record.id = doc['_id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
            record.ids = [record.id]
            record.update(doc)
            record._length = 1
            recordset._records += [record]
        return recordset

    @api.server(asynchronous=True, client=False)
    def search_ids(self, domain, limit=0, order=None):
        template = 'orm_index:%s:%s:%s'
        excepts = {}
        queries = {}
        for field, operator, raw_value in domain:
            value = Object(raw_value, safe_json=True)
            type = value.type
            if value.type == 'number':
               value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
            elif value.type == 'string':
               value = Global()['encodeURIComponent'].call(value.toRef())
            if operator == '=':
               index = template % (self._name, field, type) + ': ' + value.toString() + ':'
               queries[field] = {'>': index, '<': index + tools.highest_char}
            elif operator == '!=':
               index = template % (self._name, field, type) + ': ' + value.toString()
               excepts[index + ':'] = 0
            elif operator.startswith('>'):
               index = template % (self._name, field, type) + ': ' + value.toString()
               if field not in queries:
                  queries[field] = {'<': template % (self._name, field, type) + tools.highest_char}
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
                   elif object.type == 'string':
                      object = Global()['encodeURIComponent'].call(object.toRef())
                   queries[field][str(index)] = template % (self._name, field, object_type) + ': ' + object.toString() + ':'
            elif operator == 'not in':
               for object in value.toArray():
                   #object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   elif object.type == 'string':
                      object = Global()['encodeURIComponent'].call(object.toRef())
                   excepts[template % (self._name, field, object_type) + ': ' + object.toString() + ':'] = 0
            elif operator in ['like', 'ilike']:
               index = template % (self._name, field, type) + ': ' + value.toString()
               queries[field] = {'>': index, '<': index + tools.highest_char}
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
                      in_query += [{'>': value, '<': value + tools.highest_char}]
                  promise = get_index(in_query, mode='or')
                  promises['push'].call(promise.toRef())
               else:
                  promises['push'].call(get_index([query], handle=False)['0'].toRef())
           mode = Object.fromString('and')
           get_indexes = Global()['Promise']['all'].call(promises.toRef())['then'].call(Object.createClosure(get_index_handle, mode).toRef())
        else:
           key = 'orm_records:%s:' % (self._name)
           get_indexes = db['allDocs'].call(JSON.fromDict({'startkey': key, 'endkey': key + tools.highest_char}))
        if len(excepts):
           get_excepts = get_index([{'>': key, '<': key + tools.highest_char} for key in excepts], mode='or')
        else:
           get_excepts = tools.empty_promise()
        results = get_indexes.wait()
        exceptions = get_excepts.wait()
        ids = []
        except_ids = {}
        if exceptions.type != 'undefined':
           for row in exceptions['rows'].toArray():
               except_ids[row['id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()] = 0
        for row in results['rows'].toArray():
            id = row['id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
            if id in except_ids: continue
            ids += [id]
            if limit and len(ids) == limit: break
        return ids

    def create(self, values=None):
        return self.create_server(values)

    @api.server(asynchronous=True, client=False)
    def create_server(self, values):
        if values is None:
           values = self.read()
        else:
           merge = Global()['Object']['assign'].toFunction()
           current_values = self.read()
           values = merge(current_values.toRef(), values.toRef())
        is_array = values.type == 'array'
        length = 1 if not is_array else values['length'].toInteger()
        if not is_array:
           values = Object.fromList([values.toRef()])
        require = Object.get('require').toFunction()
        indexes = []
        ids = []
        for value in values.toArray():
            id = require('./utils/generate-pouch-id.js').call().toString()
            for key in value:
                object = value[key]
                indexes += [set_index(self._name, key, object.type, object, id).keep()]
            pouch_id = tools.id_to_pouch_id(id, self._name)
            value['_id'] = pouch_id
            ids += [id]
        db = get_db()
        db['bulkDocs'].call(values.toRef()).wait()
        for index in indexes: index.release().call()
        #Global()['Promise'].new(JSON.fromList([index.release().call() for index in indexes])).wait()
        if length == 1:
           record = self._model()
           assert len(ids) >= 1
           record.id = ids[0]
           record.ids = ids
           record.update(values['0'])
           record._length = len(record.ids)
           return record
        recordset = self._model()
        for value in values.toArray():
            record = self._model()
            record.id = value['_id']['split'].call(':')['slice'].call(JSON.fromInteger(-1))['0'].toString()
            record.ids = [record.id]
            record.update(value)
            record._length = 1
            recordset._records += [record]
        return recordset

    def write(self, values=None):
        return self.write_server(values)

    @api.server(asynchronous=True, client=False)
    def write_server(self, values):
        if values is None:
           values = self.read()
        else:
           merge = Global()['Object']['assign'].toFunction()
           current_values = self.read()
           values = merge(current_values.toRef(), values.toRef())
        is_array = values.type == 'array'
        length = 1 if not is_array else values['length'].toInteger()
        if not is_array:
           values = Object.fromList([values.toRef()])
        require = Object.get('require').toFunction()
        records = get_records([tools.id_to_pouch_id(id, self._name) for id in self.ids]).wait()
        set_indexes = []
        del_indexes = []
        json = Global()['JSON']
        for index in range(self._length):
            value = values[str(index)]
            record = records[str(index)]
            id = self._records[index].id
            for key in self._fields:
                value_object = value[key]
                record_object = record[key]
                if value_object.type == 'undefined':
                   value[key] = record_object.toRef()
                   continue
                if json['stringify'].call(value_object.toRef()).toString() != json['stringify'].call(record_object.toRef()).toString():
                   set_indexes += [set_index(self._name, key, value_object.type, value_object, id).keep()]
                   del_indexes += [del_index(self._name, key, value_object.type, value_object, id).toRef()]
                   record[key] = value_object.toRef()
        Global()['Promise']['all'].call(JSON.fromList(del_indexes)).wait()
        #TODO
        db = get_db()
        db['bulkDocs'].call(values.toRef()).wait()
        for index in set_indexes: index.release().call()
        #Global()['Promise'].new(JSON.fromList([index.release().call() for index in indexes])).wait()
        if self._length == 1:
           record = self
           record.update(values['0'])
           return record
        recordset = self._model()
        for index, record in enumerate(self):
            value = values[str(index)]
            record.update(value)
        return recordset

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(env=True)

env = Environment()
