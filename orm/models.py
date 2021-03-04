from . import get_db, tools
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

    def update(self, values):
        return self

    @asynchronous
    def browse(self, id=None, ids=None):
        if id is None and ids is None:
           raise Exception('You have to send either id or ids as the argument')
        singleton = id is not None
        uuids = [id] if ids is None else ids
        records = get_records(uuids).wait()
        if singleton:
           record = self._model()
           record.id = id
           record.ids = uuids
           record.update(records['0'])
        return self

def get_records(ids):
    Array = Global()['Array']
    array = Array.new()
    Promise = Global()['Promise']
    promise = Promise.new(Object.createClosure(get_record_handle, Object.fromList(ids), array).toRef())
    return promise

@function
def get_record_handle(ids, results, resolve, reject):
    db = get_db()
    length = ids['length']
    closure = Object.createClosure(append_record, resolve, reject, length, results)
    for id in ids.toArray():
        db.get(id.toRef()).once(closure.toRef())

@function
def append_record(resolve, reject, length, results, result):
    if result['ok'].toBoolean():
       results['push'].call(result.toRef())
       if results['length'].toInteger() == length.toInteger():
          resolve(results.toRef())

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(env=True)

env = Environment()
