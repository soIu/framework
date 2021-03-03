from . import get_db

class Model(object):
    _name = None
    _inherit = False
    _rec_name = 'name'
    _fields = {}

    def __init__(self, env=False):
        self.env = env
        self.is_env = env

class Environment:
    models = {}

    def __getitem__(self, key):
        model = self.models[key]
        return model(env=True)

env = Environment()
