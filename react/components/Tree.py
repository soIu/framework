from react import Component, initial_state, unmount_state
from react.components import View, TableHeader as Header, TableRow as Row, TableCell as Cell, TablePagination as Pagination
from react.components.Page import Page
from javascript import JSON, Object, asynchronous
from orm import models, tools

def log(number):
    #print number
    return number

class State:
    page = 0
    perPage = 50
    numberOfRows = 0
    numberOfPages = 1

@Component(State=State)
class Tree:

    def constructor(self):
        self.react_state = initial_state(self, JSON.fromDict({'records': JSON.fromList([]), 'records_formatted': JSON.fromList([])}))
        #print self.state.numberOfRows
        #print self.state.numberOfPages

    @asynchronous
    def mount(self):
        state = self.react_state
        router = Object.get('Module', 'router')
        model = None
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None: model = router['match']['params']['model'].toString()
        if model not in models.env.models: return
        records = models.env[model].search([], limit=self.state.perPage).wait()
        state['records'] = records.read().toRef()
        self.state.numberOfRows = len(records)
        self.state.numberOfPages = len(records) / self.state.perPage
        if not self.state.numberOfPages:
           self.state.numberOfPages = 1
        print self.state.numberOfRows
        print self.state.numberOfPages
        self.setState()

    def unmount(self):
        unmount_state(self)

    def render(self):
        router = Object.get('Module', 'router')
        model = None
        if self.props['model'].type == 'string':
           model = self.props['model'].toString()
        if model is None: model = router['match']['params']['model'].toString()
        print model
        if model not in models.env.models: return View()
        title = self.props['title'].toString()
        children = self.props['children']
        if children.type in ['null', 'undefined']:
           children = tools.Global()['Array'].new()
        elif children.type == 'object':
           children = tools.Global()['Array'].new(children.toRef())
        tree = (
            View ([
                Header (title=title, rightActions=[JSON.fromDict({'name': 'filter-list'}), JSON.fromDict({'name': 'add'})]),
                Row (hover=False, children=[
                    Cell (style={'height': '100%'}, type='header', text=child['props']['string'].toString() if child['props']['string'].type == 'string' else models.env[model]._fields_object[child['props']['name'].toString()].string)
                for child in children.toArray()])] + [
                Row (key=record['id'].toString(), hover=True, children=[ #TODO onPress
                    Cell (text=record[child['props']['name'].toString()].toString())
                for child in children.toArray()])
                for record in self.react_state['records'].toArray()] + [
                Pagination (page=self.state.page, perPage=self.state.perPage, numberOfRows=log(self.state.numberOfRows), numberOfPages=log(self.state.numberOfPages))
            ])
        )
        self.props.log()
        return (
            Page (menu_id=self.props['orm_menu_id'].toRef(), history=router['history'].toRef(), children=[tree])
        )
