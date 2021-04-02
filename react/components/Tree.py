from react import Component
from react.components import List, Datagrid

class State: pass

@Component(State=State)
class Tree:

    def render(self):
        props = {}
        for key in self.props:
            props[key] = self.props[key].toRef()
        return (
            List (title=self.props['title'].toString(), props=props, children=[
                Datagrid (self.children)
            ])
        )
