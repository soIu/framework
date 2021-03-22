from react.components.Page import Page
from javascript import function

@function
def HomePage(props):
    return (
        Page (history=props['history']).toObject()
    )
