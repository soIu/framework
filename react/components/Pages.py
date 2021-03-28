from react import check_is_web
from react.components import CSSTransition, View, TableHeader as Header, Button, Text, Div, TextField, IconButton
from react.components.Page import Page
from react.components.Tree import Tree
from react.components.Field import Field
from javascript import JSON, Object, function
from orm.views import views

components = {component.__name__: component for component in [Tree, Field]}

@function
def HomePage(props):
    if props['match'].type != 'null': #and Object.get('Module', 'router').type == 'undefined':
       Object.get('Module')['router'] = JSON.fromDict({'match': props['match'].toRef(), 'history': props['history'].toRef(), 'location': props['location'].toRef()})
    dimensions = Object('Module.Native.Dimensions.get').call('window')
    page = (
        Page (title='Home', history=props['history'].toRef(), children=[
            View ([
                View (style={'borderBottomColor': '#e1e1e1', 'borderBottomStyle': 'solid', 'borderBottomWidth': JSON.fromInteger(0.5)}, children=[
                    Header (title='Inbox', rightActions=[JSON.fromDict({'name': 'filter-list'}), JSON.fromDict({'name': 'more-vert'})]),
                    View (style={'flex': JSON.fromInteger(1), 'flexDirection': 'row'}, children=[
                        Button (style={'margin': JSON.fromInteger(10), 'marginTop': JSON.fromInteger(0)}, text='Mark All Read', type='text'),
                    ])
                ]),
                View (style={'width': dimensions['width'].toRef(), 'height': JSON.fromInteger(dimensions['height'].toInteger() - 110.5 - 56 - 56)}),
                TextField (type='outlined', leadingIcon=IconButton(name='attachment', size=24, color='#6e6e6e').toRef(), trailingIcon=IconButton(name='send', size=24, color='#6e6e6e').toRef(), style={'borderRadius': JSON.fromInteger(0)}, containerStyle={'marginTop': JSON.fromInteger(0)})
            ])
        ])
    ) if props['match'].type != 'null' else None
    if check_is_web():
       #return CSSTransition ([page], props={'in': JSON.fromBoolean(props['match'].type != 'null')}, timeout=300, unmountOnExit=True, classNames='rpython-page').toObject()
       return (
           CSSTransition (props={'in': JSON.fromBoolean(props['match'].type != 'null')}, timeout=250, unmountOnExit=True, classNames='rpython-page', children=[
               Div (className='rpython-page', children=[page])
           ])
       ).toObject()
    if page is None: return None
    return page and page.toObject()

@function
def TreePage(props):
    if props['match'].type != 'null': #and Object.get('Module', 'router').type == 'undefined':
       Object.get('Module')['router'] = JSON.fromDict({'match': props['match'].toRef(), 'history': props['history'].toRef(), 'location': props['location'].toRef()})
    page = None
    if props['match'].type != 'null':
       view = get_view(props['match']['params']['model'].toString() + '.tree' if props['location']['pathname'].toString().startswith('/tree/') else None)
       if view is not None:
          page = view #recurseView(view)
          #page = (
          #    Page (title=props, history=props['history'].toRef(), children=[
          #        recurseView(view)
          #    ])
          #)
    if check_is_web():
       #return CSSTransition ([page], props={'in': JSON.fromBoolean(props['match'].type != 'null')}, timeout=300, unmountOnExit=True, classNames='rpython-page').toObject()
       return (
           CSSTransition (props={'in': JSON.fromBoolean(props['match'].type != 'null')}, timeout=250, unmountOnExit=True, classNames='rpython-page', children=[
               Div (className='rpython-page', children=[page])
           ])
       ).toObject()
    if page is None: return None
    return page.toObject()

"""def recurseView(view):
    component = None
    component_name = view.tag[0].upper() + view.tag.lower()[1:]
    if component_name in components:
       component = components[component_name]
    if component is None and view.tag in components:
       component = components[view.tag]
    if component is None: return component
    return component(props=view.attrib, children=[recurseView(children) for children in view._children])"""

def recurseView(view):
    component = None
    component_name = view.tag[0].upper() + view.tag.lower()[1:]
    if component_name in components:
       component = components[component_name]
    if component is None and view.tag in components:
       component = components[view.tag]
       component_name = view.tag
    if component is None: return component
    #return component(props=view.attrib, children=[recurseView(children) for children in view._children])
    children = [recurseView(children) for children in view._children]
    def renderView():
        return component(props=view.attrib, children=[child for child in children if child is not None])
    return renderView()

compiled_views = {}

for view in views:
    if not view.endswith('.tree'): continue
    compiled_views[view] = recurseView(views[view])

def get_view(id):
    if id in compiled_views: return compiled_views[id]
    print "View with id %s doesn't exist" % id
    return None
