from react import Component, Text
from javascript import JSON, Object, types, function, method

@Component
class div:
    style = {}
    onClick = types.function

@Component
class input:
    style = types.dict
    onChange = types.ref
    value = types.str

@function
def onClickStyled(event):
    alert = Object('alert')
    alert.call(event['target']['outerHTML'].toRef())

def StyledText():
    return (
      div (style={}, onClick=onClickStyled, children=[
        Text ('halo dari rpython'),
      ])
    )

Method = JSON.fromMethod()

class State:

    text = 'input dari rpython'

@Component(State=State)
class EditableText:

    @method
    def onChange(self, event):
        self.state.text = event['target']['value'].toString()
        return self.setState()

    def render(self):
        return (
          input (onChange=Method(self.onChange), value=self.state.text)
        )

def App():
    return (
      div ([
        #StyledText (),
        EditableText (),
        EditableText (),
      ])
    )

def main(argv):
    #createElement = Object('window.React.createElement').toFunction()
    render = Object('window.ReactDOM.render').toFunction()
    app = Object("document.getElementById('app')").toRef()
    render(App().toRef(), app)
    return 0

def target(*args):
    return main, None
