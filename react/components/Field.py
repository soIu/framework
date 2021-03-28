from react import Component
from react.components import View

class State: pass

@Component(State=State)
class Field:

    def render(self):
        return View()
