from react import Component
from react.components import Grid

class Props: pass

@Component(Props=Props)
class Group:

    def render(self):
        return (
            Grid (item=True, xs=6, style={'minWidth': '200px', 'display': 'grid'}, children=self.children)
        )
