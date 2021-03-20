import os
import imp

current = os.path.dirname(os.path.realpath(__file__))

def load(module=None):
    if module:
       exec('import ' + module, globals())
       return globals()[module]
    for dir in os.listdir(current):
        if dir[0] == '_' or '.' in dir: continue
        exec('import ' + dir, globals())
