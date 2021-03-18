import os
import imp

current = os.path.dirname(os.path.realpath(__file__))

for dir in os.listdir(current):
    if dir[0] == '_' or '.' in dir: continue
    exec('import ' + dir, globals())
