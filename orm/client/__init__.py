from javascript import Object, asynchronous
from .. import get_db, tools, data, menu, models

@asynchronous
def init(promise, app):
    get_db()
    promise.wait()
    data.run().wait()
    Object.get('Module', 'mount_native_component').call(app.toRef())
    return

def init_compile():
    tools.register_models()
    return
