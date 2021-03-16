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

def get_records(ids):
    db = get_db()
    return db['allDocs'].call(JSON.fromDict({'keys': JSON.fromList(ids), 'include_docs': JSON.fromBoolean(True)}))

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(env=True)

env = Environment()
