from react import Component, component_from_object
from react.components import Box, Card, CardContent, Toolbar, Form as FormDefault, FormWithRedirect, Fragment
from javascript import JSON, Object, function

class Props: pass

@Component(Props=Props)
class Form:

    fields = None

    @function
    def render_form(is_show_view, model, component, formProps):
        #Maybe needs to refactor this to support TabbedForm (notebook -> page) and Wizards
        return (
            Box ([
                Card ([
                    #CardContent ([
                    #    component_from_object(component)
                    #]),
                    component_from_object(component),
                    Toolbar (props={'redirect': 'list', 'record': formProps['record'].toRef(), 'basePath': formProps['basePath'].toRef(), 'undoable': JSON.fromBoolean(False), 'invalid': formProps['invalid'].toRef(), 'handleSubmitWithRedirect': formProps['handleSubmitWithRedirect'].toRef(), 'save': formProps['save'].toRef(), 'saving': formProps['saving'].toRef(), 'resource': model.toRef()}) if not is_show_view.toBoolean() else None
                ])
            ])
        ).toObject()

    def render(self):
        props = {} #'redirect': 'show'}
        for key in self.props:
            props[key] = self.props[key].toRef()
        fragment = Fragment (children=self.children).toObject()
        render = Object.createClosure(self.render_form, self.props['is_show_view'], self.props['model'], fragment) #.toRef()
        #if self.props['is_show_view'].toBoolean():
        #   return component_from_object(render.call(self.props.toRef()))
        FormComponent = FormWithRedirect #if not self.props['is_show_view'].toBoolean() else FormDefault
        return (
            FormComponent (render=render.toRef(), props=props)
        )
