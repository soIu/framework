'use server';

import pyrex

"""Text, View, Image = pyrex['default'].component(
    pyrex['default'].kwargs(await JS('import')('react-native-web'), [
        'Text',
        'View',
        'Image',
    ]),
)"""

console.log(pyrex)

View, App = pyrex['default'].component(
    'div',
    require('./App.jsx'),
    require('./Another.py'),
)

async def componentFromServer():
    #JS("'use server';")
    console.log(await eval('require')('fs').promises.readdir('./'))
    return View (style={}, children=[
         ('ini dari python server'),
         App (),
    ])

__all__ = ['componentFromServer']
