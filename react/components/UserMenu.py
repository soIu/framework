from react import Component, Method
from react.components import Menu, MenuItem, Button
from javascript import JSON, Object, function
from orm import models

Method, method = Method(lambda: UserMenu)

Function = JSON.fromFunction

class State:
    visible = False

@Component(State=State)
class UserMenu:

    @method
    def onPress(self):
        self.state.visible = True
        print self.state.visible
        self.setState()

    @method
    def onBackdropPress(self):
        self.state.visible = False
        self.setState()

    def render(self):
        print self.state.visible
        button = (
            Button (textColor='white', text=models.env.user.name, onPress=Method(self, UserMenu.onPress), type='text', useInputCasing=True)
        )
        return (
            Menu (modalMenuStyle={'right': JSON.fromInteger(-1)}, visible=self.state.visible, onBackdropPress=Method(self, UserMenu.onBackdropPress), button=button.toRef(), children=[
                MenuItem (text='Logout', onPress=Function(logout))
            ])
        )

@function(asynchronous=True)
def logout():
    db = Object.get('window', 'PouchDB').call('session')
    db['destroy'].call().wait()
    Object('window', 'location', 'reload').call()

