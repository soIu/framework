from react import Component
from react.components import Toolbar

class Props: pass

@Component(Props=Props)
class Footer:

    def render(self):
        return (
            Toolbar (children=self.children)
        )
