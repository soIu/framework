from javascript import asynchronous
from .. import get_db, tools, data

@asynchronous
def init():
    get_db()
    data.run().wait()
    return

def init_compile():
    tools.register_models()
    return
