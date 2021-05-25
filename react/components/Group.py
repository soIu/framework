from react import Component, Text
from react.components import Grid, Typography

class Props: pass

@Component(Props=Props)
class Group:

    def render(self):
        string = self.props['string']
        return (
            Grid (className='solu-group-flexbox', item=True, xs=12, sm=6, style={'minWidth': '200px', 'display': 'flex', 'flexFlow': 'column'}, children=[
                Typography (style={} if string.type == 'string' else {'visibility': 'hidden'}, variant='h6', gutterBottom=True, children=[
                    Text (string.toString() if string.type == 'string' else 'Separator')
                ])
            ] + self.children)
        )
