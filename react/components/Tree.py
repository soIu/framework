from react import Component
from react.components import List, Datagrid
from javascript import JSON

class State: pass

@Component(State=State)
class Tree:

    def render(self):
        props = {}
        for key in self.props:
            props[key] = self.props[key].toRef()
        props['empty'] = JSON.fromBoolean(False)
        grid = Datagrid (rowClick='show', children=self.children)
        if not self.props['is_tree_view'].toBoolean(): return grid
        props['filters'] = self.filters()
        return (
            List (title=self.props['title'].toString(), props=props, children=[
                grid
            ])
        )
