from .pyrex import *
from javascript import JSON, Object, asynchronous
from orm import tools

def check_is_web():
    return Object.get('Module', 'Native', 'Platform', 'OS').toString() == 'web'

mobile_breakpoint = 767

class Cache:
    dimensions_get = None

cache = Cache()

def check_is_mobile():
    if cache.dimensions_get is None:
       cache.dimensions_get = Object('Module.Native.Dimensions.get').keep()
    #width = Object.get('Module', 'Native', 'Dimensions', 'get').call('window')['width'].toInteger() For no reason this doesn't work
    width = cache.dimensions_get.call('window')['width'].toInteger()
    if width <= mobile_breakpoint: return True
    return False

def initial_state(initial, current, id):
    initial = JSON.parse_rpy_json(initial)
    current = JSON.parse_rpy_json(current)
    ORM = Object.get('Module', 'orm')
    print initial
    print current
    if initial != current:
       promise, resolve = tools.create_promise()
       wait_initial_state(promise)
       ORM['react_initial_state_resolve_' + str(id)] = resolve.toRef()
    else:
       ORM['react_initial_state_resolve_' + str(id)].call()

from rlib.objectmodel import current_object_addr_as_int as component_id

@asynchronous
def wait_initial_state(promise):
    promise.wait()
