from . import db, get_db, api, tools, configuration
from javascript import JSON, Error, asynchronous, function, Object as JavascriptObject
from typing import Object, Function, String, Integer, List

Global = tools.Global

Promise = Object({
  #'all': Function,
  'then': Function,
})

Coroutine = Promise

def get_records(ids):
    get_local = Object.createClosure(get_records_local, Object.fromList(ids))
    if tools.check_server(): return get_local.call()
    return Promise(get_records_server(ids)).then(get_local.toRef())

def get_records_server(ids):
    db = get_db()
    return db.replicate['from'].call(configuration.server_url + '/db/' + configuration.server_db, JSON.fromDict({'live': JSON.fromBoolean(False), 'doc_ids': JSON.fromList(ids)})) #['catch'].call(Global().console.error.toRef())

@function
def get_records_local(ids):
    db = get_db()
    return db.allDocs(JSON.fromDict({'keys': ids.toRef(), 'include_docs': JSON.fromBoolean(True)}))

def get_index(queries, mode='and', handle=True):
    db = get_db()
    Promise = Global().Promise
    promises = Object.fromList([db.allDocs(JSON.fromDict({'startkey': query['>'], 'endkey': query['<']})).toRef() for query in queries])
    if not handle: return promises
    return Coroutine(Promise.all(promises.toRef())).then(Object.createClosure(get_index_handle, Object.fromString(mode)).toRef())

Result = Object({
  'rows': Object,
})

Rows = Object({
  'push': Object({
    'apply': Function,
  })
})

Row = Object({
  'id': Object({
    'split': Function,
  })
})

Array = Object({
  'slice': Function,
  'push': Function,
})

@function
def get_index_handle(mode, results):
    mode = mode.toString()
    new_result = Global().Object.new()
    new_result['rows'] = JSON.fromList([])
    rows = Result(new_result).rows
    if mode == 'or':
       for result in results.toArray():
           Rows(rows).push.apply(None, Result(result).rows.toRef())
       return new_result
    index_results = results.toList()
    length = len(index_results) #results['length'].toInteger()
    ids = {}
    for result in index_results:
        for row in Result(result).rows.toArray():
            id = Array(Row(row).id.split(':')).slice(JSON.fromInteger(-1)).toList()[0].toString()
            if id not in ids: ids[id] = 0
            ids[id] += 1
            if ids[id] == length: Rows(rows).push.apply(None, JSON.fromList([row.toRef()]))
    return new_result

Value = Object({
  'toLowerCase': Function,
})

def set_index(model, field, type, value, id):
    if value.type == 'number':
       value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
    elif value.type == 'string':
       value = Global().encodeURIComponent(Value(value).toLowerCase().toRef())
    index = 'orm_index:%s:%s:%s: %s:%s' % (model, field, type, value.toString(), id)
    return Object.createClosure(set_index_handle, Object.fromString(index))

@function
def set_index_handle(index):
    db = get_db()
    return db.put(JSON.fromDict({'_id': index.toRef()}))

def del_index(model, field, type, value, id):
    if value.type == 'number':
       value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
    elif value.type == 'string':
       #value = Global()['encodeURIComponent'].call(value['toLowerCase'].call().toRef())
       value = Global().encodeURIComponent(Value(value).toLowerCase().toRef())
    index = 'orm_index:%s:%s:%s: %s:%s' % (model, field, type, value.toString(), id)
    db = get_db()
    return Promise(db.get(index)).then(JSON.fromFunction(del_index_handle))

@function
def del_index_handle(doc):
    db = get_db()
    return db.remove(doc.toRef())

Response = Object({
  'json': Function,
})

JSONResult = Object({
  'status': String,
  'message': String,
  'result': List[str],
  'search_total': Integer,
})

@asynchronous
def call_server_orm(path, json):
    stringify = Global().JSON.stringify
    fetch = Global().fetch
    response = fetch(configuration.server_url + path, JSON.fromDict({'body': stringify(json.toRef()).toRef(), 'method': 'POST', 'headers': JSON.fromDict({'Content-Type': 'application/json'})})).wait()
    result = Response(response).json().wait()
    json = JSONResult(result)
    if json.status != 'success':
       Error(json.message)
    return [id for id in json.result], json.search_total if path == '/api/search' else 0

Records = Object({
  'rows': List[Object({
    'doc': Object
  })],
})

Doc = Object({
  '_id': Object({
    'split': Function,
  })
})

JSObject = Object({
  'assign': Function,
})

class Model(object):
    _name = None
    _inherit = False
    _rec_name = 'name'
    _fields = []

    def __init__(self, is_env=False):
        self.id = None
        self.ids = []
        self.env = env
        self.is_env = is_env
        self._records = []
        self._length = 0
        self._search_total = 0
        #self._mapped_records = {}

    def __iter__(self):
        if len(self._records): return iter(self._records)
        if self._length == 1: return iter([self])
        return iter([])

    def __len__(self):
        return len(self._records) or self._length

    def new(self):
        record = self._model()
        record._length = 1
        return record

    def read(self):
        if len(self) < 2: return self.read_singleton()
        array = Global().Array.new()
        for record in self:
            Array(array).push(record.read().toRef())
        return array

    def read_singleton(self):
        return Global().Object.new()

    def update(self, values):
        return self

    def browse(self, id=None, ids=None):
        return self.browse_async(id, ids)

    @asynchronous
    def browse_async(self, id=None, ids=None):
        if id is None and ids is None:
           #raise Exception('You have to send either id or ids as the argument')
           record = self._model()
           record._length = 1 #This is what it does on the old ORM API, maybe we'll drop this in favour of the new method
           return record
        singleton = id is not None
        if singleton:
           ids = [id]
        uuids = [tools.id_to_pouch_id(id, self._name)] if id is not None else [tools.id_to_pouch_id(uuid, self._name) for uuid in ids]
        records_awaited = get_records(uuids).wait()
        records = Records(records_awaited)
        length = len(records.rows) #['rows']['length'].toInteger()
        if not length: return self._model()
        if singleton or len(ids) == 1:
           record = self._model()
           record.id = ids[0]
           record.ids = ids
           assert len(records.rows) >= 1
           record.update(records.rows[0].doc) #['rows']['0']['doc'])
           record._length = 1
           return record
        recordset = self._model()
        for row in records.rows: #['rows'].toArray():
            doc = row.doc #['doc']
            record = self._model()
            record.id = Array(Doc(doc)._id.split(':')).slice(JSON.fromInteger(-1)).toList()[0].toString()
            record.ids = [record.id]
            record.update(doc)
            record._length = 1
            recordset._length += 1
            recordset._records += [record]
            recordset.ids += [record.id]
        return recordset

    def search(self, domain, limit=0, pagination=0, order=None):
        return self.search_async(domain, limit, pagination, order)

    @asynchronous
    def search_async(self, domain, limit=0, pagination=0, order=None):
        search = None
        if tools.check_server():
           search = self.search_ids(domain, limit, pagination, order)
        else:
           search = call_server_orm('/api/search', Object.fromDict({'login': self.env.user.login, 'password': self.env.user.password, 'model': self._name, 'limit': JSON.fromInteger(limit), 'order': order, 'pagination': JSON.fromInteger(pagination), 'domain': JSON.fromList([JSON.fromList([field, operator, raw_value]) for field, operator, raw_value in domain])}))
        search_ids = search.wait()
        ids, total = search_ids
        records = self.browse(ids=ids).wait()
        records._search_total = total
        return records

    @api.server(asynchronous=True, client=False)
    def search_ids(self, domain, limit=0, pagination=0, order=None):
        template = 'orm_index:%s:%s:%s'
        excepts = {}
        queries = {}
        for field, operator, raw_value in domain:
            value = JavascriptObject(raw_value, safe_json=True)
            type = value.type
            if value.type == 'number':
               value = Object.get('require').call('./utils/indexable-number.js').call(value.toRef())
            elif value.type == 'string' and field != 'id':
               value = Global().encodeURIComponent(Value(value).toLowerCase().toRef())
            if operator == '=':
               index = template % (self._name, field, type) + ': ' + value.toString() + ':'
               if field == 'id':
                  index = 'orm_records:%s:%s' % (self._name, value.toString())
               queries[field] = {'>': index, '<': index + tools.highest_char}
            elif operator == '!=':
               index = template % (self._name, field, type) + ': ' + value.toString() + ':'
               if field == 'id':
                  index = 'orm_records:%s:%s' % (self._name, value.toString())
               excepts[index] = 0
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
               for index, object in enumerate(value.toList()):
                   #object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   elif object.type == 'string' and field != 'id':
                      object = Global().encodeURIComponent(Value(object).toLowerCase().toRef())
                   if field != 'id': queries[field][str(index)] = template % (self._name, field, object_type) + ': ' + object.toString() + ':'
                   else: queries[field][str(index)] = 'orm_records:%s:%s' % (self._name, object.toString())
            elif operator == 'not in':
               for object in value.toArray():
                   #object = value[index]
                   object_type = object.type
                   if object.type == 'number':
                      object = Object.get('require').call('./utils/indexable-number.js').call(object.toRef())
                   elif object.type == 'string' and field != 'id':
                      object = Global().encodeURIComponent(Value(object).toLowerCase().toRef())
                   if field != 'id': excepts[template % (self._name, field, object_type) + ': ' + object.toString() + ':'] = 0
                   else: excepts['orm_records:%s:%s' % (self._name, object.toString())] = 0
            elif operator in ['like', 'ilike']:
               index = template % (self._name, field, type) + ': ' + value.toString()
               queries[field] = {'>': index, '<': index + tools.highest_char}
        db = get_db()
        get_indexes = None
        get_excepts = None
        if len(queries):
           promises = Global().Array.new()
           for field in queries:
               query = queries[field]
               if 'in_length' in query:
                  in_query = []
                  for index in range(int(query['in_length'])):
                      value = query[str(index)]
                      in_query += [{'>': value, '<': value + tools.highest_char}]
                  promise = get_index(in_query, mode='or')
                  Array(promises).push(promise.toRef())
               else:
                  Array(promises).push(get_index([query], handle=False).toList()[0].toRef())
           mode = Object.fromString('and')
           get_indexes = Promise(Global().Promise.all(promises.toRef())).then(Object.createClosure(get_index_handle, mode).toRef())
        else:
           key = 'orm_records:%s:' % (self._name)
           get_indexes = db.allDocs(JSON.fromDict({'startkey': key, 'endkey': key + tools.highest_char}))
        if len(excepts):
           get_excepts = get_index([{'>': key, '<': key + tools.highest_char} for key in excepts], mode='or')
        else:
           get_excepts = tools.empty_promise()
        results = get_indexes.wait()
        exceptions = get_excepts.wait()
        ids = []
        except_ids = {}
        if exceptions.type != 'undefined':
           for row in Result(exceptions).rows.toList():
               except_ids[Array(Row(row).id.split(':')).slice(JSON.fromInteger(-1)).toList()[0].toString()] = 0
        rows = Result(results).rows.toList() #if not pagination or not limit else results['rows']['slice'].call(JSON.fromInteger((pagination - 1) * limit), JSON.fromInteger(pagination * limit)).toArray()
        for row in rows:
            id = Array(Row(row).id.split(':')).slice(JSON.fromInteger(-1)).toList()[0].toString()
            if id in except_ids: continue
            ids += [id]
            #if limit and len(ids) == limit: break
        search_total = len(ids)
        if limit:
           if not pagination:
              assert limit >= 0
              ids = ids[0:limit]
           else:
              start = limit * (pagination - 1)
              end = limit * pagination
              assert start >= 0
              assert end >= 0
              ids = ids[start:end]
        return ids, search_total

    def create(self, values=None):
        if not tools.check_server(): return self.create_client(values)
        return self.create_server(values)

    @api.client(asynchronous=True, server=False)
    def create_client(self, values):
        if values is None:
           values = self.read()
        else:
           merge = JSObject(Global().Object).assign
           current_values = self.read()
           values = merge(current_values.toRef(), values.toRef())
        call = call_server_orm('/api/create', Object.fromDict({'login': self.env.user.login, 'password': self.env.user.password, 'model': self._name, 'values': values.toRef()})).wait()
        ids, total = call
        records = self.browse(ids=ids).wait()
        return records

    @api.server(asynchronous=True, client=False)
    def create_server(self, values):
        if values is None:
           values = self.read()
        else:
           merge = JSObject(Global().Object).assign
           current_values = self.read()
           values = merge(current_values.toRef(), values.toRef())
        is_array = values.type == 'array'
        length = 1 if not is_array else len(values.toList())
        if not is_array:
           values = Object.fromList([values.toRef()])
        require = Object.get('require').toFunction()
        indexes = []
        ids = []
        for item in values.toList():
            id = require('./utils/generate-pouch-id.js').call().toString()
            value = item.toDict()
            for key in value:
                object = value[key]
                indexes += [set_index(self._name, key, object.type, object, id).keep()]
            pouch_id = tools.id_to_pouch_id(id, self._name)
            item['_id'] = pouch_id
            ids += [id]
        db = get_db()
        db.bulkDocs(values.toRef()).wait()
        for index in indexes: index.release().call()
        #Global()['Promise'].new(JSON.fromList([index.release().call() for index in indexes])).wait()
        if length == 1:
           record = self._model()
           assert len(ids) >= 1
           record.id = ids[0]
           record.ids = ids
           record.update(values.toList()[0])
           record._length = len(record.ids)
           return record
        recordset = self._model()
        for value in values.toList():
            record = self._model()
            record.id = Array(Doc(value)._id.split(':')).slice(JSON.fromInteger(-1)).toList()[0].toString()
            record.ids = [record.id]
            record.update(value)
            record._length = 1
            recordset._records += [record]
        return recordset

    def write(self, values=None):
        if not tools.check_server(): return self.write_client(values)
        return self.write_server(values)

    @api.client(asynchronous=True, server=False)
    def write_client(self, values):
        if values is None:
           values = self.read()
        call = call_server_orm('/api/write', Object.fromDict({'login': self.env.user.login, 'password': self.env.user.password, 'model': self._name, 'ids': JSON.fromList(self.ids), 'values': values.toRef()})).wait()
        ids, total = call
        records = self.browse(ids=ids).wait()
        return records

    @api.server(asynchronous=True, client=False)
    def write_server(self, write_values):
        values = write_values
        if values is None:
           values = self.read()
        else:
           merge = JSObject(Global().Object).assign
           is_array = False
           if values.type == 'array': #Global()['Array']['isArray'].call(values.toRef()):
              is_array = True
              if len(self) == 1:
                 values = values.toList()[0]
           if len(self) > 1:
              index = 0
              new_values = Global().Array.new()
              for record in self:
                  new_values[str(index)] = merge(record.read().toRef(), values.unsafe_get_item(str(index)).toRef() if is_array else values.toRef()).toRef()
                  index += 1
              values = new_values
           else:
              current_values = self.read()
              values = merge(current_values.toRef(), values.toRef())
        is_array = values.type == 'array'
        length = 1 if not is_array else values.unsafe_get_item('length').toInteger()
        if not is_array:
           values = Object.fromList([values.toRef()])
        require = Object.get('require').toFunction()
        records = get_records([tools.id_to_pouch_id(id, self._name) for id in self.ids]).wait()
        set_indexes = []
        del_indexes = []
        JSON = Global().JSON
        recordsets = [record for record in self]
        for index in range(self._length):
            value = values[str(index)]
            #row = records['rows'][str(index)]
            record = records['rows'][str(index)]['doc']
            id = recordsets[index].id
            value['_id'] = record['_id'].toRef()
            value['_rev'] = record['_rev'].toRef()
            for key in self._fields:
                value_object = value[key]
                record_object = record[key]
                if value_object.type == 'undefined':
                   value[key] = record_object.toRef()
                   continue
                if JSON.stringify(value_object.toRef()).toString() != JSON.stringify(record_object.toRef()).toString():
                   set_indexes += [set_index(self._name, key, value_object.type, value_object, id).keep()]
                   del_indexes += [del_index(self._name, key, record_object.type, record_object, id).toRef()]
                   #record[key] = value_object.toRef()
        Global().Promise.all(JSON.fromList(del_indexes)).wait()
        #TODO
        db = get_db()
        db.bulkDocs(values.toRef()).wait()
        for index in set_indexes: index.release().call()
        #Global()['Promise'].new(JSON.fromList([index.release().call() for index in indexes])).wait()
        if self._length == 1:
           record = self
           record.update(values.toList()[0])
           return record
        index = 0
        for record in self:
            value = values[str(index)]
            record.update(value)
            index += 1
        return self

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(is_env=True)

env = Environment()
