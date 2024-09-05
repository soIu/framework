import react as React

from expo__status__bar import StatusBar

import pyrex

console.log('dor');

Statusbar, Text, View, Image, Touchable = pyrex.component(
    StatusBar,
    pyrex.kwargs(await JS('import')('react-native'), [
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
            #Touchable (onPress=lambda: require('./server.py').componentFromServer(), children=[
            #Touchable (onPress=lambda: (require('./test.jsx'))(), children=[
                Text ('dari python client'),
            #]),
        ])
    )

__default__ = 'Client'
