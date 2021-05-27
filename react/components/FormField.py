from react import Component
from react.components import TextInput, NumberInput, BooleanInput, DateInput, DateTimeInput, SelectInput, ReferenceInput, AutocompleteInput, Labeled
from react.components.TreeField import Field as ShowField
from javascript import JSON, Object
from orm import models
from orm.tools import SelectionField, RelationalField, InversedRelationalField, merge

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
            ReferenceInput (source=name, reference=field.relation, props=merge(props, {'allowEmpty': JSON.fromBoolean(True)}), children=[
                AutocompleteInput (props={'optionText': models.env[field.relation]._rec_name if field.relation in models.env.models else 'name'})
            ]) if field.type in ['many2one', 'one2one'] and isinstance(field, RelationalField) else
            #TODO ReferenceArrayInput
            TextInput (source=name, props=props)
        )

class Props: pass

@Component(Props=Props) #, Pure=True)
class Field:

    form = None

    def render(self):
        props = {}
        for key in self.props:
            props[key] = self.props[key].toRef()
        show_only = '/show' in Object.get('window', 'location', 'hash').toString() #self.props['is_show_view'].toBoolean()
        if show_only:
           props['string'] = ""
           props['field_props'] = self.props['field_props'].toRef() #JSON.fromDict({'record': self.props['record'].toRef()})
        #if self.form is not None:
           #props['record'] = self.form.native_props['record']
           #show_only = Object.fromDict(self.form.native_props)['is_show_view'].toBoolean()
           #print show_only
           #if show_only: props['string'] = ""
        model = None
        name = self.props['name'].toString()
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None:
           string = name[0].upper() + name[1:]
           return (
               Labeled (label=string, children=[
                   InputField (props=props) if not show_only else ShowField (props=props)
               ])
           )
        field = models.env[model]._fields_object[name]
        string = field.string
        if self.props['string'].type == 'string': string = self.props['string'].toString()
        return (
            Labeled (label=string, children=[
                InputField (props=props) if not show_only else ShowField (props=props)
            ])
        )
