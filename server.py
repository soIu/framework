from javascript import Object

def main(argv):
    console = Object('console')
    console['log'].call('Hello')
    return 0

def target(*args): return main, None
