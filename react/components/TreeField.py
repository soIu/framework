from react import Component
from react.components import TextField, NumberField, BooleanField, DateField, DateTimeField, SelectField, ReferenceField
from javascript import JSON
from orm import models
from orm.tools import SelectionField

class State: pass

@Component(State=State, Pure=True)
class Field:

    def render(self):
        model = None
        name = self.props['name'].toString()
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None or model not in models.env.models:
           string = name[0].upper() + name[0:]
           if self.props['string'].type == 'string': string = self.props['string'].toString()
           return (
               TextField (source=name, label=string)
           )
        field = models.env[model]._fields_object[name]
        string = field.string
        if self.props['string'].type == 'string': string = self.props['string'].toString()
        return (
            NumberField (source=name, label=string) if field.type in ['integer', 'float'] else
            BooleanField (source=name, label=string) if field.type == 'boolean' else
            DateField (source=name, label=string) if field.type == 'date' else
            DateTimeField (source=name, label=string) if field.type == 'datetime' else
            SelectField (source=name, label=string, choices=[JSON.fromDict({'id': id, 'name': name}) for id, name in field.selection()]) if isinstance(field, SelectionField) else
            #TODO ReferenceField
            TextField (source=name, label=string)
        )
