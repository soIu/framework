from javascript import asynchronous
from . import get_db, tools

@asynchronous
def init():
    get_db()
    return

def init_compile():
    tools.register_models()
    return
