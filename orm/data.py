from javascript import asynchronous

tasks = []

def register(function):
    tasks.append(function)

@asynchronous
def run():
    wait(native=[task() for task in tasks])
