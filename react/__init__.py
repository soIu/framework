from .pyrex import *
from javascript import Object

mobile_breakpoint = 767

def check_is_mobile():
    width = Object.get('Module', 'Native', 'Dimensions')['get'].call('window')['width'].toInteger()
    if width <= mobile_breakpoint: return True
    return False
