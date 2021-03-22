from react.components import View, SafeAreaView, BreadProvider
from react.components.Routes import Routes
from javascript import JSON, Object, function
from orm import configuration

def App():
    is_web = Object.get('Module', 'Native', 'Platform', 'OS').toString() == 'web'
    return (
        View (style={'flex': JSON.fromInteger(1)}, children=[
            BreadProvider (value={'primary': JSON.fromDict({'main': configuration.theme_color}), 'text': JSON.fromDict({'fontFamily': '"Gotham-Book", "Helvetica Neue", Helvetica, Arial, sans-serif'} if is_web else {})}, children=[
                SafeAreaView (style={'flex': JSON.fromInteger(1)}, children=[
                    Routes()
                ])
            ])
        ])
    )
