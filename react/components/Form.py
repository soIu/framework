from react import Component, component_from_object
from react.components import Box, Card, CardContent, Toolbar, FormWithRedirect, Fragment
from javascript import JSON, Object, function

class Props: pass

@Component(Props=Props)
class Form:

    @function
    def render_form(component, formProps):
        #Maybe needs to refactor this to support TabbedForm (notebook -> page) and Wizards
        return (
            Box ([
                Card ([
                    CardContent ([
                        component_from_object(component)
                    ]),
                    Toolbar (props={'record': formProps['record'].toRef(), 'basePath': formProps['basePath'].toRef(), 'undoable': JSON.fromBoolean(True), 'invalid': formProps['invalid'].toRef(), 'handleSubmit': formProps['handleSubmit'].toRef(), 'saving': formProps['saving'].toRef(), 'resource': 'commands'})
                ])
            ])
        ).toObject()

    def render(self):
        
        props = {}
        for key in self.props:
            props[key] = self.props[key].toRef()
        fragment = Fragment (children=self.children).toObject()
        render = Object.createClosure(self.render_form, fragment).toRef()
        return (
            FormWithRedirect (render=render, props=props)
        )
