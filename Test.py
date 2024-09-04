import react as React

from expo__status__bar import StatusBar

import pyrex

console.log('hoyhoy');

Statusbar, Text, View, Image, Touchable = pyrex.component(
    StatusBar,
    pyrex.kwargs(require('react-native'), [
        'Text',
        'View',
        'Image',
        'TouchableOpacity',
    ]),
)

log = lambda value: console.log(value) and value

def Client():
    return (
        View (style={}, children=[
            Statusbar (style='light'),
            Text ('dari python client 2'),
        ])
    )

__default__ = 'Client'
