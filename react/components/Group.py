from react import Component, Text
from react.components import Grid, Typography

class Props: pass

@Component(Props=Props)
class Group:

    def render(self):
        string = self.props['string']
        return (
            Grid (className='solu-group-flexbox', item=True, xs=12, sm=6 if self.props['width'].toString() != '100%' else 0, style={'minWidth': '200px', 'display': 'flex', 'flexFlow': 'column'}, children=[ #TODO Material UI's Grid actually warns that the valid value would be numbers, boolean or 'auto'. But RPython doesn't support mixing types or nullable number
                Typography (style={} if string.type == 'string' else {'visibility': 'hidden'}, variant='h6', gutterBottom=True, children=[
                    Text (string.toString() if string.type == 'string' else 'Separator')
                ])
            ] + self.children)
        )
