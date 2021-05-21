from react import Component
from react.components import TextInput, NumberInput, BooleanInput, DateInput, DateTimeInput, SelectInput, ReferenceInput
from javascript import JSON
from orm import models
from orm.tools import SelectionField

class State: pass

@Component(State=State, Pure=True)
class Field:

    def render(self):
        model = None
        props = {}
        #if self.props['alwaysOn'].type == 'boolean':
        #   props['alwaysOn'] = self.props['alwaysOn'].toRef()
        name = self.props['name'].toString()
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None or model not in models.env.models:
           string = name[0].upper() + name[0:]
           if self.props['string'].type == 'string': string = self.props['string'].toString()
           return (
               TextInput (source=name, label=string, props=props)
           )
        field = models.env[model]._fields_object[name]
        string = field.string
        if self.props['string'].type == 'string': string = self.props['string'].toString()
        return (
            NumberInput (source=name, label=string, props=props) if field.type in ['integer', 'float'] else
            BooleanInput (source=name, label=string, props=props) if field.type == 'boolean' else
            DateInput (source=name, label=string, props=props) if field.type == 'date' else
            DateTimeInput (source=name, label=string, props=props) if field.type == 'datetime' else
            SelectInput (source=name, label=string, props=props, choices=[JSON.fromDict({'id': id, 'name': name}) for id, name in field.selection()]) if isinstance(field, SelectionField) else
            #TODO ReferenceInput
            TextInput (source=name, label=string, props=props)
        )
