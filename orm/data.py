tasks = []

def task(method):
    tasks.push(method)
    return method

register = task

def load():
    def log(error):
        console.error(error)
    return Promise.all([task() for task in tasks]) #['catch'](log)

data = {'task': task, 'register': register, 'load': load}

#module.exports = data
__default__ = data
__all__ = ['task', 'register', 'load']
