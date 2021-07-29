from react import Component, Text
from react.components import Button as MaterialButton
from javascript import Object, function

class Props: pass

@Component(Props=Props)
class Button:

    @function(asynchronous=True)
    def onClick(id, model_object, method_name, redirect):
        model = model_object.toString()
        if model not in models.env.models: return
        record = models.env[model].browse(id.toString()).wait()
        #TODO custom button
        if method_name not in record._custom_methods[method_name]: return
        record._custom_methods[method_name](record).wait()
        value = record.read()
        redirect.call('show', '/' + model.toString(), id.toRef(), value.toRef())

    def render(self):
        hash = Object.get('window', 'location', 'hash')['split'].call('/')
        model = hash['1']
        id = hash['2']
        redirect = Object.get('Module', 'Admin', 'useRedirect').call()
        name = self.props['name']
        return (
            MaterialButton (variant='contained', type='button', onClick=Object.createClosure(self.onClick, id, model, name, redirect).toRef(), children=[
                Text (name.toRef())
            ])
        )
