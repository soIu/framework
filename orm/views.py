from . import tools

import xml.etree.ElementTree as Tree

import inspect
import os

views = {}

def add(file=None, model=None, type=None, id=None, arch=None):
    if tools.check_server(): return
    if file:
       dir = os.path.dirname(os.path.realpath(inspect.stack()[1][1]))
       root = Tree.fromstring('<root>' + open(os.path.join(dir, file), 'r').read() + '</root>')
       for view in root._children:
           if not model and 'model' not in view.attrib and not id and 'id' not in view.attrib:
              raise Exception("Can't find model or view id")
           if 'model' in view.attrib: model = model = view.attrib['model']
           if 'id' in view.attrib: id = view.attrib['id']
           view = view._children[0]
           if id: views[id] = view
           if model:
              views[model + '.' + view.tag] = view
    elif not arch: raise Exception("Can't find XML")
    #TODO Parse XML from string with arch argument
