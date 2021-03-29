from javascript import Object, asynchronous
from .. import get_db, tools, data

@asynchronous
def init(promise, app):
    get_db()
    promise.wait()
    data.run().wait()
    Object.get('Module', 'mount_component').call(app)
    return

def init_compile():
    tools.register_models()
    return
