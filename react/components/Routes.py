from react import component_from_object
from react.components import View, Router, Route, AnimatedStack, BackButton
from react.components.Pages import HomePage, TreePage #, FormPage
from javascript import JSON, Object, function

def Routes():
    is_web = Object.get('Module', 'Native', 'Platform', 'OS').toString() == 'web'
    routes = [
        Route (exact=True, path='/', component=JSON.fromFunction(HomePage) if not is_web else None, children=[component_from_object(Object.fromFunction(HomePage))] if is_web else []),
        Route (exact=True, path='/tree/:model', component=JSON.fromFunction(TreePage) if not is_web else None, children=[component_from_object(Object.fromFunction(TreePage))] if is_web else []),
        #Route (exact=True, path='/form/:model', component=JSON.fromFunction(FormPage)),
        #Route (exact=True, path='/form/:model/:id', component=JSON.fromFunction(FormPage)),
        #Route (exact=True, path='/view/:view_id', component=None),
        #Route (exact=True, path='/view/:view_id/:id', component=None),
    ]
    return (
        Router ([
            View ([
                BackButton() if not is_web else None,
                AnimatedStack (swipable=False, children=routes) if not is_web else None,
            ] + (routes if is_web else []))
        ])
    )
