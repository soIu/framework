from react import Component
from react.components import CardContent, Grid
from javascript import JSON

class Props: pass

@Component(Props=Props)
class Sheet:

    def render(self):
        return (
            CardContent ([
                Grid (container=True, spacing=1, children=self.children)
            ])
        )
