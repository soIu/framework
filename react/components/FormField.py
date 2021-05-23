from react import Component
from react.components import TextInput, NumberInput, BooleanInput, DateInput, DateTimeInput, SelectInput, ReferenceInput, Labeled
from javascript import JSON
from orm import models
from orm.tools import SelectionField

class State: pass

@Component(State=State, Pure=True)
class InputField:

    def render(self):
        model = None
        props = {'label': ""}
        if self.props['record'].type == 'object': props['record'] = self.props['record'].toRef()
        name = self.props['name'].toString()
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None or model not in models.env.models:
           string = name[0].upper() + name[1:]
           if self.props['string'].type == 'string': string = self.props['string'].toString()
           if self.props['is_filter'].type == 'boolean': props['label'] = string
           return (
               TextInput (source=name, props=props)
           )
        field = models.env[model]._fields_object[name]
        string = field.string
        if self.props['string'].type == 'string': string = self.props['string'].toString()
        if self.props['is_filter'].type == 'boolean': props['label'] = string
        return (
            NumberInput (source=name, props=props) if field.type in ['integer', 'float'] else
            BooleanInput (source=name, props=props) if field.type == 'boolean' else
            DateInput (source=name, props=props) if field.type == 'date' else
            DateTimeInput (source=name, props=props) if field.type == 'datetime' else
            SelectInput (source=name, props=props, choices=[JSON.fromDict({'id': id, 'name': name}) for id, name in field.selection()]) if isinstance(field, SelectionField) else
            #TODO ReferenceInput
            TextInput (source=name, props=props)
        )

class Props: pass

@Component(Props=Props)
class Field:

    form = None

    def render(self):
        props = {}
        for key in self.props:
            props[key] = self.props[key].toRef()
        if self.form is not None:
           props['record'] = self.form.native_props['record']
        model = None
        name = self.props['name'].toString()
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None:
           string = name[0].upper() + name[1:]
           return (
               Labeled (label=string, children=[
                   InputField (props=props)
               ])
           )
        field = models.env[model]._fields_object[name]
        string = field.string
        if self.props['string'].type == 'string': string = self.props['string'].toString()
        return (
            Labeled (label=string, children=[
                InputField (props=props)
            ])
        )
