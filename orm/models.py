from . import get_db

class Model(object):
    _name = None
    _inherit = False
    _rec_name = 'name'
    _fields = {}

    def __init__(self):
        self.env = env

class Environment:
    models = {}

env = Environment()
