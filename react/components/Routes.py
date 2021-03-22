from react.components import View, Router, Route, Switch, AnimatedSwitch, BackButton
from react.components.Pages import HomePage, TreePage, FormPage
from javascript import JSON, function

def Routes():
    is_web = Object.get('Module', 'Native', 'Platform', 'OS').toString() == 'web'
    Switch = Switch if is_web else AnimatedSwitch
    return (
        Router ([
            View ([
                BackButton() if not is_web else None,
                Switch ([
                    Route (exact=True, path='/', component=JSON.fromFunction(HomePage)),
                    #Route (exact=True, path='/tree/:model', component=JSON.fromFunction(TreePage)),
                    #Route (exact=True, path='/form/:model', component=JSON.fromFunction(FormPage)),
                    #Route (exact=True, path='/form/:model/:id', component=JSON.fromFunction(FormPage)),
                    #Route (exact=True, path='/view/:view_id', component=None),
                    #Route (exact=True, path='/view/:view_id/:id', component=None),
                ])
            ])
        ])
    )
