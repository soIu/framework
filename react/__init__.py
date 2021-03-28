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
